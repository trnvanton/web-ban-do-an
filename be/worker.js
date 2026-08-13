import app from './server.js';
import dbD1 from './src/config/db-d1.js';
import { EventEmitter } from 'node:events';

export default {
    async fetch(request, env, ctx) {
        if (env) {
            globalThis.env = env;
            if (env.DB && dbD1) {
                const setFn = dbD1.setD1Database || dbD1.default?.setD1Database;
                if (typeof setFn === 'function') setFn(env.DB);
            }
        }

        const reqOrigin = request.headers.get('Origin') || request.headers.get('origin');
        const clientOrigin = reqOrigin || (request.headers.get('Referer') ? new URL(request.headers.get('Referer')).origin : 'https://organicmenu.vercel.app');

        // Xử lý CORS Preflight (OPTIONS) trực tiếp ở cấp Worker
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': clientOrigin,
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization, Cookie, X-Requested-With, Accept',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Max-Age': '86400',
                }
            });
        }

        return new Promise(async (resolve) => {
            try {
                const url = new URL(request.url);

                const req = new EventEmitter();
                if (app && app.request) Object.setPrototypeOf(req, app.request);
                req.app = app;
                req.method = request.method;
                req.url = url.pathname + url.search;
                req.headers = {};
                for (const [k, v] of request.headers.entries()) {
                    req.headers[k.toLowerCase()] = v;
                }
                req.socket = { remoteAddress: request.headers.get('cf-connecting-ip') || '127.0.0.1' };
                req.connection = req.socket;
                req.unpipe = function () { return this; };
                req.pipe = function (dest) { return dest; };
                req.resume = function () { return this; };
                req.pause = function () { return this; };

                const res = new EventEmitter();
                if (app && app.response) Object.setPrototypeOf(res, app.response);
                res.app = app;
                res.statusCode = 200;
                res.headers = {};
                res.headersSent = false;
                req.res = res;
                res.req = req;

                let bodyChunks = [];

                res.setHeader = function (name, value) {
                    res.headers[String(name).toLowerCase()] = value;
                };
                res.getHeader = function (name) {
                    return res.headers[String(name).toLowerCase()];
                };
                res.removeHeader = function (name) {
                    delete res.headers[String(name).toLowerCase()];
                };
                res.writeHead = function (statusCode, headers) {
                    res.statusCode = statusCode;
                    if (headers) {
                        for (const [k, v] of Object.entries(headers)) {
                            res.setHeader(k, v);
                        }
                    }
                };
                res.write = function (chunk) {
                    if (chunk) bodyChunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                };
                res.end = function (chunk) {
                    if (chunk) bodyChunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                    res.headersSent = true;

                    const finalBody = Buffer.concat(bodyChunks);
                    const responseHeaders = new Headers();
                    for (const [k, v] of Object.entries(res.headers)) {
                        if (Array.isArray(v)) {
                            v.forEach(val => responseHeaders.append(k, String(val)));
                        } else if (v !== undefined && v !== null) {
                            responseHeaders.set(k, String(v));
                        }
                    }

                    // Tự động đảm bảo CORS header trên MỌI phản hồi
                    responseHeaders.set('Access-Control-Allow-Origin', clientOrigin);
                    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
                    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS');
                    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept');

                    res.emit('finish');
                    res.emit('close');

                    resolve(new Response(finalBody, {
                        status: res.statusCode || 200,
                        headers: responseHeaders
                    }));
                };

                let reqBodyText = '';
                if (request.method !== 'GET' && request.method !== 'HEAD') {
                    req._body = true; // Đánh dấu đã đọc body để Express body-parser bỏ qua stream, chống treo Worker
                    try {
                        reqBodyText = await request.clone().text();
                    } catch (e) {
                        try {
                            reqBodyText = await request.text();
                        } catch (e2) {
                            reqBodyText = '';
                        }
                    }

                    if (reqBodyText && reqBodyText.trim().length > 0) {
                        try {
                            req.body = JSON.parse(reqBodyText);
                        } catch (e) {
                            try {
                                req.body = Object.fromEntries(new URLSearchParams(reqBodyText));
                            } catch (e2) {
                                req.body = reqBodyText;
                            }
                        }
                    } else {
                        req.body = {};
                    }
                } else {
                    req.body = {};
                }

                app(req, res);
            } catch (err) {
                console.error('Lỗi Worker:', err);
                const errHeaders = new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': clientOrigin,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Requested-With, Accept'
                });
                resolve(new Response(JSON.stringify({ success: false, message: err.message }), {
                    status: 500,
                    headers: errHeaders
                }));
            }
        });
    }
};

