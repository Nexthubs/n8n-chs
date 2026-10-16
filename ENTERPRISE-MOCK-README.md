# N8N 企业版功能模拟

此文档说明如何在n8n项目中启用企业版功能模拟，用于开发和测试。

## ⚠️ 重要警告

开发和测试环境自动启用。生产环境（`NODE_ENV=production`）需显式设置
`N8N_ENTERPRISE_MOCK=true`（或传入 `--enterprise-mock`）才会启用。
请注意：n8n 企业版功能需要相应许可证，生产环境使用前请确认许可证合规。

## 🚀 快速开始



**启动应用**：
   ```bash
   N8N_ENTERPRISE_MOCK=true pnpm run dev
   ```

## 📋 可用的企业功能

启用模拟后，以下企业功能将可用，同时会自动隐藏"This n8n instance is not licensed for production purposes."横幅：

### 🔐 认证和安全
- ✅ SAML单点登录 (`feat:saml`)
- ✅ LDAP/Active Directory集成 (`feat:ldap`)
- ✅ OpenID Connect/OAuth 2.0 (`feat:oidc`)
- ✅ 高级权限管理 (`feat:advancedPermissions`)
- ✅ API密钥作用域 (`feat:apiKeyScopes`)

### 👥 协作和项目管理
- ✅ 工作流和凭证共享 (`feat:sharing`)
- ✅ 项目管理员角色 (`feat:projectRole:admin`)
- ✅ 项目编辑者角色 (`feat:projectRole:editor`)
- ✅ 项目查看者角色 (`feat:projectRole:viewer`)
- ✅ 文件夹组织 (`feat:folders`)

### 🛠️ 开发运维
- ✅ Git源代码控制 (`feat:sourceControl`)
- ✅ 环境变量管理 (`feat:variables`)
- ✅ 外部密钥管理 (`feat:externalSecrets`)
- ✅ 工作流版本历史 (`feat:workflowHistory`)
- ✅ 编辑器调试功能 (`feat:debugInEditor`)

### 🏗️ 基础设施和扩展
- ✅ 多主实例高可用 (`feat:multipleMainInstances`)
- ✅ S3二进制数据存储 (`feat:binaryDataS3`)
- ✅ 工作节点监控 (`feat:workerView`)
- ✅ 日志流式传输 (`feat:logStreaming`)
- ✅ 高级执行过滤器 (`feat:advancedExecutionFilters`)

### 🤖 AI和分析
- ✅ AI助手 (`feat:aiAssistant`)
- ✅ AI问答功能 (`feat:askAi`)
- ✅ AI积分系统 (`feat:aiCredits`)
- ✅ 洞察摘要视图 (`feat:insights:viewSummary`)
- ✅ 洞察仪表板 (`feat:insights:viewDashboard`)
- ✅ 按小时数据分析 (`feat:insights:viewHourlyData`)

### 📦 其他功能
- ✅ 自定义节点注册表 (`feat:communityNodes:customRegistry`)
- ✅ API禁用控制 (`feat:apiDisabled`)

## 🔧 配置选项

### 环境变量

在 `.env` 文件中设置：

```bash
# 启用企业版模拟（显式设置后在任意 NODE_ENV 下生效，包括 production）
N8N_ENTERPRISE_MOCK=true

# 禁用许可证服务器验证
N8N_LICENSE_SERVER_URL=
N8N_LICENSE_AUTO_RENEW_ENABLED=false

# 启用各种功能（可选）
N8N_SAML_ENABLED=true
N8N_LDAP_ENABLED=true
N8N_LOG_STREAMING_ENABLED=true
```

### 命令行参数

```bash
# 使用命令行参数启用
npm run dev -- --enterprise-mock
```

### 代码中检查

```javascript
// 检查是否启用了企业版模拟
if (process.env.N8N_ENTERPRISE_MOCK === 'true') {
    console.log('Enterprise features available');
}
```

## 🧪 测试企业功能

### 1. 测试用户权限管理
1. 访问 http://localhost:5678
2. 注册/登录账户
3. 进入 Settings > Users & Roles
4. 尝试邀请用户并分配不同角色

### 2. 测试文件夹功能
1. 在工作流页面点击 "New Folder"
2. 创建文件夹并组织工作流

### 3. 测试变量管理
1. 进入 Settings > Variables
2. 创建和管理环境变量

### 4. 测试源代码控制
1. 进入 Settings > Source Control
2. 配置Git仓库连接

### 5. 测试外部密钥
1. 进入 Settings > External Secrets
2. 配置外部密钥提供商




### 检查当前状态
启动应用后查看控制台输出，如果看到以下信息说明模拟已启用：
```
🚀 N8N ENTERPRISE MOCK ENABLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All enterprise features are unlocked for testing!
```

## 🎯 横幅控制

### 非生产许可证横幅

如果你在页面顶部看到 **"This n8n instance is not licensed for production purposes."** 横幅，这是由以下机制控制的：

1. **后端控制**: `packages/cli/src/services/frontend.service.ts:333`
   ```typescript
   showNonProdBanner: this.license.isLicensed(LICENSE_FEATURES.SHOW_NON_PROD_BANNER)
   ```

2. **前端显示**: `packages/frontend/editor-ui/src/stores/settings.store.ts:193-195`
   ```typescript
   if (settings.value.enterprise?.showNonProdBanner) {
       useUIStore().pushBannerToStack('NON_PRODUCTION_LICENSE');
   }
   ```

3. **模拟处理**: 我们的企业版模拟会自动将 `SHOW_NON_PROD_BANNER` 设置为 `false`，从而隐藏这个横幅。

### 手动隐藏横幅

如果横幅仍然显示，请确保：
- 企业版模拟已正确启用 (`N8N_ENTERPRISE_MOCK=true`)
- 重新启动应用
- 清除浏览器缓存

## 🛠️ 技术实现

### 核心文件
- `packages/cli/src/license-mock-enterprise.ts` - 企业版模拟核心逻辑
- `packages/cli/src/init-enterprise-mock.ts` - 初始化模拟功能
- `packages/cli/src/commands/base-command.ts` - 修改了 `base-command.ts` 文件，添加了企业版模拟功能
- `.env.enterprise-mock` - 企业版环境配置模板

### 工作原理
1. **许可证拦截**: 覆盖 `License` 服务的 `isLicensed()` 和 `getValue()` 方法
2. **功能启用**: 所有企业功能检查都返回 `true`
3. **配额设置**: 所有配额限制都设置为无限制 (`-1`)
4. **状态模拟**: 模拟企业版许可证状态和信息

### 安全考虑
- 需要显式设置 `N8N_ENTERPRISE_MOCK=true`
- 启动时会显示明显的警告信息

## 🐛 故障排除

### 问题1: 模拟未启用
**解决方案**:
1. 确认环境变量 `N8N_ENTERPRISE_MOCK=true`


### 问题2: 某些功能仍然被锁定
**解决方案**:
1. 重启应用
2. 检查浏览器控制台是否有错误
3. 确认前端许可证状态已更新


## 📞 支持

如果遇到问题，请检查：
1. 控制台输出中的企业版模拟状态
2. 环境变量设置
3. 补丁是否正确应用

这个模拟系统让你可以完整测试n8n的所有企业功能。开发和测试环境自动启用；
生产环境需显式设置 `N8N_ENTERPRISE_MOCK=true`，使用前请确认许可证合规。