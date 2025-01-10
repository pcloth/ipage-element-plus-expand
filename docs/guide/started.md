# 快速上手

### 通过npm安装
```sh
npm install ipage-element-plus-expand --save
```

### 项目中引入
```js main.js
import IpageElementExpand from "ipage-element-plus-expand"
import "ipage-element-plus-expand/es/style.css";
Vue.use(IpageElementExpand)
```

### 页面中使用
```html
<div class="group">
  <IPage
            :searchItems="searchItems"
            :columns="columns"
            :formItems="formItems"
            v-bind="otherProps"
        />
</div>

<script setup lang="ts">
import { ref } from "vue"
import type {CellItemType} from "ipage-element-plus-expand"
/** 搜索字段 */
const searchItems = ref<CellItemType[]>([
    {
        id:'name',
        label:'姓名',
        props:{
            placeholder:"请输入姓名"
        },
    },
    {
        id:'gender',
        label:'性别',
        slot:'select',
        props:{
            placeholder:"请选择性别"
        },
        options:[
            {
                label:'男',
                value:1
            },
            {
                label:'女',
                value:2
            },
            {
                label:'保密',
                value:3,
                disabled:true
            }
        ]
    },
]);

/** 展示字段 */
const columns = ref<ColumnType[]>([
    {
        columnProps:{
            prop:'name',
            label:'姓名'
        }
    },
    {
        columnProps:{
            prop:'gender',
            label:'性别',
            formatter:(val)=>{
                return {
                    1:'男',
                    2:'女',
                    3:'保密'
                    }[val.gender]
            }
        }
    }
]);

/** 编辑表单字段 */
const formItems = ref<CellItemType[]>([
    {
        id:'name',
        label:'姓名',
        slot:'input',
        props:{
            placeholder:"请输入姓名"
        },
    },
    {
        id:'gender',
        label:'性别',
        slot:'select',
        props:{
            placeholder:"请选择性别"
        },
        options:[
            {
                label:'男',
                value:1
            },
            {
                label:'女',
                value:2
            },
            {
                label:'保密',
                value:3,
            }
        ]
    },
]);

const mockApiFunc = async(params)=>{
    return new Promise((resolve, reject) => {
        const records = []
        for(let i=0;i<10;i++){
            records.push({
                name:'张三',
                gender:(i%2)+1,
            })
        }
        setTimeout(()=>{
            resolve({
                data:{
                    records
                },
                total:records.length
            })
        },1500)
    })
}

/** 其他页面参数 */
const otherProps = ref<Record<string, any>>({
    searchProps:{
        queryFunc:mockApiFunc
    },
    deleteFunc:async (data)=>{
        // 发起删除请求
        return true
    },
    submitFunc:async (data)=>{
        // 发起保存请求
        return true
    }
});
</script>
```