"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePageAuthRedirect = exports.checkIsAuthenticated = exports.checkAuth = exports.getPageAuthRequirement = exports.normalizePathname = exports.GUEST_ONLY_PATHS = void 0;
const axios_1 = __importDefault(require("axios"));
exports.GUEST_ONLY_PATHS = ['/signin', '/signup', '/oauth'];
const normalizePathname = (pathname) => {
    if (pathname.length > 1 && pathname.endsWith('/')) {
        return pathname.slice(0, -1);
    }
    return pathname;
};
exports.normalizePathname = normalizePathname;
const getPageAuthRequirement = (pathname) => {
    const path = (0, exports.normalizePathname)(pathname);
    if (exports.GUEST_ONLY_PATHS.includes(path)) {
        return 'guest';
    }
    if (path === '/500') {
        return 'none';
    }
    if (path === '/' ||
        path === '/game' ||
        path === '/leaderboard-page' ||
        path === '/profile' ||
        path.startsWith('/forum')) {
        return 'private';
    }
    return 'none';
};
exports.getPageAuthRequirement = getPageAuthRequirement;
const getServerUrl = () => {
    var _a, _b;
    return (_b = (_a = process.env.INTERNAL_SERVER_URL) !== null && _a !== void 0 ? _a : process.env.EXTERNAL_SERVER_URL) !== null && _b !== void 0 ? _b : 'http://localhost:3001';
};
const isServerError = (status) => status >= 500;
const checkAuthStatusOnce = async (cookie) => {
    try {
        const { status } = await axios_1.default.get(`${getServerUrl()}/auth/user`, {
            headers: { Cookie: cookie },
            validateStatus: () => true,
        });
        if (status === 200) {
            return { kind: 'authenticated' };
        }
        if (isServerError(status)) {
            return { kind: 'unavailable' };
        }
        return { kind: 'unauthenticated' };
    }
    catch {
        return { kind: 'unavailable' };
    }
};
const resolveAuthStatusResponse = (response) => {
    if (response.kind === 'authenticated') {
        return 'authenticated';
    }
    if (response.kind === 'unauthenticated') {
        return 'unauthenticated';
    }
    return null;
};
const checkAuth = async (req) => {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return 'unauthenticated';
    }
    const first = await checkAuthStatusOnce(cookie);
    const firstResult = resolveAuthStatusResponse(first);
    if (firstResult != null) {
        return firstResult;
    }
    const second = await checkAuthStatusOnce(cookie);
    const secondResult = resolveAuthStatusResponse(second);
    if (secondResult != null) {
        return secondResult;
    }
    return 'unavailable';
};
exports.checkAuth = checkAuth;
const checkIsAuthenticated = async (req) => {
    const status = await (0, exports.checkAuth)(req);
    return status === 'authenticated';
};
exports.checkIsAuthenticated = checkIsAuthenticated;
const resolvePageAuthRedirect = async (req) => {
    const pathname = new URL(req.originalUrl || req.url, 'http://localhost')
        .pathname;
    const requirement = (0, exports.getPageAuthRequirement)(pathname);
    if (requirement === 'none') {
        return null;
    }
    const authStatus = await (0, exports.checkAuth)(req);
    if (requirement === 'private') {
        if (authStatus === 'unauthenticated') {
            return '/signin';
        }
        if (authStatus === 'unavailable') {
            return '/500';
        }
    }
    if (requirement === 'guest' && authStatus === 'authenticated') {
        return '/';
    }
    return null;
};
exports.resolvePageAuthRedirect = resolvePageAuthRedirect;
