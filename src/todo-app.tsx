/** @jsx createElement */
import { createElement, useState, VNode } from './jsx-runtime';


export interface Todo {
id: number;
text: string;
completed: boolean;
createdAt: number;
}

interface TodoItemProps {
todo: Todo;
onToggle: (id: number) => void;
onDelete: (id: number) => void;
}


interface TodoListProps {
todos: Todo[];
onToggle: (id: number) => void;
onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps): VNode => {
return (
<div className="todo-item">
<div className="todo-left">
<input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
<span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
</div>
<button className="btn" onClick={() => onDelete(todo.id)}>Delete</button>
</div>
);
};

const TodoList = ({ todos, onToggle, onDelete }: TodoListProps): VNode => {
return (
<div>
{todos.map(t => (
<TodoItem todo={t} onToggle={onToggle} onDelete={onDelete} />
))}
</div>
);
};

interface AddTodoFormProps {
onAdd: (text: string) => void;
}


const AddTodoForm = ({ onAdd }: AddTodoFormProps): VNode => {
const [getText, setText] = useState<string>('');


const submit = (e?: Event) => {
e?.preventDefault?.();
const value = getText().trim();
if (!value) return;
onAdd(value);
setText('');
};

return (
<form onSubmit={submit as any} className="buttons" style={{ marginTop: '8px' }}>
<input
type="text"
placeholder="Add a todo..."
value={getText()}
onInput={(e: any) => setText(e.target.value)}
style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
/>
<button className="btn" type="submit">Add</button>
</form>
);
};
const TodoApp = (): VNode => {
const [getTodos, setTodos] = useState<Todo[]>([]);


const addTodo = (text: string) => {
const newTodo: Todo = { id: Date.now(), text, completed: false, createdAt: Date.now() };
setTodos([newTodo, ...getTodos()]);
};


const toggleTodo = (id: number) => {
setTodos(getTodos().map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
};


const deleteTodo = (id: number) => {
setTodos(getTodos().filter(t => t.id !== id));
};


const total = getTodos().length;
const done = getTodos().filter(t => t.completed).length;
return (
<div className="card">
<h2>Todo List</h2>
<AddTodoForm onAdd={addTodo} />
<TodoList todos={getTodos()} onToggle={toggleTodo} onDelete={deleteTodo} />
<div style={{ marginTop: '8px', fontSize: '14px', opacity: .8 }}>Total: {total} • Completed: {done}</div>
</div>
);
};


export { TodoApp };