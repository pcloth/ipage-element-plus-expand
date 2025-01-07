import { defineConfig } from 'vitepress'
import { sidebar } from './config/sidebar'
import mdContainer from 'markdown-it-container'
import createDemoContainer from './MdToVue/demo'

export default defineConfig({
    title: `ipage-element-plus-expand`,
    description: 'ipage-element-plus-expand 一个element-plus扩展组件库',
    base: '/vuecomp-starter/',
    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: 'logo.svg' }],
    ],
    markdown:{
        config: (md) => {
            md.use(mdContainer, 'demo', createDemoContainer(md))
        }
    },
    themeConfig: {
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright by Pcloth © 2024',
        },

        nav: [
            { 
                text: '组件', 
                activeMatch: '/examples/',
                items: [
                    {
                        text: '基础组件',
                        link: '/examples/button'
                    }
                ]
            },
            { text: 'Github', link: 'https://github.com/pcloth/ipage-element-plus-expand' },
        ],
        sidebar,
    }
})
