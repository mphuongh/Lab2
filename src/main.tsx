/** @jsx createElement */
import { createElement, mount, resetHooks, setRootRender } from "./jsx-runtime";
import { Counter } from "./counter";
import { TodoApp } from "./todo-app";
import { Chart } from "./chart";
import { DataService } from "./data-service";
import "./styles.css";

const dataService = new DataService();

function App() {
  resetHooks();
  const data = dataService.getAll().slice(0, 8).map(d => ({
    label: d.label,
    value: d.value,
  }));

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo">JSX</div>
          <div>
            <h1 style={{ margin: 0 }}>JSX Lab</h1>
            <div style={{ color: "var(--muted)" }}>
              Custom JSX runtime & components
            </div>
          </div>
        </div>
      </div>

      <div className="app-grid">
        <div>
          <div className="card">
            <h2>Interactive Widgets</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Counter initialCount={3} />
              <div className="card">
                <h3>Mini Chart</h3>
                <Chart data={data} type="bar" width={300} height={180} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <TodoApp />
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Charts</h3>
            <div className="grid-charts">
              <Chart data={data} type="bar" />
              <Chart data={data} type="line" />
              <Chart data={data} type="pie" />
              <div className="card">
                <h4>Data Summary</h4>
                <div>Points: {data.length}</div>
                <div>Max: {Math.max(...data.map(d => d.value))}</div>
                <div>Min: {Math.min(...data.map(d => d.value))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        Built for Lab 2 — custom JSX runtime & components.
      </div>
    </div>
  );
}

const root = document.getElementById("app")!;

setRootRender(() => {
  resetHooks();
  mount(App() as any, root);
});

resetHooks();
mount(App() as any, root);

// Optional: auto-update charts every few seconds
dataService.simulateUpdate(() => {
  resetHooks();
  mount(App() as any, root);
}, 4000);
