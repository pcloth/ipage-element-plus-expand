
import { before } from 'node:test';
import { imageTypes, createAccept } from './utils';
export default {
    /** 上传模式
     * append: 追加模式，每次上传都会追加到原有的文件列表中
     * template: 模板模式，每次上传都会替换原有的文件列表
     */
    mode: {
        type: String,
        default: 'append'
    },
    modelValue: {
        type: [String, Array],
        default: ''
    },
    /** 
     * value 格式类型
     * string: 单个文件路径;多个文件路径用逗号分隔
     * array: 多个文件路径
     * array-object: 数组的每个元素是一个对象，包含url和name属性
     */
    valueFormat: {
        type: String,
        default: 'string'
    },
    /** value无数据，但是又disabled的时候，会有一个暂无数据的提示 */
    noDataText: {
        type: String,
        default: '暂无数据'
    },
    /**
     * 如果valueType为string，用什么符号分割多个文件路径
     */
    valueSplit: {
        type: String,
        default: ','
    },
    /** 当valueType=array时候，
     * 数组的每个元素是一个对象，包含url和name属性
     */
    valueProps: {
        type: Object,
        default: () => ({
            url: 'url', // 文件路径
            name: 'name', // 如果没有name属性，会根据url属性获取文件名
            type: 'type', // img,video,file
            accept: 'accept', // 允许上传的文件类型，如果有它，优先使用它
            poster: 'poster', // 视频封面，只有type为video的时候有效
            controls: 'controls', // 视频在列表上是否显示控制条，只有type为video的时候有效
        })
    },
    /** 是否禁用组件响应 */
    disabled: {
        type: Boolean,
        default: false
    },
    /** 组件可以上传数量
     * 0: 无限制
     */
    limit: {
        type: Number,
        default: 0
    },
    accept: {
        type: String,
        default: createAccept(imageTypes)
    },
    /** 组件根节点 */
    uploadClass: {
        type: String,
        default: 'easy-upload'
    },
    /** 上传按钮class */
    uploadButtonClass: {
        type: String,
        // default: 'el-button el-button--primary el-button--small'
        default: 'easy-upload-review-item easy-upload-review-item--upload'
    },
    uploadButtonText: {
        type: String,
        default: '点击上传'
    },
    reviewClass: {
        type: String,
        default: 'easy-upload-review-item'
    },
    /** 文件项目宽度 */
    itemWidth: {
        type: [Number,String],
        default: 100
    },
    /**
     * 文件项目高度
     */
    itemHeight: {
        type: [Number,String],
        default: 100
    },
    /** 预览框和剪切框的层级 */
    zIndex: {
        type: Number,
        default: 2500
    },
    /** 是否显示标题 */
    showItemName: {
        type: Boolean,
        default: true
    },
    /** 删除前询问
     * @param {Object} file 当前删除的文件
     * @param {Number} index 当前删除的文件索引
     *  可以返回一个Promise，如果返回的是一个Promise，reject的时候会取消删除操作
     *  也可以返回一个Boolean，如果返回的是false，组件会取消删除操作
     */
    beforeRemove: {
        type: Function,
    },
};