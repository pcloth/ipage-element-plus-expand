# 全局配置

一些业务组件的配置，我们专门放了一个全局单例对象来存储，你只需要引入并修改一次，就可以全局使用了。

通常我们建议你直接在建立一个`ipageConfig.ts`文件，内容如下
```js
import { config } from "ipage-element-plus-expand";
config.set({
    // 这里写入你要配置的选项
    search: {
        pageNo: "pageNumber"
    },
    response: {
        data: "data",
        total: "count"
    },
    searchInputProps: {
        size: "small"
    },
    searchSubmitButton: {
        props: {
            size: "small"
        }
    },
    searchResetButton: {
        props: {
            size: "small"
        }
    },
})
export default config;
```

然后在`main.ts`中引用你这个配置文件
```js
import IpageElementExpand from "ipage-element-plus-expand"
import "ipage-element-plus-expand/es/style.css";
Vue.use(IpageElementExpand)

// 引入你自己的配置文件，使其代码运行
import config from "@/config/ipageConfig";
```