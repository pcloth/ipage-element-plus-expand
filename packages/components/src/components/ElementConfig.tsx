import SelectMore from "./SelectMore.vue";
import SplitDownloadAndExport from "./SplitDownloadAndExport.vue";
import RangeSelect from "./RangeSelect/index.vue";
import RangeSelectItem from "./RangeSelect/RangeSelectItem.vue";
import Renderer from "./Renderer.vue";
import EasyUpload from "./EasyUpload/index.vue";

import type { ElementConfigType } from "../type.d";
export const ElementConfig: ElementConfigType = {
    render: {
        dom: loadData => {
            const { render } = loadData.item;
            return <Renderer render={render} params={loadData} />;
        }
    },
    input: {
        dom: () => <el-input />
    },
    "input-number": {
        dom: () => <el-input-number />
    },
    span: {
        dom: () => <span />,
        tipIsDefault: true
    },
    div: {
        dom: () => <div />,
        tipIsDefault: true
    },
    select: {
        dom: () => <el-select />,
        optionDom: () => <el-option />
    },
    option: {
        dom: () => <el-option />
    },
    "radio-group": {
        dom: () => <el-radio-group />,
        optionDom: () => <el-radio />
    },
    radio: {
        dom: () => <el-radio />
    },
    "checkbox-group": {
        dom: () => <el-checkbox-group />,
        optionDom: () => <el-checkbox />
    },
    checkbox: {
        dom: () => <el-checkbox />
    },
    button: {
        dom: () => <el-button />,
        tipIsDefault: true
    },
    form: {
        dom: () => <el-form />
    },
    "form-item": {
        dom: () => <el-form-item />
    },
    col: {
        dom: () => <el-col />
    },
    row: {
        dom: () => <el-row />
    },
    table: {
        dom: () => <el-table />
    },
    "table-column": {
        dom: () => <el-table-column />
    },
    pagination: {
        dom: () => <el-pagination />
    },
    link: {
        dom: () => <el-link />,
        tipIsDefault: true
    },
    autocomplete: {
        dom: () => <el-autocomplete />
    },
    cascader: {
        dom: () => <el-cascader />
    },
    "color-picker": {
        dom: () => <el-color-picker />
    },
    "date-picker": {
        dom: () => <el-date-picker />
    },
    "time-picker": {
        dom: () => <el-time-picker />
        // debounce:true
    },
    "time-select": {
        dom: () => <el-time-select />
    },
    slider: {
        dom: () => <el-slider />
    },
    switch: {
        dom: () => <el-switch />
    },
    rate: {
        dom: () => <el-rate />
    },
    upload: {
        dom: () => <el-upload />
    },
    transfer: {
        dom: () => <el-transfer />
    },
    avatar: {
        dom: () => <el-avatar />
    },
    badge: {
        dom: () => <el-badge />
    },
    calendar: {
        dom: () => <el-calendar />
    },
    card: {
        dom: () => <el-card />
    },
    carousel: {
        dom: () => <el-carousel />,
        optionDom: () => <el-carousel-item />
    },
    "carousel-item": {
        dom: () => <el-carousel-item />
    },
    collapse: {
        dom: () => <el-collapse />
    },
    descriptions: {
        dom: () => <el-descriptions />,
        optionDom: () => <el-descriptions-item />
    },
    "descriptions-item": {
        dom: () => <el-descriptions-item />
    },
    empty: {
        dom: () => <el-empty />
    },
    image: {
        dom: () => <el-image />
    },
    progress: {
        dom: () => <el-progress />
    },
    result: {
        dom: () => <el-result />
    },
    tag: {
        dom: () => <el-tag />
    },
    timeline: {
        dom: () => <el-timeline />,
        optionDom: () => <el-timeline-item />
    },
    "timeline-item": {
        dom: () => <el-timeline-item />
    },
    tooltip: {
        dom: () => <el-tooltip />
    },
    tree: {
        dom: () => <el-tree />
    },
    statistic: {
        dom: () => <el-statistic />
    },
    divider: {
        dom: () => <el-divider />,
        tipIsDefault: true
    },

    /** 扩展组件 */
    "select-more": {
        dom: () => <SelectMore />
    },
    export: {
        dom: () => <SplitDownloadAndExport />
    },
    "range-select":{
        dom: () => <RangeSelect />,
        optionDom: () => <RangeSelectItem/>
    },
    "easy-upload": {
        dom: () => <EasyUpload />
    },
};
