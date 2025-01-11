import DefaultTheme from 'vitepress/theme'
import './style/index.scss'

// 全局引入组件库（开发环境）
// import IpageElementPlusExpand from 'ipage-element-plus-expand'
// import 'ipage-element-plus-expand/es/style.css'

// 引入本地编译包
import IpageElementPlusExpand from '../../../dist'
import '../../../dist/es/style.css'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from "element-plus/es/locale/lang/zh-cn";

import allDemoComponents from "../MdToVue"
import allDocComponents  from "../loadExamples"

export default {
  extends: DefaultTheme, // or ...DefaultTheme
  enhanceApp (e) {
    const { app } = e
    app.use(ElementPlus, {
        locale: zhCn
    })
    app.use(IpageElementPlusExpand)
    allDemoComponents.intall({app})
    allDocComponents.install({app})
  },
}