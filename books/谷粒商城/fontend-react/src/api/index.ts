/**
 * 接口层出口：页面统一 `import { renrenApi, gulimallApi, assertOk } from '@/api'`。
 * http.ts（axios 基址/token/拦截器）与 feedback.ts（App 上下文里的 message/modal）是实现细节，
 * 只有需要 API_BASE / setToken 这类会话工具时才直接引 '@/api/http'。
 */
export { assertOk } from './http';
export * as renrenApi from './renren';
export * as gulimallApi from './gulimall';
