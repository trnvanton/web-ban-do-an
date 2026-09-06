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
    'thịt băm': ['thịt xay', 'nạc vai xay', 'nạc xay', 'thịt heo xay', 'thịt nạc xay'],
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
        if (stripped.startsWith('cá ') || stripped === 'cá phi lê') keys.add('cá');
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

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const VN_LETTERS = 'a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';

/**
 * Kiểm tra xem `phrase` có xuất hiện như một từ / cụm từ độc lập trong `text` không (Word Boundary Check)
 * Ngăn chặn lỗi chuỗi con: "miếng" chứa "miến", "cát" chứa "cá", "cách" chứa "cá", "mẹo" chứa "me", v.v.
 */
function containsWholePhrase(text, phrase) {
    if (!text || !phrase) return false;
    const cleanText = text.toLowerCase();
    const cleanPhrase = phrase.toLowerCase().trim();
    if (!cleanPhrase) return false;

    // Phân tách ranh giới từ tiếng Việt: trước và sau cụm từ phải là ký tự không phải chữ cái/số hoặc đầu/cuối chuỗi
    const pattern = `(^|[^${VN_LETTERS}])${escapeRegex(cleanPhrase)}($|[^${VN_LETTERS}])`;
    const regex = new RegExp(pattern, 'i');
    return regex.test(cleanText);
}

/**
 * Xây dựng chuỗi văn bản đại diện cho món ăn để tìm kiếm
 */
function getDishSearchCorpus(dish) {
    if (!dish) return '';
    const parseJSON = (v, fb) => { if (!v) return fb; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return fb; } };
    
    // Lấy danh sách tên nguyên liệu định lượng
    const nguyenLieuList = parseJSON(dish.nguyen_lieu_chi_tiet, []);
    const ingNames = Array.isArray(nguyenLieuList) ? nguyenLieuList.map(i => i.ten || '').join(' ') : '';
    
    // Bỏ gia vị "nước mắm cốt cá" để tránh hiểu nhầm "cá" khi tìm cá hải sản
    const cleanNgLieuChinh = (dish.nguyen_lieu_chinh || '')
        .replace(/nước mắm[^,]*/gi, '')
        .replace(/mắm cá[^,]*/gi, '');

    const parts = [
        dish.ten_mon || '',
        cleanNgLieuChinh,
        ingNames,
        dish.loai_mon || '',
        typeof dish.tags === 'string' ? dish.tags : JSON.stringify(dish.tags || '')
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
    return keys.some(k => containsWholePhrase(corpus, k));
}

/**
 * Phân tích độ khớp chi tiết giữa món ăn và danh sách nguyên liệu người dùng có
 */
function analyzeDishMatch(dish, targetIngNames = []) {
    const parseJSON = (v, fb) => { if (!v) return fb; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return fb; } };
    
    // 1. Lấy danh sách nguyên liệu chi tiết của món ăn
    let dishIngredients = [];
    const chiTiet = parseJSON(dish.nguyen_lieu_chi_tiet, []);
    if (Array.isArray(chiTiet) && chiTiet.length > 0) {
        dishIngredients = chiTiet.map(item => ({
            ten: (item.ten || '').trim(),
            so_luong: item.so_luong || '',
            don_vi: item.don_vi || '',
            ghi_chu: item.ghi_chu || ''
        })).filter(i => i.ten.length > 0);
    } else if (dish.nguyen_lieu_chinh) {
        dishIngredients = String(dish.nguyen_lieu_chinh).split(',').map(item => ({
            ten: item.trim(),
            so_luong: '',
            don_vi: '',
            ghi_chu: ''
        })).filter(i => i.ten.length > 0);
    }

    // 2. So khớp từng nguyên liệu
    const matchedUserIngs = new Set();
    const matchedDishIngs = [];
    const missingDishIngs = [];

    // Các gia vị cơ bản thường có sẵn trong bếp (nước mắm, muối, đường, dầu ăn, bột ngọt...)
    const basicPantryRegex = /^(muối|đường|nước mắm|dầu ăn|tiêu|hạt nêm|bột ngọt|nước lọc|tỏi|hành tím)$/i;

    for (const dIng of dishIngredients) {
        let isMatched = false;
        for (const userIng of targetIngNames) {
            const keys = getIngredientSearchKeys(userIng);
            if (keys.some(k => containsWholePhrase(dIng.ten, k))) {
                isMatched = true;
                matchedUserIngs.add(userIng);
                matchedDishIngs.push(dIng.ten);
                break;
            }
        }
        if (!isMatched) {
            // Chỉ thêm vào danh sách cần mua nếu không phải gia vị bếp cơ bản
            const isBasic = basicPantryRegex.test(dIng.ten.trim());
            missingDishIngs.push({
                ...dIng,
                isBasicPantry: isBasic
            });
        }
    }

    // 3. Tính toán điểm số & phần trăm khớp
    const matchScore = matchedUserIngs.size;
    const totalUserIngs = Math.max(1, targetIngNames.length);
    const nonBasicMissing = missingDishIngs.filter(i => !i.isBasicPantry);

    let matchPercentage = 0;
    if (matchScore > 0) {
        if (targetIngNames.length >= 2) {
            // Nếu người dùng chọn nhiều nguyên liệu: tỷ lệ % dựa trên số nguyên liệu của họ được dùng
            const userRatio = matchScore / totalUserIngs;
            const dishCoverage = matchedDishIngs.length / Math.max(1, dishIngredients.length);
            matchPercentage = Math.min(100, Math.round((userRatio * 0.7 + dishCoverage * 0.3) * 100));
        } else {
            // Nếu người dùng chỉ chọn 1 nguyên liệu: tính theo độ sẵn có của món (cần mua ít đồ nhất = % cao nhất)
            matchPercentage = Math.max(50, 100 - nonBasicMissing.length * 15);
        }
    }

    return {
        matchScore,
        matchPercentage,
        matchedIngredients: [...matchedUserIngs],
        matchedDishIngredients: matchedDishIngs,
        missingIngredients: missingDishIngs,
        missingCount: nonBasicMissing.length
    };
}

/**
 * Lọc và xếp hạng nâng cao cho 3 Chế Độ
 */
function filterAndAnalyzeDishes(dishes, targetIngNames = [], mode = 'ingredients') {
    if (!Array.isArray(dishes) || dishes.length === 0) return [];
    if (!Array.isArray(targetIngNames) || targetIngNames.length === 0) {
        return dishes.map(d => ({
            ...d,
            analysis: { matchScore: 0, matchPercentage: 0, matchedIngredients: [], missingIngredients: [], missingCount: 0 }
        }));
    }

    const analyzed = [];

    for (const dish of dishes) {
        const analysis = analyzeDishMatch(dish, targetIngNames);
        if (analysis.matchScore > 0) {
            analyzed.push({
                ...dish,
                analysis
            });
        }
    }

    // Xếp hạng theo chế độ
    if (targetIngNames.length === 1 || mode === 'few_ingredients') {
        // Chế độ 2 (Ít nguyên liệu): Ưu tiên món CẦN MUA THÊM ÍT NGUYÊN LIỆU NHẤT
        analyzed.sort((a, b) => {
            if (a.analysis.missingCount !== b.analysis.missingCount) {
                return a.analysis.missingCount - b.analysis.missingCount;
            }
            return b.analysis.matchPercentage - a.analysis.matchPercentage;
        });
    } else {
        // Chế độ 1 (Nhiều nguyên liệu): Ưu tiên món KHỚP NHIỀU NGUYÊN LIỆU CÓ SẴN NHẤT
        analyzed.sort((a, b) => {
            if (b.analysis.matchScore !== a.analysis.matchScore) {
                return b.analysis.matchScore - a.analysis.matchScore;
            }
            if (b.analysis.matchPercentage !== a.analysis.matchPercentage) {
                return b.analysis.matchPercentage - a.analysis.matchPercentage;
            }
            return a.analysis.missingCount - b.analysis.missingCount;
        });
    }

    return analyzed;
}

/**
 * Lọc món ăn theo Sở Thích & Tiêu Chí (Chế Độ 3)
 */
function filterDishesByPreferences(dishes, preferences = {}) {
    if (!Array.isArray(dishes) || dishes.length === 0) return [];
    const { categories, difficulty, maxTime, taste } = preferences;

    return dishes.filter(dish => {
        // 1. Lọc theo danh mục món
        if (Array.isArray(categories) && categories.length > 0) {
            const loai = (dish.loai_mon || '').toLowerCase();
            const ten = (dish.ten_mon || '').toLowerCase();
            const matchCat = categories.some(c => {
                const cleanC = c.toLowerCase();
                return loai.includes(cleanC) || ten.includes(cleanC);
            });
            if (!matchCat) return false;
        }

        // 2. Lọc theo độ khó
        if (difficulty && difficulty !== 'all') {
            if (dish.do_kho !== difficulty) return false;
        }

        // 3. Lọc theo thời gian nấu
        if (maxTime && maxTime !== 'all') {
            const totalTime = (Number(dish.thoi_gian_chuan_bi) || 10) + (Number(dish.thoi_gian_nau) || 15);
            const limit = Number(maxTime);
            if (!isNaN(limit) && totalTime > limit) return false;
        }

        // 4. Lọc theo khẩu vị / tags
        if (Array.isArray(taste) && taste.length > 0) {
            const parseJSON = (v, fb) => { if (!v) return fb; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return fb; } };
            const tags = parseJSON(dish.tags, []);
            const tagsStr = (Array.isArray(tags) ? tags.join(' ') : String(tags || '')).toLowerCase();
            const corpus = `${dish.ten_mon} ${dish.mo_ta} ${tagsStr}`.toLowerCase();
            const matchTaste = taste.some(t => corpus.includes(t.toLowerCase()));
            if (!matchTaste) return false;
        }

        return true;
    });
}

/**
 * Lọc và xếp hạng danh sách món ăn theo các nguyên liệu được chọn (Tương thích ngược)
 */
function filterAndRankDishes(dishes, ingredientNames) {
    return filterAndAnalyzeDishes(dishes, ingredientNames);
}

module.exports = {
    CULINARY_SYNONYMS,
    getIngredientSearchKeys,
    getDishSearchCorpus,
    containsWholePhrase,
    matchDishWithIngredient,
    analyzeDishMatch,
    filterAndAnalyzeDishes,
    filterDishesByPreferences,
    filterAndRankDishes
};

