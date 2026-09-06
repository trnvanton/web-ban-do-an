import { useEffect } from 'react';
import './DialogModal.css';

export default function DialogModal({
    isOpen,
    type = 'info', // 'success' | 'warning' | 'error' | 'info' | 'confirm'
    title = 'Thông Báo',
    message = '',
    confirmText = 'Đồng ý',
    cancelText = 'Hủy bỏ',
    showCancel = false,
    onConfirm,
    onCancel,
    onClose
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (onClose) onClose();
            } else if (e.key === 'Enter') {
                if (onConfirm) onConfirm();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onConfirm, onClose]);

    if (!isOpen) return null;

    const renderIcon = () => {
        switch (type) {
            case 'success':
                return <i className="fas fa-check"></i>;
            case 'warning':
                return <i className="fas fa-exclamation"></i>;
            case 'error':
                return <i className="fas fa-times"></i>;
            case 'confirm':
                return <i className="fas fa-question"></i>;
            default:
                return <i className="fas fa-info"></i>;
        }
    };

    return (
        <div className="custom-dialog-backdrop" onClick={onClose}>
            <div 
                className={`custom-dialog-card type-${type}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Nút đóng góc phải */}
                <button 
                    type="button" 
                    className="custom-dialog-close" 
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <i className="fas fa-times"></i>
                </button>

                {/* Biểu tượng phát sáng trung tâm */}
                <div className="dialog-icon-wrapper">
                    <div className="dialog-icon-glow"></div>
                    <div className="dialog-icon-circle">
                        {renderIcon()}
                    </div>
                </div>

                {/* Tiêu đề & Nội dung */}
                <h3 className="dialog-title">{title}</h3>
                <p className="dialog-message">{message}</p>

                {/* Nút hành động */}
                <div className="dialog-actions">
                    {showCancel && (
                        <button
                            type="button"
                            className="btn-dialog-cancel"
                            onClick={onCancel || onClose}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        className={`btn-dialog-confirm type-${type}`}
                        onClick={onConfirm || onClose}
                        autoFocus
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
