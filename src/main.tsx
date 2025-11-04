/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import { Counter } from './counter';
import { TodoApp } from './todo-app';
import { Dashboard } from './dashboard';


const App = () => (
<div className="container">
<div className="row">
<div className="card"><h2>Welcome</h2><p>Custom JSX + TypeScript without React.</p></div>
<Counter initialCount={3} />
<TodoApp />
</div>
<Dashboard />
</div>
);


// Mount
const root = document.getElementById('app')!;
mount(<App /> as any, root);