# Element-Plus业务扩展组件库

<img src="https://img.shields.io/npm/v/ipage-element-plus-expand?label=Version&style=flat-square">
<img src="https://img.shields.io/npm/dm/ipage-element-plus-expand?label=Downloads&style=flat-square">

# 鸣谢
项目基础配置环境配置来源于`vuecomp-starter`
说明文档：https://windlil.github.io/vuecomp-starter/

文档组件预览和解析来自于element-plus官方github仓库，我魔改了一下方便自己使用。


# 文档
文档补全中

[点击查看文档](https://pcloth.github.io/ipage-element-plus-expand)

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