import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    build: {
        target: 'es2015',
        outDir: 'es',
        emptyOutDir: false,
        minify: false,
        rollupOptions: {
            external: ['vue'],
            input: ['./src/index.ts'],
            output: [
                {
                    exports: 'named',
                    format: 'es',
                    dir: '../../dist/es',
                    entryFileNames: '[name].js',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                },
                {
                    exports: 'named',
                    format: 'cjs',
                    dir: '../../dist/lib',
                    entryFileNames: '[name].js',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                },
                // 开启umd打包模式
                // {
                //   name: 'vuecomp',
                //   exports: 'named',
                //   format: 'umd',
                //   dir: '../../dist/umd',
                //   entryFileNames: '[name].js',
                // }
            ]
        },
        lib: {
            entry: 'src/index.ts',
            name: 'vuecomp',
            formats: ['es', 'cjs', 'umd']
        },
    },
    plugins: [
        vue(),
        vueJsx(),
        dts({
            entryRoot: './src',
            outDir: '../../dist/es'
        }),
    ]
})
