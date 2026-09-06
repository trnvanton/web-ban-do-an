/**
 * Bộ so khớp nguyên liệu thông minh (Intelligent Culinary Ingredient Matcher)
 * Hỗ trợ tra cứu món ăn & gợi ý thực đơn chuẩn ẩm thực Việt Nam
 */

const CULINARY_SYNONYMS = {
    'nghao': ['ngao', 'nghêu', 'ngêu'],
    'ngao': ['nghao', 'nghêu', 'ngêu'],
    'nghêu': ['ngao', 'nghao', 'ngêu'],
    'ngêu': ['ngao', 'nghao', 'nghêu'],
    'ớt bột': ['bột ớt', 'ớt bột'],
    'bột ớt': ['ớt bột', 'bột ớt'],
    'bông cải': ['súp lơ'],
    'súp lơ': ['bông cải'],
    'khổ qua': ['mướp đắng'],
    'mướp đắng': ['khổ qua'],
    'dứa': ['thơm', 'khóm'],
    'thơm': ['dứa', 'khóm'],
    'khóm': ['dứa', 'thơm'],
    'dọc mùng': ['bạc hà'],
    'bạc hà': ['dọc mùng'],
    'ngò gai': ['mùi tàu'],
    'mùi tàu': ['ngò gai'],
    'rau mùi': ['ngò rí'],
    'ngò rí': ['rau mùi'],
    'ngò om': ['rau ngổ'],
    'rau ngổ': ['ngò om'],
    'đậu hũ': ['đậu phụ', 'tàu hũ'],
    'đậu phụ': ['đậu hũ', 'tàu hũ'],
    'thịt băm': ['thịt xay', 'nạc vai xay', 'nạc xay', 'thịt heo xay'],
    'thịt xay': ['thịt băm'],
    'lạc': ['đậu phộng'],
    'đậu phộng': ['lạc'],
    'dưa leo': ['dưa chuột'],
    'dưa chuột': ['dưa leo'],
    'tôm tươi': ['tôm'],
    'mực tươi': ['mực'],
    'cá phi lê': ['cá']
};

/**
 * Trích xuất tất cả các từ khóa tra cứu đại diện cho một nguyên liệu
 * Xử lý bỏ tính từ (tươi, chín, sạch, ngon, vàng, ruột đỏ...)
 * và phân giải từ đồng nghĩa ẩm thực.
 */
function getIngredientSearchKeys(name) {
    if (!name || typeof name !== 'string') return [];
    const raw = name.toLowerCase().trim();
    const keys = new Set();
    keys.add(raw);

    // 1. Phân tách phần trong ngoặc đơn (ví dụ: "Cá lóc (hoặc cá basa)" => "cá lóc", "cá basa")
    const paren = raw.match(/\((.*?)\)/);
    if (paren) {
        paren[1].split(/[\/,]/).forEach(p => {
            const clean = p.replace(/hoặc/g, '').trim();
            if (clean.length >= 2) keys.add(clean);
        });
    }

    const noParen = raw.replace(/\(.*?\)/g, '').trim();
    noParen.split(/[\/,]/).forEach(p => {
        const clean = p.replace(/hoặc.*?$/g, '').trim();
        if (clean.length >= 2) keys.add(clean);
    });

    // 2. Lọc bỏ các từ mô tả phụ gia/tính từ không phải danh từ cốt lõi
    const descriptorRegex = /\b(tươi|chín|sạch|ngon|hoặc|vàng|chín vàng|ruột đỏ hoặc trắng|ruột đỏ|ruột trắng|giã|phi lê|cắt khúc|loại 1|non|khô|bánh tẻ)\b/g;
    
    for (const k of [...keys]) {
        const stripped = k.replace(descriptorRegex, ' ').replace(/\s+/g, ' ').trim();
        if (stripped.length >= 2) {
            keys.add(stripped);
        }

        // Tự động nhận diện danh từ cốt lõi theo ẩm thực
        if (stripped.startsWith('xoài')) keys.add('xoài');
        if (stripped.startsWith('dứa')) keys.add('dứa');
        if (stripped.startsWith('tôm')) keys.add('tôm');
        if (stripped.startsWith('mực')) keys.add('mực');
        if (stripped.startsWith('cua')) keys.add('cua');
        if (stripped.startsWith('cá ')) keys.add(stripped);
        if (stripped === 'thịt bò' || stripped.includes('thịt bò')) {
            keys.add('thịt bò');
            keys.add('bò');
        }
        if (stripped === 'thịt gà' || stripped.includes('thịt gà')) {
            keys.add('thịt gà');
            keys.add('gà');
        }
        if (stripped === 'sườn heo') keys.add('sườn');
        if (stripped === 'trứng') keys.add('trứng');
        if (stripped === 'đậu hũ') {
            keys.add('đậu hũ');
            keys.add('đậu phụ');
        }
    }

    // 3. Mở rộng từ đồng nghĩa
    for (const k of [...keys]) {
        for (const [syn, list] of Object.entries(CULINARY_SYNONYMS)) {
            if (k.includes(syn)) {
                list.forEach(alt => keys.add(k.replace(syn, alt)));
            }
        }
    }

    return [...keys].filter(k => k.length >= 2);
}

/**
 * Xây dựng chuỗi văn bản đại diện cho món ăn để tìm kiếm
 */
function getDishSearchCorpus(dish) {
    if (!dish) return '';
    const parts = [
        dish.ten_mon || '',
        dish.nguyen_lieu_chinh || '',
        dish.mo_ta || '',
        typeof dish.nguyen_lieu_chi_tiet === 'string' ? dish.nguyen_lieu_chi_tiet : JSON.stringify(dish.nguyen_lieu_chi_tiet || ''),
        typeof dish.tags === 'string' ? dish.tags : JSON.stringify(dish.tags || ''),
        dish.loai_mon || ''
    ];
    return parts.join(' ').toLowerCase();
}

/**
 * Kiểm tra xem 1 món ăn có chứa nguyên liệu này không
 */
function matchDishWithIngredient(dish, ingredientName) {
    const keys = getIngredientSearchKeys(ingredientName);
    if (keys.length === 0) return false;
    const corpus = getDishSearchCorpus(dish);
    return keys.some(k => corpus.includes(k));
}

/**
 * Lọc và xếp hạng danh sách món ăn theo các nguyên liệu được chọn
 * Món khớp nhiều nguyên liệu hơn sẽ được xếp lên đầu
 */
function filterAndRankDishes(dishes, ingredientNames) {
    if (!Array.isArray(dishes) || dishes.length === 0) return [];
    if (!Array.isArray(ingredientNames) || ingredientNames.length === 0) return dishes;

    const scored = [];

    for (const dish of dishes) {
        let matchScore = 0;
        for (const ingName of ingredientNames) {
            if (matchDishWithIngredient(dish, ingName)) {
                matchScore++;
            }
        }
        if (matchScore > 0) {
            scored.push({ dish, matchScore });
        }
    }

    // Sắp xếp: Món khớp nhiều nguyên liệu nhất đứng đầu
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.map(item => item.dish);
}

module.exports = {
    CULINARY_SYNONYMS,
    getIngredientSearchKeys,
    getDishSearchCorpus,
    matchDishWithIngredient,
    filterAndRankDishes
};
