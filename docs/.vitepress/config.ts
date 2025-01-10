import { defineConfig } from 'vitepress'
import { sidebar } from './config/sidebar'
import mdContainer from 'markdown-it-container'
import createDemoContainer from './MdToVue/demo'

export default defineConfig({
    title: `ipage-element-plus-expand`,
    description: 'ipage-element-plus-expand 一个element-plus扩展组件库',
    base: '/document/',
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
            // @ts-ignore // 为了保障nav和sidebar区域都包含了全部组件内容
            // sidebar['/guide/'][0],
            // // @ts-ignore
            // sidebar['/guide/'][1],
            { text: 'NPM', link: 'https://www.npmjs.com/package/ipage-element-plus-expand' },
            { text: 'Github', link: 'https://github.com/pcloth/ipage-element-plus-expand' },
        ],
        sidebar,
    }
})
