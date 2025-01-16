import { defineConfig } from 'vitepress'
import { sidebar } from './config/sidebar'
import mdContainer from 'markdown-it-container'
import createDemoContainer from './MdToVue/demo'
import tooltip from './plugins/tooltip'
import { ApiTableContainer } from './plugins/api-table'

export default defineConfig({
    title: `ipage-element-plus-expand`,
    description: 'ipage-element-plus-expand 一个element-plus扩展组件库',
    base: '/ipage-element-plus-expand/',
    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: 'logo.svg' }],
    ],
    markdown:{
        config: (md) => {
            md.use(tooltip)
            md.use(mdContainer, 'demo', createDemoContainer(md))
            md.use(ApiTableContainer)
        }
    },
    themeConfig: {
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright by Pcloth © 2024',
        },
        nav: [
            // @ts-ignore
            sidebar['/guide/'][0],
            // @ts-ignore
            sidebar['/examples/'][0],
            { text: 'NPM', link: 'https://www.npmjs.com/package/ipage-element-plus-expand' },
            { text: 'Github', link: 'https://github.com/pcloth/ipage-element-plus-expand' },
        ],
        sidebar,
    }
})
