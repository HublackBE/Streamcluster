import { dirname    , resolve} from 'node:path'
import { fileURLToPath} from 'node:url'
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url))


export default defineConfig({
    server: {
        port: 3000
    },
    build: {
        outDir: 'dist',

        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                favorites: resolve(__dirname, 'favorites.html'),
                search: resolve(__dirname, 'search.html')
            }
        }
    }
})