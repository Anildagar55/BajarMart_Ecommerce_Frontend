import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const STYLES = {
  success: "bg-white border-green-200 text-green-800",
  error: "bg-white border-red-200 text-red-700",
  info: "bg-white border-gray-200 text-gray-800",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type];
          return (
            <div
              key={id}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-md shadow-lg border text-sm animate-[fadeIn_0.2s_ease-out] ${STYLES[type]}`}
            >
              <Icon size={16} className="shrink-0" />
              {message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
