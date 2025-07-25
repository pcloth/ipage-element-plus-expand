import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
    plugins: [
        vueJsx()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["legacy-js-api", "import"],
                api: "modern-compiler",
            }
        }
    }
})