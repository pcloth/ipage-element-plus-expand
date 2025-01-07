import { config as $config } from "./config.js";
import ipage from "./IPage.vue";
import iSearch from "./ISearch.vue";
import iTable from "./ITable.vue";
import iForm from "./IForm.vue";
import iDialogForm from "./IDialogForm.vue";
import iTableColumn from "./components/ITableColumn.vue";
import renderCell from "./components/RenderCell";
import splitDownloadAndExport from "./components/SplitDownloadAndExport.vue";
import veMask from "./mask/directive"

// import renderSelectLoadmore from './components/RenderSelectLoadmore.vue';
export const config = $config;
export const IPage = ipage;
export const RenderCell = renderCell;
export const ISearch = iSearch;
export const ITable = iTable;
export const IForm = iForm;
export const IDialogForm = iDialogForm;
export const ITableColumn = iTableColumn;
export const SplitDownloadAndExport = splitDownloadAndExport;
// export const RenderSelectLoadmore = renderSelectLoadmore;

export const VeMask = veMask;

const components:any = {
    IPage,
    RenderCell,
    ISearch,
    ITable,
    IForm,
    IDialogForm,
    ITableColumn,
    SplitDownloadAndExport
};

const install = function (Vue:any) {
    Object.keys(components).forEach(key => {
        const component = components[key];
        Vue.component(component.name || key, component);
    });
    Vue.directive("ve-mask", veMask);
};

// 判断是否是直接引入文件，如果是，则自动安装组件
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    config: $config,
    ...components
};
