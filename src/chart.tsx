/** @jsx createElement */
import { createElement } from "./jsx-runtime";

interface ChartProps {
  data: { label: string; value: number }[];
  type?: "bar" | "line" | "pie";
  width?: number;
  height?: number;
  title?: string; // 👈 thêm prop title
}

export const Chart = ({
  data = [],
  type = "bar",
  width = 380,
  height = 180,
  title,
}: ChartProps) => {
  let canvasEl: HTMLCanvasElement | null = null;

  const refFn = (el: HTMLCanvasElement) => {
    canvasEl = el;
    draw();
  };

  function draw() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (type === "bar") drawBar(ctx);
    if (type === "line") drawLine(ctx);
    if (type === "pie") drawPie(ctx);
  }

  function drawBar(ctx: CanvasRenderingContext2D) {
    const max = Math.max(...data.map(d => d.value), 1);
    const barW = (width / data.length) * 0.6;
    data.forEach((d, i) => {
      const x = i * (width / data.length) + (width / data.length - barW) / 2;
      const barH = (d.value / max) * (height * 0.75);
      ctx.fillStyle = "#7c5cff";
      ctx.fillRect(x, height - barH - 20, barW, barH);
      ctx.fillStyle = "#9aa4b2";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(d.label, x + barW / 2, height - 4);
    });
  }

  function drawLine(ctx: CanvasRenderingContext2D) {
    const max = Math.max(...data.map(d => d.value), 1);
    ctx.beginPath();
    data.forEach((d, i) => {
      const x =
        data.length === 1 ? width / 2 : (i * width) / (data.length - 1);
      const y = height - 20 - (d.value / max) * (height * 0.7);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    data.forEach((d, i) => {
      const x =
        data.length === 1 ? width / 2 : (i * width) / (data.length - 1);
      const y = height - 20 - (d.value / max) * (height * 0.7);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00d4ff";
      ctx.fill();
    });
  }

  function drawPie(ctx: CanvasRenderingContext2D) {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 3;
    let start = -Math.PI / 2;

    data.forEach((d, i) => {
      const slice = (d.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#7c5cff" : "#00d4ff";
      ctx.fill();
      start += slice;
    });
  }

  const chartTitle =
    title ||
    (type === "bar"
      ? "Bar Chart"
      : type === "line"
      ? "Line Chart"
      : "Pie Chart");

  return (
    <div className="canvas-wrap card" style={{ textAlign: "center" }}>
      <h4 style={{ margin: "4px 0 8px", color: "var(--muted)" }}>
        {chartTitle}
      </h4>
      <canvas {...({ ref: refFn } as any)} width={width} height={height}></canvas>
    </div>
  );
};
