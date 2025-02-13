# Element-Plus业务扩展组件库

<img src="https://img.shields.io/npm/v/ipage-element-plus-expand?label=Version&style=flat-square">
<img src="https://img.shields.io/npm/dm/ipage-element-plus-expand?label=Downloads&style=flat-square">

# 文档
文档补全中

[点击查看文档](https://pcloth.github.io/ipage-element-plus-expand)

# 安装
```
npm install ipage-element-plus-expand --save
```

## 全局引入main.js（推荐）
```
import IpageElementExpand from "ipage-element-plus-expand";
import "ipage-element-plus-expand/es/style.css";
Vue.use(IpageElementExpand);
```

## 按需引用
```
import {
    ISearch, // 搜索框
    IForm, // 动态表单
    IDialogForm, // 弹窗动态表单
    ITable, // 动态表格
    IPage, // 组合页面
    RenderCell, // 渲染单元
    SplitDownloadAndExport, // 导出按钮
    SelectMore, // 分页下拉选择器
    IpageMask, // v-ipage-mask指令
    IpageMoney, // v-ipage-money 指令

} from "ipage-element-plus-expand";
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


# 鸣谢
项目基础配置环境配置来源于[vuecomp-starter](https://windlil.github.io/vuecomp-starter/)

文档组件预览和解析来自于[element-plus](https://github.com/element-plus/element-plus)官方github仓库，我魔改了一下方便自己使用。
