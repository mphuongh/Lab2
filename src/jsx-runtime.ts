// src/jsx-runtime.ts
// Minimal custom JSX runtime with working useState + rerender

export interface VNode {
  type: string | ComponentFunction | 'fragment';
  props: Record<string, any>;
  children: Array<VNode | string | number>;
}

export interface ComponentProps {
  children?: Array<VNode | string | number> | VNode | string | number;
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode;

// ===================================================
// 🧠 Global JSX typing
// ===================================================
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// ===================================================
// 🧩 createElement
// ===================================================
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number | Array<VNode | string | number> | null | undefined)[]
): VNode {
  const safeProps = props ? { ...props } : {};
  const flatChildren: Array<VNode | string | number> = [];

  for (const ch of children.flat()) {
    if (ch != null) flatChildren.push(ch);
  }

  if (typeof type === 'function') safeProps.children = flatChildren;

  return {
    type: (type as any) === createFragment ? 'fragment' : (type as any),
    props: safeProps,
    children: flatChildren,
  };
}

// ===================================================
// 🧩 Fragment
// ===================================================
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  return createElement('fragment', props ?? {}, ...children);
}

// ===================================================
// 🧩 DOM utilities
// ===================================================
function setProperty(el: HTMLElement, key: string, value: any) {
  if (key === 'className') {
    el.setAttribute('class', value);
    return;
  }
  if (key === 'style') {
    if (typeof value === 'string') el.setAttribute('style', value);
    else if (typeof value === 'object') {
      const css = Object.entries(value)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`)
        .join(';');
      el.setAttribute('style', css);
    }
    return;
  }
  if (key === 'ref' && typeof value === 'function') {
    (el as any).__refCallback = value;
    return;
  }
  if (/^on[A-Z]/.test(key) && typeof value === 'function') {
    const ev = key.slice(2).toLowerCase();
    el.addEventListener(ev, value);
    return;
  }
  if (typeof value === 'boolean') {
    if (value) el.setAttribute(key, '');
    return;
  }
  if (value != null) el.setAttribute(key, String(value));
}

// ===================================================
// 🧩 renderToDOM
// ===================================================
export function renderToDOM(vnode: VNode | string | number): Node {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (vnode.type === 'fragment') {
    const frag = document.createDocumentFragment();
    for (const child of vnode.children) frag.appendChild(renderToDOM(child));
    return frag;
  }

  if (typeof vnode.type === 'function') {
    const out = (vnode.type as ComponentFunction)({ ...vnode.props, children: vnode.children });
    return renderToDOM(out);
  }

  const el = document.createElement(vnode.type as string);
  for (const [key, val] of Object.entries(vnode.props ?? {})) setProperty(el, key, val);
  for (const child of vnode.children) el.appendChild(renderToDOM(child));

  const refCb = (el as any).__refCallback;
  if (refCb) refCb(el);
  return el;
}

// ===================================================
// 🧩 Mount & Rerender — THIS IS THE FIXED PART 💪
// ===================================================
let currentRoot: {
  container: HTMLElement | null;
  rootComponent?: () => VNode;
} = { container: null };

export function mount(vnode: VNode, container: HTMLElement) {
  currentRoot.container = container;
  if (typeof vnode.type === 'function') {
    currentRoot.rootComponent = vnode.type as any;
  }
  container.innerHTML = '';
  container.appendChild(renderToDOM(vnode));
}

export function rerender() {
  if (currentRoot.container && currentRoot.rootComponent) {
    const { container, rootComponent } = currentRoot;
    container.innerHTML = '';
    const newVNode = rootComponent();
    container.appendChild(renderToDOM(newVNode));
  }
}

// ===================================================
// 🧩 useState
// ===================================================
export function useState<T>(initialValue: T): [() => T, (v: T) => void] {
  let value = initialValue;
  const get = () => value;
  const set = (next: T) => {
    value = next;
    rerender(); // 🔥 gọi lại root component sau khi state đổi
  };
  return [get, set];
}
