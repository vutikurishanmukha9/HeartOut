import { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Toast Context
const ToastContext = createContext(null);

// Toast types with icons and colors
const TOAST_TYPES = {
    success: {
        icon: 'OK',
        bgColor: 'bg-green-500',
        borderColor: 'border-green-600',
        textColor: 'text-white'
    },
    error: {
        icon: 'X',
        bgColor: 'bg-red-500',
        borderColor: 'border-red-600',
        textColor: 'text-white'
    },
    warning: {
        icon: '!',
        bgColor: 'bg-amber-500',
        borderColor: 'border-amber-600',
        textColor: 'text-white'
    },
    info: {
        icon: 'i',
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-600',
        textColor: 'text-white'
    }
};

// Toast Component
function Toast({ toast, onRemove }) {
    const { icon, bgColor, borderColor, textColor } = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    return (
        <div
            className={`
                flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4
                ${bgColor} ${borderColor} ${textColor}
                animate-slide-in-right transform transition-all duration-300
                min-w-[300px] max-w-[450px]
            `}
            role="alert"
        >
            <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
            <div className="flex-1">
                {toast.title && (
                    <p className="font-semibold text-sm mb-1">{toast.title}</p>
                )}
                <p className="text-sm whitespace-pre-line">{toast.message}</p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-white/80 hover:text-white text-xl leading-none p-1 -mt-1 -mr-1"
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
}

// Toast Container
function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}

// Toast Provider
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', options = {}) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, ...options }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = useCallback({
        success: (message, options) => addToast(message, 'success', options),
        error: (message, options) => addToast(message, 'error', { duration: 8000, ...options }),
        warning: (message, options) => addToast(message, 'warning', options),
        info: (message, options) => addToast(message, 'info', options),
    }, [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        // Fallback for components not wrapped in ToastProvider
        return {
            success: (msg) => console.log('Success:', msg),
            error: (msg) => alert(msg),
            warning: (msg) => console.warn('Warning:', msg),
            info: (msg) => console.info('Info:', msg),
        };
    }
    return context;
}

// CSS animation (add to your global CSS or tailwind config)
// @keyframes slide-in-right {
//     from { transform: translateX(100%); opacity: 0; }
//     to { transform: translateX(0); opacity: 1; }
// }
// .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }

export default ToastProvider;
