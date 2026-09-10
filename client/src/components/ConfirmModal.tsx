import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  destructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  destructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center px-8">
        <div
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-lg font-bold text-text">{title}</h2>

            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-gray-600">{message}</p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={`w-1/2 rounded-lg py-2.5 text-sm font-medium text-white ${
                destructive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-dark-green hover:bg-dark-green/90"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
