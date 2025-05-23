export type { 
    CellItemType, 
    ColumnType, 
    ElementConfigType, 
    IPageElementPlusExpandConfigType 
} from './type';

import { config as $config} from "./config"

import ipage from "./IPage.vue";
import iSearch from "./ISearch.vue";
import iTable from "./ITable.vue";
import iForm from "./IForm.vue";
import iDialogForm from "./IDialogForm.vue";
import iTableColumn from "./components/ITableColumn.vue";
import renderCell from "./components/RenderCell";
import splitDownloadAndExport from "./components/SplitDownloadAndExport.vue";
import ipageMask from "./directives/mask/directive"
import ipageMoney from "./directives/money/index"
import selectMore from './components/SelectMore.vue';
import easyUpload from './components/EasyUpload/index.vue';
import rangeSelect from './components/RangeSelect/index.vue';
import rangeSelectItem from './components/RangeSelect/RangeSelectItem.vue';

export const config = $config;
export const IPage = ipage;
export const RenderCell = renderCell;
export const ISearch = iSearch;
export const ITable = iTable;
export const IForm = iForm;
export const IDialogForm = iDialogForm;
export const ITableColumn = iTableColumn;
export const SplitDownloadAndExport = splitDownloadAndExport;
export const SelectMore = selectMore;
export const EasyUpload = easyUpload;
export const RangeSelect = rangeSelect;
export const RangeSelectItem = rangeSelectItem;


export const IpageMask = ipageMask;
export const IpageMoney = ipageMoney;

const components:any = {
    IPage,
    RenderCell,
    ISearch,
    ITable,
    IForm,
    IDialogForm,
    ITableColumn,
    SelectMore,
    SplitDownloadAndExport,
    EasyUpload,
    RangeSelect,
    RangeSelectItem
};

const install = function (Vue:any) {
    Object.keys(components).forEach(key => {
        const component = components[key];
        Vue.component(component.name || key, component);
    });
    // 注册指令
    Vue.directive("ipage-mask", ipageMask);
    Vue.directive("ipage-money", ipageMoney);
};

// 判断是否是直接引入文件，如果是，则自动安装组件
// 防御一下在ssr环境中编译
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    config: $config,
    ...components
};
