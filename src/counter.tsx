/** @jsx createElement */
import { createElement, useState, ComponentProps, VNode } from './jsx-runtime';


interface ButtonProps extends ComponentProps {
onClick?: (e: MouseEvent) => void;
className?: string;
}


const Button = ({ onClick, className, children }: ButtonProps): VNode => {
return (
<button className={className ?? 'btn'} onClick={onClick}>
{children as any}
</button>
);
};


interface CounterProps extends ComponentProps {
initialCount?: number;
}


const Counter = ({ initialCount = 0 }: CounterProps): VNode => {
const [getCount, setCount] = useState<number>(initialCount);


const increment = () => setCount(getCount() + 1);
const decrement = () => setCount(getCount() - 1);
const reset = () => setCount(initialCount);


return (
  <div className="card counter">
    <h2>Count: {getCount()}</h2>
    <div className="buttons">
      <Button type="button" onClick={increment}>+</Button>
      <Button type="button" onClick={decrement}>-</Button>
      <Button type="button" onClick={reset}>Reset</Button>
    </div>
  </div>
);
};


export { Button, Counter };