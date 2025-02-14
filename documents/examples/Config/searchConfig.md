# ISearch配置参数

|配置项|类型|说明|默认值|
|--|--|--|--|
|autoQuery|boolean|加载组件后是否立即搜索|true|
|isFormItem|boolean|ISearch的单元格是否添加el-form-item外层|true|
|singleInput|boolean|单个输入框回车后立即搜索|false|

## 以下配置作用域search相关行为，只在IPage，SelectMore，Export组件中的查询生效
|配置项|类型|说明|默认值|
|--|--|--|--|
|mode|string|分页参数模式^[enum]`'page'=分页模式 \| 'limit'=偏移量模式 ` 分页模式传递给查询接口的参数一般是：`pageNumber`,`pageSize`，偏移量模式传递给后端的一般是：`limit`, `offset`|`page`|
|pageSize|string|mode='page'时生效，用来表达分页尺寸的参数，比如，要查询每页12条，发送给接口的数据就就是`pageSize=12`|`pageSize`|
|pageNo|string|mode='page'时生效，用来表达当前页码的参数，比如，要查询第3页，发送给接口的数据就就是`pageNo=3`|`pageNo`|
|limit|string|mode='limit'时生效，用来表达分页尺寸的参数，比如，要查询每页12条，发送给接口的数据就就是`limit=12`|`limit`|
|offset|string|mode='limit'时生效，用来表达当前查询数据偏移量的参数（页码），比如要查询第2页的数据，limit=12的时候，offset=(2-1)*12=12；而查询第一页，offset=(1-1)*12=0|`offset`|

## 以下配置作用域search相关行为，只在IPage组件中的查询生效
|配置项|类型|说明|默认值|
|--|--|--|--|
|beforeFunc|function|查询前执行的方法，需要返回分页需要的参数，只在IPage里生效|