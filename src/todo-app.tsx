/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  key?: number;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <div className={"todo-item " + (todo.completed ? "completed" : "")}>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <div className="text">{todo.text}</div>
    <button className="btn ghost" onClick={() => onDelete(todo.id)}>
      Delete
    </button>
  </div>
);

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  let inputEl: HTMLInputElement | null = null;

  const addTodo = () => {
    const value = text().trim();
    if (!value) return;
    setTodos(prev => [
      { id: Date.now(), text: value, completed: false },
      ...prev,
    ]);
    setText("");
    if (inputEl) inputEl.value = ""; // reset input hiển thị
  };

  const toggleTodo = (id: number) =>
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id: number) =>
    setTodos(prev => prev.filter(t => t.id !== id));

  const refFn = (el: HTMLInputElement) => {
    inputEl = el;
    el.value = text(); // đồng bộ giá trị mỗi lần render
    el.oninput = e => {
      setText((e.target as HTMLInputElement).value);
    };
  };

  return (
    <div className="card">
      <h2>Todo App</h2>

      <form
        className="row"
        onSubmit={(e: SubmitEvent) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          className="input"
          placeholder="Add todo..."
          ref={refFn as any}
        />
        <button className="btn" type="submit">
          Add
        </button>
      </form>

      <div className="todo-list">
        {todos().map(t => (
          <TodoItem
            todo={t}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            key={t.id}
          />
        ))}
      </div>

      <div className="stats">
        Total: {todos().length} — Done: {todos().filter(t => t.completed).length}
      </div>
    </div>
  );
};
