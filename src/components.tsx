/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "./jsx-runtime";

interface CardProps {
  title?: string;
  className?: string;
  children?: any;
  onClick?: (e: MouseEvent) => void;
}

export const Card = ({ title, children, className, onClick }: CardProps) => {
  return (
    <div className={"card " + (className || "")} onClick={onClick as any}>
      {title && <h3 style={{ margin: 0, marginBottom: "8px" }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: any;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return <></> as any;

  return (
    <div
      className="card"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          maxWidth: "90%",
          background: "var(--card)",
          borderRadius: "var(--radius)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            className="btn ghost"
            onClick={onClose as any}
            style={{ padding: "4px 8px" }}
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
