# 

# 鸣谢
项目基础配置环境配置来源于`vuecomp-starter`
说明文档：https://windlil.github.io/vuecomp-starter/

文档组件预览和解析来自于element-plus官方github仓库，我魔改了一下方便自己使用。


# 文档
文档补全中，暂时可以先看看vue2版本的文档，api差不多都兼容的；

[点击查看vue2版本文档](https://pcloth.github.io/ipage-element-expand/#/zh-CN/docs/quickstart)

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
        "icon-select": {
            dom: () => <IconSelect />
        },
    }
})
```