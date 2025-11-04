// src/data-service.ts

export interface DataPoint {
  label: string;
  value: number;
  timestamp: number;
}

export class DataService {
  private data: DataPoint[] = [];

  constructor() {
    this.generate(10);
  }

  generate(n = 10) {
    this.data = [];
    for (let i = 0; i < n; i++) {
      this.data.push({
        label: `P${i + 1}`,
        value: Math.round(Math.random() * 100),
        timestamp: Date.now() - i * 60000,
      });
    }
    return this.data;
  }

  getAll() {
    return this.data;
  }

  simulateUpdate(cb: (d: DataPoint[]) => void, interval = 3000) {
    setInterval(() => {
      if (this.data.length === 0) return;
      const idx = Math.floor(Math.random() * this.data.length);
      this.data[idx].value = Math.round(Math.random() * 100);
      cb(this.data);
    }, interval);
  }
}
