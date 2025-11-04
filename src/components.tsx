/** @jsx createElement */
import { createElement, VNode, ComponentProps } from './jsx-runtime';

// ========================
// 🟦 CARD
// ========================
interface CardProps extends ComponentProps {
  title?: string;
  className?: string;
  onClick?: () => void;
}

const Card = ({ title, className, onClick, children }: CardProps): VNode => (
  <div className={`card ${className ?? ''}`} onClick={onClick}>
    {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
    {children as any}
  </div>
);

// ========================
// 🟦 MODAL
// ========================
interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps): VNode => {
  if (!isOpen) return '' as any; // render nothing
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e: any) => e.stopPropagation()}>
        {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
        <div>{children as any}</div>
        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <button className="btn" type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ========================
// 🟦 FORM
// ========================
interface FormProps extends ComponentProps {
  onSubmit: (data: Record<string, any>, e?: Event) => void;
  className?: string;
}

const Form = ({ onSubmit, className, children }: FormProps): VNode => {
  const submit = (e: any) => {
    e?.preventDefault?.(); // ✅ chặn reload khi submit
    const form = e.currentTarget as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    onSubmit(data, e);
  };
  return (
    <form className={className} onSubmit={submit as any}>
      {children as any}
    </form>
  );
};

// ========================
// 🟦 INPUT
// ========================
interface InputProps extends ComponentProps {
  type?: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  name?: string;
  onChange?: (v: string) => void;
}

const Input = ({
  type = 'text',
  value,
  placeholder,
  className,
  name,
  onChange
}: InputProps): VNode => (
  <input
    type={type}
    name={name}
    value={value as any}
    placeholder={placeholder}
    className={className}
    autocomplete={type === 'email' ? 'email' : 'off'}
    onInput={(e: any) => onChange?.(e.target.value)}
    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
  />
);

// ========================
// 🟦 BUTTON  ✅ (THÊM MỚI)
// ========================
interface ButtonProps extends ComponentProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e?: Event) => void;
}

const Button = ({ type = 'button', onClick, children }: ButtonProps): VNode => (
  <button
    type={type}
    className="btn"
    onClick={(e: any) => {
      e?.preventDefault?.(); 
      onClick?.(e);
    }}
  >
    {children as any}
  </button>
);

export { Card, Modal, Form, Input, Button };
