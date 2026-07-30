"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCspMiddleware = exports.injectScriptNonces = exports.buildDevSpaCspHeaderValue = exports.buildCspHeaderValue = exports.parseOrigin = exports.generateCspNonce = exports.CSP_HEADER = exports.YANDEX_OAUTH_ORIGIN = exports.PRACTICUM_ORIGIN = void 0;
const crypto_1 = require("crypto");
/** Хост API Яндекс Практикума (аватары и ресурсы). */
exports.PRACTICUM_ORIGIN = 'https://ya-praktikum.tech';
/** Разрешённый origin для OAuth-редиректов через формы. */
exports.YANDEX_OAUTH_ORIGIN = 'https://oauth.yandex.ru';
exports.CSP_HEADER = 'Content-Security-Policy';
const generateCspNonce = () => (0, crypto_1.randomBytes)(16).toString('base64');
exports.generateCspNonce = generateCspNonce;
const parseOrigin = (url) => {
    if (!url) {
        return null;
    }
    try {
        return new URL(url).origin;
    }
    catch {
        return null;
    }
};
exports.parseOrigin = parseOrigin;
/** Собирает значение заголовка Content-Security-Policy. */
const buildCspHeaderValue = ({ nonce, isDev, apiOrigin, clientPort, }) => {
    const scriptSrc = ["'self'", `'nonce-${nonce}'`];
    if (isDev) {
        // Vite HMR и dev-инструменты
        scriptSrc.push("'unsafe-eval'");
    }
    const connectSrc = new Set(["'self'", exports.PRACTICUM_ORIGIN]);
    if (apiOrigin) {
        connectSrc.add(apiOrigin);
    }
    if (isDev && clientPort) {
        connectSrc.add(`ws://localhost:${clientPort}`);
        connectSrc.add(`wss://localhost:${clientPort}`);
    }
    const directives = [
        "default-src 'self'",
        `script-src ${scriptSrc.join(' ')}`,
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        `img-src 'self' data: blob: ${exports.PRACTICUM_ORIGIN}`,
        `connect-src ${[...connectSrc].join(' ')}`,
        "media-src 'self'",
        "worker-src 'self'",
        "manifest-src 'self'",
        `form-action 'self' ${exports.YANDEX_OAUTH_ORIGIN}`,
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
    ];
    return directives.join('; ');
};
exports.buildCspHeaderValue = buildCspHeaderValue;
/** Упрощённая политика для yarn dev:spa (Vite без SSR). */
const buildDevSpaCspHeaderValue = (apiOrigin, clientPort) => {
    const connectSrc = new Set(["'self'", exports.PRACTICUM_ORIGIN]);
    if (apiOrigin) {
        connectSrc.add(apiOrigin);
    }
    if (clientPort) {
        connectSrc.add(`ws://localhost:${clientPort}`);
        connectSrc.add(`wss://localhost:${clientPort}`);
    }
    return [
        "default-src 'self'",
        // unsafe-inline нужен для inline module preamble React Refresh в dev:spa
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        `img-src 'self' data: blob: ${exports.PRACTICUM_ORIGIN}`,
        `connect-src ${[...connectSrc].join(' ')}`,
        "media-src 'self'",
        "worker-src 'self'",
        "manifest-src 'self'",
        `form-action 'self' ${exports.YANDEX_OAUTH_ORIGIN}`,
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
    ].join('; ');
};
exports.buildDevSpaCspHeaderValue = buildDevSpaCspHeaderValue;
const injectScriptNonces = (html, nonce) => html.replace(/<script(?![^>]*\snonce=)/gi, `<script nonce="${nonce}"`);
exports.injectScriptNonces = injectScriptNonces;
const createCspMiddleware = ({ isDev, apiOrigin, clientPort, }) => (_req, res, next) => {
    const nonce = (0, exports.generateCspNonce)();
    res.locals.cspNonce = nonce;
    res.setHeader(exports.CSP_HEADER, (0, exports.buildCspHeaderValue)({ nonce, isDev, apiOrigin, clientPort }));
    next();
};
exports.createCspMiddleware = createCspMiddleware;
