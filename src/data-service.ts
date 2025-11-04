// Mock data service with realtime updates & filtering


export interface DataPoint {
x: number; // e.g., timestamp or category index
y: number; // value
category?: string;
}


export class DataService {
private base: DataPoint[] = [];
private timer?: number;


constructor() {
this.base = this.generate(20);
}

generate(n: number, cat?: string): DataPoint[] {
const out: DataPoint[] = [];
for (let i = 0; i < n; i++) {
out.push({ x: i, y: Math.round(10 + Math.random() * 90), category: cat ?? (i % 2 ? 'A' : 'B') });
}
return out;
}


getData() { return [...this.base]; }

onTick(cb: (data: DataPoint[]) => void, intervalMs = 1000) {
this.stop();
this.timer = window.setInterval(() => {
// mutate last point a bit to simulate realtime
const last = this.base[this.base.length - 1];
const nextY = Math.max(0, Math.min(100, last.y + Math.round(-10 + Math.random() * 20)));
this.base = [...this.base.slice(1), { x: last.x + 1, y: nextY, category: Math.random() > 0.5 ? 'A' : 'B' }];
cb(this.getData());
}, intervalMs) as unknown as number;
}


stop() {
if (this.timer) window.clearInterval(this.timer);
}


filterByCategory(cat: string) {
return this.base.filter(d => d.category === cat);
}
}