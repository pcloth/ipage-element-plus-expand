import DefaultTheme from 'vitepress/theme'
import './style/index.scss'

// 全局引入组件库（开发环境）
import IpageElementPlusExpand from '../../../packages/components/src/index'
import '../../../packages/components/style/index.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



export default {
  extends: DefaultTheme, // or ...DefaultTheme
  enhanceApp ({ app }) {
    app.use(IpageElementPlusExpand)
    app.use(ElementPlus)
    app.use(IpageElementPlusExpand)
  }
}