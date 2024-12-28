import { createApp } from 'vue'
import './asset/style/index.scss'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 全局引入组件
import EasyDesign from '../../../packages/components/src/index'

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn
})
app.use(EasyDesign)
app.use(router)
app.mount('#app')
