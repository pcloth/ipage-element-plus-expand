import DefaultTheme from 'vitepress/theme'
import './style/index.scss'

// 全局引入组件库（开发环境）
import IpageElementPlusExpand from '../../../dist/es/index'
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
  }
}