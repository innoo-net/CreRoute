import { defineConfig } from 'vite'

export default defineConfig({
    base: '/CreRoute/',
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                test: 'test/index.html',
                rectTest: 'rect-test/index.html'
            }
        }
    }
})