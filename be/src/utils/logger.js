// Logger đơn giản có thời gian - dùng cho các sự kiện quan trọng
function log(level, message) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] [${level.toUpperCase()}] ${message}`);
}

module.exports = {
    info: (msg) => log('info', msg),
    warn: (msg) => log('warn', msg),
    error: (msg) => log('error', msg)
};
