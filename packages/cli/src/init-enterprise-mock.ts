/**
 * 企业版模拟初始化器
 *
 * 此文件在应用启动时自动检查并启用企业版功能模拟
 * 开发和测试环境自动生效；生产环境需显式设置 N8N_ENTERPRISE_MOCK=true
 * 或传入 --enterprise-mock 参数
 */

import { Container } from '@n8n/di';
import { License } from '@/license';
import { enableEnterpriseMock, EnterpriseLicenseMocker } from '@/license-mock-enterprise';

/**
 * 在许可证初始化后自动启用企业版模拟
 */
export async function initEnterpriseMock(): Promise<void> {
	// 检查是否应该启用企业版模拟
	if (!shouldEnableEnterpriseMock()) {
		return;
	}

	try {
		const license = Container.get(License);

		// 等待许可证初始化完成
		if (!license) {
			console.warn('[ENTERPRISE MOCK] License service not available');
			return;
		}

		// 启用企业版模拟
		enableEnterpriseMock(license);

		console.log('[ENTERPRISE MOCK] ✅ All enterprise features enabled for testing');
		console.log('[ENTERPRISE MOCK] Available features:');
		console.log('  - 🔐 SAML/LDAP/OIDC Authentication');
		console.log('  - 👥 Advanced Permissions & RBAC');
		console.log('  - 📁 Folders Organization');
		console.log('  - 🔄 Source Control (Git)');
		console.log('  - 🔑 External Secrets Management');
		console.log('  - 📚 Variables Management');
		console.log('  - 📈 Workflow History');
		console.log('  - 📊 Log Streaming');
		console.log('  - 🤖 AI Assistant & Credits');
		console.log('  - 🏢 Multi-Instance Support');
		console.log('  - 📦 S3 Binary Data Storage');
		console.log('  - 🛠️ Debug in Editor');
		console.log('  - 👁️ Worker View');
		console.log('  - 📊 Insights & Analytics');
		console.log('  - 🎯 Advanced Execution Filters');
	} catch (error) {
		console.error('[ENTERPRISE MOCK] Failed to enable enterprise mock:', error);
	}
}

/**
 * 检查是否应该启用企业版模拟
 */
function shouldEnableEnterpriseMock(): boolean {
	// 检查环境变量
	if (process.env.N8N_ENTERPRISE_MOCK === 'true') {
		return true;
	}

	// 检查是否为开发/测试环境，或是否有显式启用信号
	if (EnterpriseLicenseMocker.isMockAllowed()) {
		return true;
	}

	// 检查命令行参数
	if (process.argv.includes('--enterprise-mock')) {
		return true;
	}

	return false;
}

/**
 * 显示企业版模拟状态
 */
export function showEnterpriseMockStatus(): void {
	if (shouldEnableEnterpriseMock()) {
		console.log('');
		console.log('🚀 N8N ENTERPRISE MOCK ENABLED');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log('All enterprise features are unlocked for testing!');
		console.log('');
		console.log('⚠️  WARNING: This is for development/testing only');
		console.log('   Do NOT use in production environments');
		console.log('');
	}
}
