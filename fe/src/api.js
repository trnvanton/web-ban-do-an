// ============================================================
// API helper - mọi request tự động kèm cookie (httpOnly token)
// Trả về phần `data` nếu thành công, ném Error có .status nếu thất bại
// ============================================================

async function request(path, options = {}) {
    const { body, ...rest } = options;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const res = await fetch(path, {
        credentials: 'same-origin',
        headers: body && !isFormData ? { 'Content-Type': 'application/json' } : {},
        body,
        ...rest
    });

    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        // Phản hồi không phải JSON
    }

    if (!res.ok || (data && data.success === false)) {
        const err = new Error((data && (data.message || data.error)) || `Lỗi máy chủ (HTTP ${res.status})`);
        err.status = res.status;
        throw err;
    }

    // Với { success: true, data: ... } -> trả data; còn lại trả nguyên body
    return data && data.data !== undefined ? data.data : data;
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body }),
    put: (path, body) => request(path, { method: 'PUT', body }),
    del: (path) => request(path, { method: 'DELETE' }),
    upload: (path, formData) => request(path, { method: 'POST', body: formData })
};
