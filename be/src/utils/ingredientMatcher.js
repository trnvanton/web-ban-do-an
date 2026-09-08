/**
 * Bộ so khớp nguyên liệu thông minh (Intelligent Culinary Ingredient Matcher)
 * Hỗ trợ tra cứu món ăn & gợi ý thực đơn chuẩn ẩm thực Việt Nam
 */

/**
 * Hàm tạo biểu thức chính quy (Regex) với ranh giới từ chuẩn Unicode Tiếng Việt
 * Tránh lỗi của \b trong Javascript khi gặp các ký tự tiếng Việt có dấu (á, à, ỏ, ớ, ư...)
 */
function makeVnRegex(words) {
    const list = Array.isArray(words) ? words : [words];
    const escaped = list.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return new RegExp(`(?<![\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`, 'iu');
}

// Danh sách các nhóm định danh nguyên liệu ẩm thực chuẩn xác (Canonical Mapping)
const INGREDIENT_CANONICAL_RULES = [
    // 1. Thịt gia cầm & Các bộ phận
    {
        canonical: 'thịt gà',
        match: makeVnRegex(['thịt gà', 'gà', 'gà ta', 'gà thả vườn', 'cánh gà', 'đùi gà', 'tỏi gà', 'đùi tỏi', 'đùi tỏi gà', 'ức gà', 'chân gà', 'mề gà', 'lòng gà', 'gà công nghiệp'])
    },
    {
        canonical: 'thịt vịt',
        match: makeVnRegex(['thịt vịt', 'vịt', 'vịt cỏ', 'ức vịt', 'đùi vịt'])
    },

    // 2. Thịt heo & Sườn
    {
        canonical: 'thịt ba chỉ',
        match: makeVnRegex(['thịt ba chỉ', 'ba chỉ', 'ba rọi', 'thịt ba rọi', 'thịt ba chỉ heo'])
    },
    {
        canonical: 'thịt băm',
        match: makeVnRegex(['thịt băm', 'thịt xay', 'thịt heo xay', 'nạc vai xay', 'nạc xay', 'thịt nạc xay'])
    },
    {
        canonical: 'thịt thăn lợn',
        match: makeVnRegex(['thịt thăn lợn', 'thịt thăn heo', 'thịt nạc thăn', 'thịt lợn nạc', 'thịt heo nạc'])
    },
    {
        canonical: 'sườn heo',
        match: makeVnRegex(['sườn heo', 'sườn non', 'sườn sụn', 'sườn lợn', 'sườn']),
        exclude: makeVnRegex(['sườn bò', 'dẻ sườn bò'])
    },
    {
        canonical: 'thịt heo',
        match: makeVnRegex(['thịt heo', 'thịt lợn', 'tai heo', 'chân giò', 'móng giò'])
    },

    // 3. Thịt bò
    {
        canonical: 'thịt bò',
        match: makeVnRegex(['thịt bò', 'bò', 'bắp bò', 'nạm bò', 'dẻ sườn bò', 'thăn bò', 'gầu bò', 'bò úc', 'bò nạc', 'thịt thăn bò']),
        exclude: makeVnRegex(['bơ', 'bột', 'bọ', 'bồ câu'])
    },

    // 4. Thủy hải sản
    {
        canonical: 'tôm tươi',
        match: makeVnRegex(['tôm', 'tôm sú', 'tôm tươi', 'tôm nõn', 'tôm thẻ', 'tôm lột', 'tôm đồng'])
    },
    {
        canonical: 'mực tươi',
        match: makeVnRegex(['mực', 'mực tươi', 'mực ống', 'mực lá', 'mực mai', 'mực trứng'])
    },
    {
        canonical: 'cá lóc (hoặc cá basa)',
        match: makeVnRegex(['cá lóc', 'cá basa', 'cá quả', 'cá tràu', 'cá diêu hồng', 'cá hồi', 'cá rô', 'cá chép', 'cá thu', 'cá nục', 'cá bớp', 'cá phi lê', 'phi lê cá', 'cá']),
        exclude: makeVnRegex(['nước mắm', 'mắm cá', 'nước mắm ngon', 'cà chua', 'cà rốt'])
    },
    {
        canonical: 'cua đồng / cua biển',
        match: makeVnRegex(['cua đồng', 'cua biển', 'cua xay', 'gạch cua', 'cua', 'ghẹ'])
    },
    {
        canonical: 'nghêu / nghêu hấp',
        match: makeVnRegex(['nghêu', 'ngao', 'ngao biển', 'nghêu biển', 'ngao hoa'])
    },
    {
        canonical: 'bạch tuộc',
        match: makeVnRegex(['bạch tuộc', 'râu bạch tuộc'])
    },
    {
        canonical: 'chả lụa / giò lụa',
        match: makeVnRegex(['chả lụa', 'giò lụa', 'giò bì', 'chả bì'])
    },
    {
        canonical: 'lạp xưởng',
        match: makeVnRegex(['lạp xưởng', 'lạp sườn'])
    },

    // 5. Trứng
    {
        canonical: 'trứng cút',
        match: makeVnRegex(['trứng cút', 'trứng chim cút'])
    },
    {
        canonical: 'trứng',
        match: makeVnRegex(['trứng gà', 'trứng vịt', 'trứng ta', 'trứng']),
        exclude: makeVnRegex(['trứng cút', 'trứng cá'])
    },

    // 6. Đậu & Nấm
    {
        canonical: 'đậu hũ',
        match: makeVnRegex(['đậu hũ', 'đậu phụ', 'tàu hũ', 'đậu non', 'đậu trắng'])
    },
    {
        canonical: 'mộc nhĩ',
        match: makeVnRegex(['mộc nhĩ', 'nấm mèo'])
    },
    {
        canonical: 'nấm hương',
        match: makeVnRegex(['nấm hương', 'nấm đông cô'])
    },
    {
        canonical: 'nấm kim châm',
        match: makeVnRegex(['nấm kim châm'])
    },

    // 7. Rau củ quả
    {
        canonical: 'bông cải xanh',
        match: makeVnRegex(['bông cải', 'súp lơ', 'bông cải xanh', 'súp lơ xanh'])
    },
    {
        canonical: 'cà chua',
        match: makeVnRegex(['cà chua', 'cà chua bi', 'cà chua hữu cơ']),
        exclude: makeVnRegex(['sốt cà chua', 'tương cà', 'cà chua paste', 'cà chua cô đặc'])
    },
    {
        canonical: 'khoai tây',
        match: makeVnRegex(['khoai tây'])
    },
    {
        canonical: 'cà rốt',
        match: makeVnRegex(['cà rốt'])
    },
    {
        canonical: 'bắp cải',
        match: makeVnRegex(['bắp cải', 'bắp cải trắng', 'bắp cải tím'])
    },
    {
        canonical: 'bắp / ngô ngọt',
        match: makeVnRegex(['bắp ngọt', 'ngô ngọt', 'ngô mỹ', 'bắp mỹ', 'ngô nếp', 'bắp nếp']),
        exclude: makeVnRegex(['bột bắp', 'bột ngô', 'bắp bò', 'bắp cải'])
    },
    {
        canonical: 'ớt chuông',
        match: makeVnRegex(['ớt chuông', 'ớt đà lạt', 'ớt ngọt'])
    },
    {
        canonical: 'rau muống',
        match: makeVnRegex(['rau muống'])
    },
    {
        canonical: 'cải thìa / cải ngọt',
        match: makeVnRegex(['cải thìa', 'cải ngọt', 'rau cải', 'cải bẹ'])
    },
    {
        canonical: 'bí đỏ',
        match: makeVnRegex(['bí đỏ', 'hồ lô', 'bí ngô'])
    },
    {
        canonical: 'bí đao',
        match: makeVnRegex(['bí đao', 'bí xanh'])
    },
    {
        canonical: 'su su',
        match: makeVnRegex(['su su'])
    },
    {
        canonical: 'măng tây',
        match: makeVnRegex(['măng tây'])
    },
    {
        canonical: 'đậu hà lan',
        match: makeVnRegex(['đậu hà lan', 'đậu cô ve', 'đậu cove'])
    },
    {
        canonical: 'khổ qua / trái đắng',
        match: makeVnRegex(['khổ qua', 'mướp đắng'])
    },
    {
        canonical: 'dưa leo / dưa chuột',
        match: makeVnRegex(['dưa leo', 'dưa chuột'])
    },
    {
        canonical: 'giá đỗ',
        match: makeVnRegex(['giá đỗ', 'giá sống', 'giá sạch'])
    },
    {
        canonical: 'dứa / thơm',
        match: makeVnRegex(['dứa', 'thơm', 'khóm'])
    },
    {
        canonical: 'me chua / bạc hà',
        match: makeVnRegex(['me chua', 'cốt me', 'me', 'dọc mùng', 'bạc hà'])
    },
    {
        canonical: 'khoai lang',
        match: makeVnRegex(['khoai lang', 'khoai lang mật'])
    },
    {
        canonical: 'xà lách',
        match: makeVnRegex(['xà lách', 'rau sống', 'tía tô', 'rau thơm'])
    },
    {
        canonical: 'cần tây',
        match: makeVnRegex(['cần tây', 'rau cần', 'tỏi tây', 'boa-rô'])
    },
    {
        canonical: 'hành lá',
        match: makeVnRegex(['hành lá', 'hành hoa', 'ngò gai', 'ngò om', 'mùi tàu', 'ngò rí', 'rau mùi'])
    },
    {
        canonical: 'hành tím',
        match: makeVnRegex(['hành tím', 'hành khô', 'hành củ'])
    },
    {
        canonical: 'hành tây',
        match: makeVnRegex(['hành tây'])
    },

    // 8. Gia vị & Phụ gia
    {
        canonical: 'tỏi',
        match: makeVnRegex(['tỏi', 'tỏi khô', 'tỏi ta', 'tỏi băm', 'tỏi phi', 'củ tỏi', 'tỏi cô đơn', 'tỏi lý sơn']),
        exclude: makeVnRegex(['tỏi gà', 'đùi tỏi', 'đùi tỏi gà', 'tỏi tây', 'boa-rô'])
    },
    {
        canonical: 'ớt',
        match: makeVnRegex(['ớt', 'ớt hiểm', 'ớt tươi', 'ớt sừng', 'ớt đỏ', 'ớt chỉ thiên', 'ớt băm', 'ớt khô', 'ớt bột', 'ớt xanh', 'ớt xiêm']),
        exclude: makeVnRegex(['tương ớt', 'dầu ớt', 'sa tế', 'ớt chuông'])
    },
    {
        canonical: 'tương ớt',
        match: makeVnRegex(['tương ớt', 'tương ớt chin-su', 'tương ớt chua ngọt'])
    },
    {
        canonical: 'nước mắm',
        match: makeVnRegex(['nước mắm', 'mắm cá cơm', 'nước mắm ngon', 'nước mắm truyền thống'])
    },
    {
        canonical: 'đường',
        match: makeVnRegex(['đường', 'đường cát', 'đường phèn', 'đường trắng'])
    },
    {
        canonical: 'nước hàng',
        match: makeVnRegex(['nước hàng', 'nước màu', 'kẹo đắng'])
    },
    {
        canonical: 'muối',
        match: makeVnRegex(['muối', 'muối hạt', 'muối tinh', 'muối iot'])
    },
    {
        canonical: 'tiêu xay',
        match: makeVnRegex(['tiêu', 'tiêu xay', 'tiêu sọ', 'tiêu đen', 'tiêu phú quốc'])
    },
    {
        canonical: 'giấm',
        match: makeVnRegex(['giấm', 'giấm gạo', 'giấm táo'])
    },
    {
        canonical: 'gừng',
        match: makeVnRegex(['gừng', 'gừng tươi', 'gừng già', 'gừng củ'])
    },
    {
        canonical: 'sả',
        match: makeVnRegex(['sả', 'củ sả', 'sả cây', 'sả băm'])
    },
    {
        canonical: 'dầu hào',
        match: makeVnRegex(['dầu hào'])
    },
    {
        canonical: 'xì dầu / nước tương',
        match: makeVnRegex(['xì dầu', 'nước tương', 'maggi'])
    },
    {
        canonical: 'mắm tôm',
        match: makeVnRegex(['mắm tôm'])
    },
    {
        canonical: 'mắm nêm',
        match: makeVnRegex(['mắm nêm'])
    },
    {
        canonical: 'mật ong',
        match: makeVnRegex(['mật ong'])
    },
    {
        canonical: 'dầu ăn',
        match: makeVnRegex(['dầu ăn', 'dầu thực vật'])
    },
    {
        canonical: 'bột bắp / bột năng',
        match: makeVnRegex(['bột bắp', 'bột năng', 'bột đao', 'bột chiên giòn', 'bột chiên'])
    },
    {
        canonical: 'nước dừa',
        match: makeVnRegex(['nước dừa', 'dừa xiêm', 'nước dừa tươi'])
    }
];

// Danh sách các gia vị cơ bản / phụ gia (không phải nhóm thịt, hải sản, rau củ chính)
const SEASONING_CANONICALS = new Set([
    'tỏi', 'ớt', 'tương ớt', 'nước mắm', 'đường', 'nước hàng', 'muối', 'tiêu xay',
    'giấm', 'gừng', 'sả', 'dầu hào', 'xì dầu / nước tương', 'mắm tôm', 'mắm nêm',
    'mật ong', 'dầu ăn', 'bột bắp / bột năng', 'hạt nêm', 'bột ngọt (mì chính)', 'ngũ vị hương'
]);

/**
 * Trích xuất danh sách Canonical Keys chuẩn của một nguyên liệu
 */
function getCanonicalKeys(rawName) {
    if (!rawName || typeof rawName !== 'string') return [];
    const text = rawName.toLowerCase().trim();
    if (!text) return [];

    const result = new Set();

    for (const rule of INGREDIENT_CANONICAL_RULES) {
        if (rule.match.test(text)) {
            const hasExclude = rule.exclude && rule.exclude.test(text);
            if (!hasExclude) {
                result.add(rule.canonical);
            }
        }
    }

    if (result.size === 0) {
        result.add(text);
    }

    return [...result];
}

/**
 * Kiểm tra xem nguyên liệu trong món ăn có khớp với nguyên liệu người dùng chọn hay không
 */
function isIngredientMatch(dishIngName, userIngName) {
    if (!dishIngName || !userIngName) return false;
    const dishKeys = getCanonicalKeys(dishIngName);
    const userKeys = getCanonicalKeys(userIngName);

    return dishKeys.some(dk => userKeys.includes(dk));
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

    // 2. Phân loại nguyên liệu người dùng chọn: Nguyên liệu chính (Core) vs Gia vị (Seasoning)
    const userCoreList = [];
    const userSeasoningList = [];

    for (const u of targetIngNames) {
        const uKeys = getCanonicalKeys(u);
        const isSeasoning = uKeys.some(k => SEASONING_CANONICALS.has(k));
        if (isSeasoning) {
            userSeasoningList.push(u);
        } else {
            userCoreList.push(u);
        }
    }

    // 3. So khớp từng nguyên liệu trong món ăn
    const matchedUserIngs = new Set();
    const matchedDishIngs = [];
    const missingDishIngs = [];

    const matchedCoreUserIngs = new Set();
    const matchedSeasoningUserIngs = new Set();

    const basicPantryRegex = /^(muối|đường|nước mắm|dầu ăn|tiêu|hạt nêm|bột ngọt|nước lọc|tỏi|hành tím)$/i;

    for (const dIng of dishIngredients) {
        let isMatched = false;

        for (const userIng of targetIngNames) {
            if (isIngredientMatch(dIng.ten, userIng)) {
                isMatched = true;
                matchedUserIngs.add(userIng);
                matchedDishIngs.push(dIng.ten);

                const uKeys = getCanonicalKeys(userIng);
                if (uKeys.some(k => SEASONING_CANONICALS.has(k))) {
                    matchedSeasoningUserIngs.add(userIng);
                } else {
                    matchedCoreUserIngs.add(userIng);
                }
                break;
            }
        }

        if (!isMatched) {
            const isBasic = basicPantryRegex.test(dIng.ten.trim());
            missingDishIngs.push({
                ...dIng,
                isBasicPantry: isBasic
            });
        }
    }

    // 4. Tính toán điểm số & phần trăm khớp
    const matchScore = matchedUserIngs.size;
    const totalUserIngs = Math.max(1, targetIngNames.length);
    const nonBasicMissing = missingDishIngs.filter(i => !i.isBasicPantry);

    // Xác định xem món ăn có thực sự khớp nguyên liệu cốt lõi hay không
    let isCoreMatched = false;
    if (userCoreList.length > 0) {
        isCoreMatched = matchedCoreUserIngs.size > 0;
    } else {
        isCoreMatched = matchScore > 0;
    }

    let matchPercentage = 0;
    if (matchScore > 0) {
        if (targetIngNames.length >= 2) {
            const userRatio = matchScore / totalUserIngs;
            const dishCoverage = matchedDishIngs.length / Math.max(1, dishIngredients.length);
            const basePct = Math.round((userRatio * 0.7 + dishCoverage * 0.3) * 100);
            matchPercentage = isCoreMatched ? Math.min(100, Math.max(60, basePct)) : Math.min(45, basePct);
        } else {
            matchPercentage = isCoreMatched ? Math.max(60, 100 - nonBasicMissing.length * 10) : 40;
        }
    }

    return {
        matchScore,
        isCoreMatched,
        matchPercentage,
        matchedIngredients: [...matchedUserIngs],
        matchedDishIngredients: matchedDishIngs,
        missingIngredients: missingDishIngs,
        missingCount: nonBasicMissing.length,
        matchedCoreCount: matchedCoreUserIngs.size,
        matchedSeasoningCount: matchedSeasoningUserIngs.size
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
            analysis: { matchScore: 0, isCoreMatched: false, matchPercentage: 0, matchedIngredients: [], missingIngredients: [], missingCount: 0 }
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

    // Xếp hạng: Ưu tiên món khớp Nguyên liệu cốt lõi (Core) lên đầu
    analyzed.sort((a, b) => {
        const aCore = a.analysis?.isCoreMatched ? 1 : 0;
        const bCore = b.analysis?.isCoreMatched ? 1 : 0;
        if (aCore !== bCore) {
            return bCore - aCore;
        }
        if (b.analysis.matchScore !== a.analysis.matchScore) {
            return b.analysis.matchScore - a.analysis.matchScore;
        }
        if (b.analysis.matchPercentage !== a.analysis.matchPercentage) {
            return b.analysis.matchPercentage - a.analysis.matchPercentage;
        }
        return a.analysis.missingCount - b.analysis.missingCount;
    });

    return analyzed;
}

/**
 * Lọc món ăn theo Sở Thích & Tiêu Chí (Chế Độ 3)
 */
function filterDishesByPreferences(dishes, preferences = {}) {
    if (!Array.isArray(dishes) || dishes.length === 0) return [];
    const { categories, difficulty, maxTime, taste } = preferences;

    return dishes.filter(dish => {
        if (Array.isArray(categories) && categories.length > 0) {
            const loai = (dish.loai_mon || '').toLowerCase();
            const ten = (dish.ten_mon || '').toLowerCase();
            const matchCat = categories.some(c => {
                const cleanC = c.toLowerCase();
                return loai.includes(cleanC) || ten.includes(cleanC);
            });
            if (!matchCat) return false;
        }

        if (difficulty && difficulty !== 'all') {
            if (dish.do_kho !== difficulty) return false;
        }

        if (maxTime && maxTime !== 'all') {
            const totalTime = (Number(dish.thoi_gian_chuan_bi) || 10) + (Number(dish.thoi_gian_nau) || 15);
            const limit = Number(maxTime);
            if (!isNaN(limit) && totalTime > limit) return false;
        }

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

function filterAndRankDishes(dishes, ingredientNames) {
    return filterAndAnalyzeDishes(dishes, ingredientNames);
}

module.exports = {
    makeVnRegex,
    INGREDIENT_CANONICAL_RULES,
    SEASONING_CANONICALS,
    getCanonicalKeys,
    isIngredientMatch,
    analyzeDishMatch,
    filterAndAnalyzeDishes,
    filterDishesByPreferences,
    filterAndRankDishes
};
