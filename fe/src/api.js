const API_BASE_URL = 'http://localhost:3000'; // Đổi cổng nếu backend của bạn chạy cổng khác

async function request(path, options = {}) {
    const { body, ...rest } = options;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
        credentials: 'include',
        headers: body && !isFormData ? { 'Content-Type': 'application/json' } : {},
        body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        ...rest
    });

    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        // Phản hồi không phải JSON
    }

    if (!res.ok) {
        const err = new Error((data && (data.message || data.error)) || `Lỗi máy chủ (HTTP ${res.status})`);
        err.status = res.status;
        throw err;
    }

    // Tự động xử lý thông minh: 
    // Nếu server trả về dạng { success: true, data: [...] } thì tự động lấy phần .data
    // Ngược lại, trả về nguyên bản dữ liệu (đối với các API cũ trả về thẳng mảng/object)
    if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
    }

    return data;
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body }),
    put: (path, body) => request(path, { method: 'PUT', body }),
    del: (path) => request(path, { method: 'DELETE' }),
    upload: (path, formData) => request(path, { method: 'POST', body: formData })
};