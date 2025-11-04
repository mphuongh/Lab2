import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
root: '.',
resolve: {
alias: {
'@': path.resolve(__dirname, 'src')
}
},
esbuild: {
jsxFactory: 'createElement',
jsxFragment: 'createFragment'
},
server: {
port: 5173,
open: true
}
});