"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePageAuthRedirect = exports.checkIsAuthenticated = exports.getPageAuthRequirement = exports.normalizePathname = exports.GUEST_ONLY_PATHS = void 0;
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
const checkIsAuthenticated = async (req) => {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return false;
    }
    try {
        const { status } = await axios_1.default.get(`${getServerUrl()}/auth/user`, {
            headers: { Cookie: cookie },
            validateStatus: () => true,
        });
        return status === 200;
    }
    catch {
        return false;
    }
};
exports.checkIsAuthenticated = checkIsAuthenticated;
const resolvePageAuthRedirect = async (req) => {
    const pathname = new URL(req.originalUrl || req.url, 'http://localhost').pathname;
    const requirement = (0, exports.getPageAuthRequirement)(pathname);
    if (requirement === 'none') {
        return null;
    }
    const authenticated = await (0, exports.checkIsAuthenticated)(req);
    if (requirement === 'private' && !authenticated) {
        return '/signin';
    }
    if (requirement === 'guest' && authenticated) {
        return '/';
    }
    return null;
};
exports.resolvePageAuthRedirect = resolvePageAuthRedirect;
