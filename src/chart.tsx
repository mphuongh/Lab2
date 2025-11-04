/** @jsx createElement */
import { createElement, VNode } from "./jsx-runtime";
import type { DataPoint } from "./data-service";

interface ChartProps {
  type: "bar" | "line" | "pie";
  data: DataPoint[];
  title?: string;
}

export const Chart = ({ type, data, title }: ChartProps): VNode => (
  <canvas
    ref={(el: HTMLCanvasElement) => el && draw(el, type, data, title)}
    width="600"
    height="260"
    style="border:1px solid #ddd; border-radius:8px;"
  ></canvas>
);

function draw(
  canvas: HTMLCanvasElement,
  type: "bar" | "line" | "pie",
  data: DataPoint[],
  title?: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (title) {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#111";
    ctx.fillText(title, 10, 20);
  }

  const max = Math.max(1, ...data.map((d) => d.y));

  if (type === "bar") {
    ctx.fillStyle = "#3b82f6";
    const bw = w / data.length;
    data.forEach((d, i) => {
      const bh = (d.y / max) * (h - 40);
      ctx.fillRect(i * bw + 2, h - bh - 20, bw - 4, bh);
    });
  } else if (type === "line") {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (d.y / max) * (h - 40);
      i === 0 ? ctx.moveTo(x, y - 20) : ctx.lineTo(x, y - 20);
    });
    ctx.stroke();
  } else if (type === "pie") {
    const total = data.reduce((s, d) => s + d.y, 0);
    let start = 0;
    const cx = w / 2;
    const cy = h / 2 + 10;
    const r = Math.min(w, h) / 3;

    data.forEach((d, i) => {
      const frac = d.y / total;
      const end = start + frac * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.fillStyle = `hsl(${(i * 50) % 360},70%,60%)`;
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fill();
      start = end;
    });
  }
}
