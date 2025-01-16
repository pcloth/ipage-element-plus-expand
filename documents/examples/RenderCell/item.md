## RenderCell 属性

|属性|类型|说明|默认值|
|--|--|--|--|
|modelValue|^[enum]`'String' \| 'Number' \| 'Array' \| 'Object' \| 'Date'`|v-model数据|`undefined`|
|item|object|渲染组件内容数据，下方有详细说明|`undefined`|
|defaultSlot|string|`item`对象中如果没有`slot`值，将使用defaultSlot|`undefined`|
|defaultProp|object|`item`对象中如果没有`props`defaultProp|`undefined`|
|allItems|array|兄弟RenderCell数据集，传递给荷载数据`loadData`|`undefined`|
|formData|object|父级表单model数据，传递给荷载数据`loadData`|`undefined`|
|qData|Object|父级附加数据，传递给荷载数据`loadData`|`undefined`|


## item 属性
|属性|类型|说明|默认值|
|--|--|--|--|
|sort|number|排序，当需要排序的地方，可以用它来插入到默认单元的前面|`undefined`|
|id|string|表单组件v-model的对象key，循环渲染时候的key|如果不传入，将随机生成一个uuid|
|label|string|当isFormItem=true时候，表单标签|`undefined`|
|tip|string|input的placeholder，span、button、link、checkbox的默认插槽|`undefined`|
|slot|string|需要渲染的element-ui组件类型，默认去掉el字符，比如el-input，写为`input`|`undefined`|
|options|^[enum]`'array' \| 'function' \| 'async function'`|select、radio-group、checkbox-group子组件的options|[]|
|directives|array|自定义指令数据|[]|
|debounce|boolen,number|v-model是否需要额外的防抖|`undefined`|
|render|`jsx Function`|当slot='render'的时候生效，直接渲染dom|无|
|slots|object|用于组件的插槽|{}|
|props|object|传递给原生组件的props，如果其中有function类型，会自动添加loadData数据|{}|
|on|object|传递给原生组件的on,用于接收组件的emit事件，会自动添加loadData数据|{}|
|show|boolen\|Function|是否显示本组件，类似v-show|true|
|isFormItem|boolen|是否在父级添加el-form-item组件|true|
|formItemProps|object|如果isFormItem=true的时候，父级el-form-item组件的props参数|{}|
|isCol|boolean|是否添加一个el-col组件在外层|false|
|colProps|object|如果添加了el-col，给它的配置||
|otherValueRange|Array\<string\>|比如date-pcker组件，如果指定了时间范围，将会获得一个array的value，你可以在这里配置它们映射的其他value，比如['start','end']，将会把['2021-01-01','2021-01-02']映射成\{start:'2021-01-01',end:'2021-01-02'\}||
|valueWatch|Function|当值发生变化时，触发这个方法||
|optionDom|`jsx Function`|自定义options节点的渲染函数||
|mask|^[enmu]`'string' \| 'Array<string>' \| 'Object'`|限定输入范围，详情可以查看`mask属性`||
|...rest|any|其他属性，将传递给实际的组件，推荐你还是应该放到上面的`props`里面，因为放在这里的方法不会被注入`loadData`|{}|

## mask 属性
#### 方法一：传入字符串或者数组字符串，表示如下默认值：
```
    mask:"##-###"
```
表示接收2位数的数字加横线+3位的数字
::: tip
    其中默认的规则有：
        C: { pattern: /[\u4e00-\u9fa5]/ },
        "#": { pattern: /\d/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
        "!": { escape: true }
:::

#### 方法二：传入对象，表示自定义规则，比如：
```
        mask:{
            mask:"ff",
            tokens:{
                f:{
                    pattern: /[a-zA-Z]/, 
                    transform: v => v.toLocaleUpperCase() 
                }
            }
        }
```
:::tip
它将只接收2个英文，并转换成大写
:::

## loadData 荷载数据
传递给组件方法的有如下数据：`item`、`data`、`qData`、`allItems`、`$rcell`
:::tip
所有在item配置on和props下面的方法，都会被注入`loadData`，在方法自身参数的最后面，比如change事件
```js
{
    "id":"name",
    "slot":"input",
    "on":{
        "change":(val,loadData)=>{
            // 常规的change只会提交val参数，而渲染核心会附加一个loadData进来。
            console.log(val,loadData,"change")
        }
    }
}
```
:::

### loadData 数据包括以下内容
1. `item`为自生接收到的props.item
2. `data`为props.formData
3. `qData`为props.qData
4. `allItems`为props.allItems
5. `$rcell`为组件的实例



