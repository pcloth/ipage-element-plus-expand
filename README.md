# 

# 鸣谢
项目基础配置环境配置来源于`vuecomp-starter`
说明文档：https://windlil.github.io/vuecomp-starter/


# 文档
[点击查看文档](https://pcloth.github.io/ipage-element-plus-expand/#/zh-CN/docs/quickstart)

# 安装
```
npm install ipage-element-plus-expand --save
```


## 按需引用
```
import {IPage} from "ipage-element-plus-expand";
```

## 全局引入main.js
```
import IpageElementExpand from "ipage-element-plus-expand";
import "ipage-element-plus-expand/es/style.css";
Vue.use(IpageElementExpand);
```

## 全局配置
```jsx
import {config} from "ipage-element-plus-expand"
config.set({
    extendedRenderCell:{
        /** 自定义扩展组件
         * 如果不需要配置数据、事件和v-model，请将loadData.$rcell上的几个参数关闭 
         * h方法必须引入，不然可能报错
         * 下方例子中的key=demo，在配置参数中就是：{slot:'demo'}
        */
        demo:(h,{$rcell})=>{
            $rcell.needEvent = false
            $rcell.needProps = false
            $rcell.needVModel = false
            return <span>11</span>
        }
        // demo:(h)=> <el-input></el-input>
    }
})
```