
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className={`bg-white rounded-lg shadow-2xl w-full mx-4 ${sizeClasses[size]} overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            type="button"
            className="text-white bg-transparent hover:bg-white/20 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onClose}
          >
            <X size={20} />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-6 space-y-6 bg-slate-50">
          {children}
        </div>
      </div>
    </div>
  );
};