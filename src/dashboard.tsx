/** @jsx createElement */
import { createElement, useState, VNode } from "./jsx-runtime";
import { Card, Modal, Form, Input, Button } from "./components";
import { DataService } from "./data-service";
import { Chart } from "./chart";
import { TodoApp } from "./todo-app";      // nếu bạn có file todo.tsx
import { Counter } from "./counter";  // nếu bạn có file counter.tsx

const svc = new DataService();

export const Dashboard = (): VNode => {
  const [getType, setType] = useState<"bar" | "line" | "pie">("bar");
  const [getData, setData] = useState([...svc.getData()]);
  const [getOpen, setOpen] = useState(false);

  // ❌ Tắt realtime để trang không giật
  // svc.onTick((d) => setData(d), 1500);

  const refresh = () => setData([...svc.getData()]);

  return (
    <div className="container">
      <header>
        <h1>Dashboard</h1>
        <div className="toolbar">
          <Button onClick={() => setType("bar")}>Bar</Button>
          <Button onClick={() => setType("line")}>Line</Button>
          <Button onClick={() => setType("pie")}>Pie</Button>
          <Button onClick={refresh}>Refresh Data</Button>
          <Button onClick={() => setOpen(true)}>Open Modal</Button>
        </div>
      </header>

      {/* ====================== CHART ====================== */}
      <div className="row">
        <Card title={`Chart (${getType().toUpperCase()})`}>
          <Chart type={getType()} data={getData()} />
        </Card>

        <Card title="Statistics">
          <div>Total Points: {getData().length}</div>
          <div>Min: {Math.min(...getData().map((d) => d.y))}</div>
          <div>Max: {Math.max(...getData().map((d) => d.y))}</div>
          <div>
            Avg:{" "}
            {Math.round(
              getData().reduce((s, d) => s + d.y, 0) /
                Math.max(1, getData().length)
            )}
          </div>
        </Card>
      </div>

      {/* ====================== COUNTER ====================== */}
      <Card title="Counter">
        <Counter />
      </Card>

      {/* ====================== TODO LIST ====================== */}
      <Card title="Todo List">
        <TodoApp />
      </Card>

      {/* ====================== QUICK FORM ====================== */}
      <Card title="Quick Form">
        <Form onSubmit={(data) => alert(`Submitted: ${JSON.stringify(data)}`)}>
          <div className="buttons">
            <Input name="name" placeholder="Your name" />
            <Input name="email" type="email" placeholder="Email" />
            <Button type="submit">Send</Button>
          </div>
        </Form>
      </Card>

      {/* ====================== MODAL ====================== */}
      <Modal isOpen={getOpen()} onClose={() => setOpen(false)} title="Hello!">
        This is a modal powered by our custom JSX runtime.
      </Modal>
    </div>
  );
};
