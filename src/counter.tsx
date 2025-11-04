/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime";

interface ButtonProps {
  onClick?: () => void;
  children?: any;
  className?: string;
}

const Button = ({ onClick, children, className }: ButtonProps) => (
  <button className={"btn " + (className || "")} onClick={onClick}>
    {children}
  </button>
);

export const Counter = ({ initialCount = 0 }: { initialCount?: number }) => {
  const [count, setCount] = useState(initialCount);
  return (
    <div className="card counter">
      <h2>Count: {count()}</h2>
      <div className="buttons">
        <Button onClick={() => setCount(c => c + 1)}>+</Button>
        <Button onClick={() => setCount(c => c - 1)}>-</Button>
        <Button onClick={() => setCount(initialCount)} className="ghost">
          Reset
        </Button>
      </div>
    </div>
  );
};
