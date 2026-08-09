import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'cart';

// Đọc giỏ hàng từ localStorage (định dạng cũ của template được giữ nguyên)
function readCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const cart = raw ? JSON.parse(raw) : [];
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readCart);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    // p là object sản phẩm từ API: { id, ten_san_pham, gia, so_luong_ton, hinh_anh, ... }
    const addItem = useCallback((p, qty = 1) => {
        if (!p || !p.id) return;
        setItems(prev => {
            const stock = Number(p.so_luong_ton ?? p.stock) || 0;
            const existing = prev.find(i => i.id === p.id);
            if (existing) {
                const newQty = Math.min(existing.quantity + qty, stock || existing.quantity + qty);
                return prev.map(i => (i.id === p.id ? { ...i, quantity: newQty } : i));
            }
            return [...prev, {
                id: p.id,
                name: p.ten_san_pham,
                price: Number(p.gia),
                quantity: qty,
                stock,
                image: p.hinh_anh || 'fruite-item-1.jpg'
            }];
        });
    }, []);

    const setQty = useCallback((id, qty) => {
        setItems(prev =>
            prev.map(i => {
                if (i.id !== id) return i;
                const max = i.stock || 9999;
                return { ...i, quantity: Math.max(1, Math.min(Number(qty) || 1, max)) };
            })
        );
    }, []);

    const removeItem = useCallback(id => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const count = useMemo(() => items.reduce((s, i) => s + Number(i.quantity || 0), 0), [items]);
    const total = useMemo(() => items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0), [items]);

    return (
        <CartContext.Provider value={{ items, count, total, addItem, setQty, removeItem, clear }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
