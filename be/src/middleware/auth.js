require('dotenv').config();

const DEFAULT_SECRET = 'fruitables-default-secret-key-at-least-32-chars-long';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

const getCrypto = () => {
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
        return globalThis.crypto;
    }
    return require('node:crypto').webcrypto;
};

function base64UrlEncode(str) {
    const bytes = new TextEncoder().encode(typeof str === 'string' ? str : JSON.stringify(str));
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 += '='.repeat(4 - pad);
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}

// Tạo token WebCrypto (hoạt động 100% trên Cloudflare Workers)
async function signToken(user) {
    try {
        const cryptoObj = getCrypto();
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = {
            id: user.id,
            email: user.email,
            vai_tro: user.vai_tro,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 ngày
        };

        const encodedHeader = base64UrlEncode(header);
        const encodedPayload = base64UrlEncode(payload);
        const dataToSign = `${encodedHeader}.${encodedPayload}`;

        const key = await cryptoObj.subtle.importKey(
            'raw',
            new TextEncoder().encode(JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await cryptoObj.subtle.sign(
            'HMAC',
            key,
            new TextEncoder().encode(dataToSign)
        );

        let sigBinary = '';
        new Uint8Array(signature).forEach(b => sigBinary += String.fromCharCode(b));
        const encodedSignature = btoa(sigBinary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

        return `${dataToSign}.${encodedSignature}`;
    } catch (err) {
        console.error('❌ Lỗi signToken WebCrypto:', err);
        throw err;
    }
}

function setAuthCookie(res, token) {
    const isCloudflare = typeof globalThis.WebSocketPair !== 'undefined' || !!globalThis.env;
    const isProd = process.env.NODE_ENV === 'production' || isCloudflare;
    if (typeof res.cookie === 'function') {
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: isCloudflare ? 'none' : 'lax',
            secure: isProd,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            path: '/'
        });
    } else {
        const cookieVal = `token=${token}; Path=/; Max-Age=604800; HttpOnly; SameSite=${isCloudflare ? 'None' : 'Lax'}${isProd ? '; Secure' : ''}`;
        res.setHeader('Set-Cookie', cookieVal);
    }
}

function clearAuthCookie(res) {
    if (typeof res.clearCookie === 'function') {
        res.clearCookie('token', { path: '/' });
    } else {
        res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure');
    }
}

// Đọc user từ cookie token bằng WebCrypto (async)
async function getAuthUser(req) {
    const token = req.cookies && req.cookies.token;
    if (!token || typeof token !== 'string') return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [encodedHeader, encodedPayload, signature] = parts;
        const dataToSign = `${encodedHeader}.${encodedPayload}`;

        const cryptoObj = getCrypto();
        const key = await cryptoObj.subtle.importKey(
            'raw',
            new TextEncoder().encode(JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        let b64 = signature.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4;
        if (pad) b64 += '='.repeat(4 - pad);
        const binarySig = atob(b64);
        const sigBytes = new Uint8Array(binarySig.length);
        for (let i = 0; i < binarySig.length; i++) sigBytes[i] = binarySig.charCodeAt(i);

        const isValid = await cryptoObj.subtle.verify(
            'HMAC',
            key,
            sigBytes,
            new TextEncoder().encode(dataToSign)
        );

        if (!isValid) return null;

        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null; // Token hết hạn
        }

        return payload;
    } catch (err) {
        return null;
    }
}

// Middleware: bắt buộc phải đăng nhập
async function requireAuth(req, res, next) {
    const user = await getAuthUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
    }
    req.user = user;
    next();
}

// Middleware: bắt buộc là admin (dùng cho mọi API /api/admin/*)
async function requireAdmin(req, res, next) {
    const user = await getAuthUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
    }
    if (user.vai_tro !== 'admin') {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập tính năng này!' });
    }
    req.user = user;
    next();
}

module.exports = {
    signToken,
    setAuthCookie,
    clearAuthCookie,
    getAuthUser,
    requireAuth,
    requireAdmin
};

module.exports = { signToken, setAuthCookie, clearAuthCookie, getAuthUser, requireAuth, requireAdmin };
