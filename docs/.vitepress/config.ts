import { defineConfig } from 'vitepress'
import { sidebar } from './config/sidebar'


export default defineConfig({
    title: `ipage-element-plus-expand`,
    description: 'ipage-element-plus-expand 一个element-plus扩展组件库',
    base: '/vuecomp-starter/',
    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: 'logo.svg' }],
    ],

    themeConfig: {
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright by Pcloth © 2024',
        },

        nav: [
            { text: '组件', link: '/guide/features', activeMatch: '/guide/' },
            { text: 'Github', link: 'https://github.com/pcloth/ipage-element-plus-expand' },
        ],
        sidebar,
    }
})
