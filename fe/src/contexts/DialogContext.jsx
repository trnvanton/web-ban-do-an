import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import DialogModal from '../components/DialogModal';

const DialogContext = createContext(null);

export let globalDialog = {
    alert: (msg) => window.alert(msg),
    confirm: (msg) => Promise.resolve(window.confirm(msg)),
    success: (msg) => window.alert(msg),
    error: (msg) => window.alert(msg),
    warning: (msg) => window.alert(msg)
};

export function DialogProvider({ children }) {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        type: 'info', // 'success' | 'warning' | 'error' | 'info' | 'confirm'
        title: '',
        message: '',
        confirmText: 'Đồng ý',
        cancelText: 'Hủy bỏ',
        showCancel: false,
        onConfirm: null,
        onCancel: null
    });

    const resolveRef = useRef(null);

    const closeDialog = useCallback((result = false) => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
        if (resolveRef.current) {
            resolveRef.current(result);
            resolveRef.current = null;
        }
    }, []);

    const parseMessageAndType = (rawMessage, customType, customTitle) => {
        let msg = String(rawMessage ?? '').trim();
        let type = customType || 'info';
        let defaultTitle = 'Thông Báo';

        if (msg.startsWith('✅')) {
            type = customType || 'success';
            defaultTitle = 'Thành Công';
            msg = msg.replace(/^✅\s*/, '');
        } else if (msg.startsWith('🎉')) {
            type = customType || 'success';
            defaultTitle = 'Tuyệt Vời';
            msg = msg.replace(/^🎉\s*/, '');
        } else if (msg.startsWith('⚠️')) {
            type = customType || 'warning';
            defaultTitle = 'Cảnh Báo';
            msg = msg.replace(/^⚠️\s*/, '');
        } else if (msg.startsWith('❌')) {
            type = customType || 'error';
            defaultTitle = 'Đã Xảy Ra Lỗi';
            msg = msg.replace(/^❌\s*/, '');
        } else if (/lỗi/i.test(msg) || /error/i.test(msg) || /thất bại/i.test(msg)) {
            type = customType || 'error';
            defaultTitle = 'Đã Xảy Ra Lỗi';
        } else if (/thành công/i.test(msg)) {
            type = customType || 'success';
            defaultTitle = 'Thành Công';
        }

        return {
            message: msg,
            type,
            title: customTitle || defaultTitle
        };
    };

    const alert = useCallback((rawMessage, options = {}) => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            const parsed = parseMessageAndType(rawMessage, options.type, options.title);

            setDialogState({
                isOpen: true,
                type: parsed.type,
                title: parsed.title,
                message: parsed.message,
                confirmText: options.confirmText || 'Đã hiểu',
                cancelText: 'Hủy',
                showCancel: false,
                onConfirm: () => {
                    if (options.onConfirm) options.onConfirm();
                    closeDialog(true);
                },
                onCancel: () => closeDialog(false)
            });
        });
    }, [closeDialog]);

    const confirm = useCallback((rawMessage, options = {}) => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            const parsed = parseMessageAndType(rawMessage, options.type || 'confirm', options.title || 'Xác Nhận');

            setDialogState({
                isOpen: true,
                type: parsed.type,
                title: parsed.title,
                message: parsed.message,
                confirmText: options.confirmText || 'Đồng ý',
                cancelText: options.cancelText || 'Hủy bỏ',
                showCancel: true,
                onConfirm: () => {
                    if (options.onConfirm) options.onConfirm();
                    closeDialog(true);
                },
                onCancel: () => {
                    if (options.onCancel) options.onCancel();
                    closeDialog(false);
                }
            });
        });
    }, [closeDialog]);

    const success = useCallback((rawMessage, options = {}) => {
        return alert(rawMessage, { ...options, type: 'success', title: options.title || 'Thành Công' });
    }, [alert]);

    const warning = useCallback((rawMessage, options = {}) => {
        return alert(rawMessage, { ...options, type: 'warning', title: options.title || 'Lưu Ý' });
    }, [alert]);

    const error = useCallback((rawMessage, options = {}) => {
        return alert(rawMessage, { ...options, type: 'error', title: options.title || 'Đã Xảy Ra Lỗi' });
    }, [alert]);

    // Gán vào globalDialog và thay thế window.alert nguyên bản
    useEffect(() => {
        globalDialog = { alert, confirm, success, warning, error };

        const nativeAlert = window.alert;
        window.alert = (msg) => {
            alert(msg);
        };

        return () => {
            window.alert = nativeAlert;
        };
    }, [alert, confirm, success, warning, error]);

    return (
        <DialogContext.Provider value={{ alert, confirm, success, warning, error, closeDialog }}>
            {children}
            <DialogModal
                isOpen={dialogState.isOpen}
                type={dialogState.type}
                title={dialogState.title}
                message={dialogState.message}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
                showCancel={dialogState.showCancel}
                onConfirm={dialogState.onConfirm}
                onCancel={dialogState.onCancel}
                onClose={() => closeDialog(false)}
            />
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        return globalDialog;
    }
    return context;
}
