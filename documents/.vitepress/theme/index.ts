import DefaultTheme from 'vitepress/theme'
import './style/index.scss'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from "element-plus/es/locale/lang/zh-cn";

import allDemoComponents from "../MdToVue"
import allDocComponents  from "../loadExamples"

export default {
  extends: DefaultTheme, // or ...DefaultTheme
  enhanceApp (e) {
    const { app } = e
    app.mixin({
        mounted () {
            import('../../../packages/components/src/index').then((res) => {
                // 使用这个方式混入，避免vitepress打包时，ssr报错
                const IpageElementPlusExpand = res.default
                // 注册组件
                app.use(IpageElementPlusExpand)
                allDemoComponents.intall({app})
                allDocComponents.install({app})
            })
        }
    })
    app.use(ElementPlus, {
        locale: zhCn
    })
  },
}