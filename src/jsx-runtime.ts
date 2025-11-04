// src/jsx-runtime.ts

export type VNodeType = string | ComponentFunction | typeof FragmentSymbol;

export interface VNode {
  type: VNodeType;
  props: Record<string, any>;
  children: Array<VNode | string | number>;
}

export interface ComponentProps {
  children?: Array<VNode | string | number> | VNode | string | number;
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode | string | number;

export const FragmentSymbol = Symbol("fragment");

// ------------------- createElement -------------------

export function createElement(
  type: VNodeType,
  props: Record<string, any> | null,
  ...children: (VNode | string | number | boolean | null | undefined)[]
): VNode {
  const safeProps = props ? { ...props } : {};
  const flatChildren: Array<VNode | string | number> = [];

  for (let i = 0; i < children.length; i++) {
    const c = children[i];

    // ✅ loại bỏ null, undefined, false (TS không còn báo lỗi)
    if (c === null || c === undefined || c === false) continue;

    if (Array.isArray(c)) {
      for (let j = 0; j < c.length; j++) {
        const cc = c[j];
        if (cc === null || cc === undefined || cc === false) continue;
        flatChildren.push(cc as any);
      }
    } else {
      flatChildren.push(c as any);
    }
  }

  return { type, props: safeProps, children: flatChildren };
}


export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number | null | undefined)[]
): VNode {
  return createElement(FragmentSymbol, props, ...children);
}

// ------------------- Render -------------------

function isText(node: any): node is string | number {
  return typeof node === "string" || typeof node === "number";
}

function setProp(el: HTMLElement, key: string, value: any) {
  if (key === "className") {
    el.setAttribute("class", value);
    return;
  }
  if (key === "style" && typeof value === "object") {
    const styleStr = Object.entries(value)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}:${v}`)
      .join(";");
    el.setAttribute("style", styleStr);
    return;
  }
  if (key.startsWith("on") && typeof value === "function") {
    const ev = key.slice(2).toLowerCase();
    el.addEventListener(ev, value);
    return;
  }
  if (key === "ref" && typeof value === "function") {
    (el as any).__refFn = value;
    return;
  }
  if (typeof value === "boolean") {
    if (value) el.setAttribute(key, "");
    return;
  }
  el.setAttribute(key, String(value));
}

export function renderToDOM(vnode: VNode | string | number): Node {
  if (isText(vnode)) return document.createTextNode(String(vnode));

  if (vnode.type === FragmentSymbol) {
    const frag = document.createDocumentFragment();
    vnode.children.forEach(ch => frag.appendChild(renderToDOM(ch)));
    return frag;
  }

  if (typeof vnode.type === "function") {
    const comp = vnode.type as ComponentFunction;
    return renderToDOM(comp({ ...(vnode.props || {}), children: vnode.children }));
  }

  const el = document.createElement(vnode.type as string);
  for (const key in vnode.props) setProp(el, key, vnode.props[key]);
  vnode.children.forEach(ch => el.appendChild(renderToDOM(ch)));

  const refFn = (el as any).__refFn;
  if (typeof refFn === "function") refFn(el);

  return el;
}

export function mount(vnode: VNode, container: HTMLElement) {
  const newEl = renderToDOM(vnode);


  if (container.childNodes.length === 0) {
    container.appendChild(newEl);
    return;
  }


  const firstChild = container.firstChild;
  if (firstChild && firstChild.isEqualNode(newEl)) return; // không thay nếu giống nhau
  if (firstChild) {
    container.replaceChild(newEl, firstChild);
  } else {
    container.appendChild(newEl);
  }
}


// ------------------- Hooks -------------------

let _stateStore: any[] = [];
let _stateCursor = 0;
let _rootRender: (() => void) | null = null;

export function resetHooks() {
  _stateCursor = 0;
}

export function useState<T>(
  initial: T
): [() => T, (val: T | ((prev: T) => T)) => void] {
  const idx = _stateCursor;
  if (_stateStore[idx] === undefined) _stateStore[idx] = initial;

  const getter = () => _stateStore[idx];
  const setter = (val: any) => {
    _stateStore[idx] =
      typeof val === "function" ? (val as any)(_stateStore[idx]) : val;
    if (_rootRender) _rootRender();
  };

  _stateCursor++;
  return [getter, setter];
}

export function setRootRender(fn: () => void) {
  _rootRender = fn;
}

// ------------------- JSX type declarations -------------------
// ✅ Cực kỳ quan trọng để hết lỗi toàn project (ref, onClick, v.v.)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
