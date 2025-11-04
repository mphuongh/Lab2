import { defineConfig } from 'vite';


export default defineConfig({
esbuild: {
jsxFactory: 'createElement',
jsxFragment: 'createFragment'
},
server: {
port: 5173,
open: true
},
build: {
target: 'es2020',
sourcemap: true
}
});