<template>
    <div :class="props.uploadClass">
        <slot :fileList="fileList" name="default">
            <template v-for="file,idx in fileList" :key="file.uuid">
                <div class="easy-upload-review-item-outside">
                    <div :style="mergeReviewItemStyle" :class="mergeReviewClass(file)">
                        <!-- 如果是template模式下，如果没有图片，显示上传按钮 -->
                        <template v-if="!props.disabled && props.mode === 'template' && !file[props.valueProps.url]">
                            <slot name="upload-button" :upload="hanldeClickUpload" :file="file">
                                <div :class="[props.uploadButtonClass, 'template-upload']" :style="mergeReviewItemStyle"
                                    @click.stop="hanldeClickUpload(file)">
                                    + 点击上传
                                </div>
                            </slot>
                        </template>
                        <template v-else-if="props.disabled && props.mode === 'template' && !file[props.valueProps.url]">
                            <div class="upload-no-data">{{props.noDataText}}</div>
                        </template>
                        <img v-else-if="_getFileType(file) === 'img'" class="review-image"
                            :src="file[props.valueProps.url]" alt="" />
                        <video v-else-if="_getFileType(file) === 'video'" class="review-image"
                            :poster="file[props.valueProps.poster]" 
                            :controls="file[props.valueProps.controls]"
                            :src="file[props.valueProps.url]"></video>
                        <div v-else class="review-image">
                            {{ getFileSuffix(file[props.valueProps.url]) }}
                        </div>
                        <div class="easy-upload-review-item-mask">
                            <img @click.stop="viewImage(file)" title="预览" v-if="['img', 'video'].includes(_getFileType(file))"
                                class="easy-upload-review-item-mask-btn-icon" src="./images/view-fill.png"></img>
                            <img @click.stop="downloadFile(file)" title="下载" v-else class="easy-upload-review-item-mask-btn-icon"
                                src="./images/download.png"></img>
                            <img @click.stop="remoteFile(file,idx)" v-if="!props.disabled" title="删除" class="easy-upload-review-item-mask-btn-icon"
                                src="./images/delete-fill.png"></img>
                        </div>

                        <div class="easy-upload-review-item-progress">
                            <!-- 上传进度 -->
                        </div>
                    </div>
                    <slot name="name" :file="file">
                        <div v-if="props.showItemName" class="easy-upload-review-item-title">{{ file.name }}</div>
                    </slot>
                </div>
            </template>
            <template v-if="(props.disabled || props.mode==='template') && fileList.length === 0">
                <div class="easy-upload-review-item-outside">
                    <div :style="mergeReviewItemStyle" :class="mergeReviewClass({})">
                        <div class="upload-no-data">{{props.noDataText}}</div>
                    </div>
                </div>
                
            </template>
        </slot>
        <slot v-if="showUploadButton" name="upload-button" :upload="hanldeClickUpload" :file="null">
            <div class="easy-upload-review-item-outside">
                <div :class="props.uploadButtonClass" :style="mergeReviewItemStyle" @click.stop="hanldeClickUpload()">
                    + {{props.uploadButtonText}}
                </div>
            </div>
        </slot>

        <ReviewBox :zIndex="props.zIndex" v-model:show="showReviewBox" :src="currentSrc" :isVideo="currentSrcIsVideo"/>
    </div>
</template>
<script setup lang="tsx">
import { defineProps, ref, computed, onMounted } from 'vue'
import props_ from './props'
import { 
    promisify, 
    imageTypes,
    videoTypes,
    createAccept,
    getUuid, getName, fileType, testIsBase64, getFileSuffix } from './utils'
import ReviewBox from './reviewBox.vue'
const _getFileType = (item: any) => {
    return fileType(item[props.valueProps.url] || "")
}

const emits = defineEmits([
    "openfile",
    "cropped",
    "beforce-upload",
    "upload-success",
    "upload-error",
    "upload-progress",
    "update:modelValue",
    "file-error",
    "delete-file"
]);

const props = defineProps(props_)
const fileList = ref<any>([])


/** 从modelvalue获取文件列表 */
const getModelValue = () => {
    let arr: any = [];
    if (!props.modelValue) return arr;
    if (props.valueFormat === "array") {
        arr = props.modelValue;
    } else if (props.valueFormat === "string") {
        if (!props.modelValue) {
            arr = [];
        } else if (typeof props.modelValue === "string") {
            if (testIsBase64(props.modelValue)) {
                return [
                    {
                        uuid: getUuid(12, 17),
                        name: "base64图片" + getUuid(4, 17) + ".png",
                        src: props.modelValue,
                        status: "success",
                        isBase64: true
                    }
                ];
            }
            arr = props.modelValue.split(props.valueSplit).filter(item => item);
        } else if (Array.isArray(props.modelValue)) {
            arr = props.modelValue;
        } else {
            console.error(
                "ve-cropper组件valueFormat配置错误1",
                props.modelValue
            );
        }
    } else {
        console.error("ve-cropper组件valueFormat配置错误2", props.modelValue);
    }
    arr = arr.map((item: any) => {
        if (typeof item === 'object') {
            if(!item.uuid) item.uuid = getUuid(12, 17);
            if(!item.name) item.name = getName(item[props.valueProps.url]);
            if(!item.status) item.status = "success";
            if(!item.type) item.type = fileType(item[props.valueProps.url]);
            return item
        }
        const obj = fileList.value.find((it: any) => it[props.valueProps.url] === item);
        const uuid = obj?.uuid || getUuid(12, 17);
        const name = obj?.name || getName(item);
        return {
            uuid,
            [props.valueProps.name]: name,
            [props.valueProps.url]: item,
            status: "success",
            type: fileType(item)
        };
    });
    return arr;
};

/** 输出modelValue */
const outPutValue = () => {
    const arr: any = [];
    fileList.value.forEach((item: any) => {
        if (item.status === "success") {
            arr.push(item.src);
        }
    });
    if (props.valueFormat === "array") {
        emits("update:modelValue", arr);
    } else if (props.valueFormat === "string") {
        emits("update:modelValue", arr.join(props.valueSplit));
    } else {
        console.error("ve-cropper组件valueFormat配置错误");
    }
};

const mergeReviewItemStyle = computed(() => {
    const style_: any = {};
    if (typeof props.itemWidth === 'number') {
        style_['width'] = props.itemWidth + 'px'
    } else {
        style_['width'] = props.itemWidth
    };

    if (typeof props.itemHeight === 'number') {
        style_['height'] = props.itemHeight + 'px'
    } else {
        style_['height'] = props.itemHeight
    };

    // if(props.disabled){
    //     style_['pointer-events'] = 'none'
    // }
    console.log('mergeReviewItemStyle', style_)
    return style_;
});

const mergeReviewClass = computed((file: any) => {
    return (file: any) => {
        let status = file.status === 'success' ? 'success' : 'error'
        return [props.reviewClass, {
            'easy-upload-review-item-disabled': props.disabled,
            'easy-upload-review-item-template': props.mode === 'template',
            'is-upload': props.mode === 'template' && !file[props.valueProps.url],
        }]
    }
});





onMounted(() => {
    fileList.value = getModelValue();
    console.log(props, 'props', fileList)
    window.fileList = fileList
});

const showUploadButton = computed(() => {
    let status = props.disabled ? false : true
    // 检查当前文件数量是否满足
    if (status && props.limit > 0 && fileList.value.length >= props.limit) {
        status = false
    }
    if (props.mode === 'template') {
        // 模板模式下，不显示最后的上传按钮
        status = false
    }
    console.log('showUploadButton', status, props.limit, fileList.value.length)
    return status
})
const currentTemplate = ref<any>(null)
const hanldeClickUpload = (item: any = null) => {
    // 如果是模板模式下，上传后替换当前模板的图片
    if (props.disabled) return;
    let accept = props.accept;
    
    if(props.mode==='template'){
        currentTemplate.value = item
        if(item){
            if(item[props.valueProps.accept]){
                accept = item[props.valueProps.accept]
            }else if(item[props.valueProps.type]){
                const type = item[props.valueProps.type]
                if(type === 'img'){
                    accept = createAccept(imageTypes)
                }else if(type === 'video'){
                    accept = createAccept(videoTypes)
                }
            }
        }
    }else{
        currentTemplate.value = null
    }
    console.log("clickUpload", accept);
    // 打开文件选择框
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = false;
    input.click();
};

const showReviewBox = ref(false)
const currentSrc = ref('')
const currentSrcIsVideo = ref(false)
const viewImage = (file: any) => {
    // 打开图片预览 TODO
    console.log('viewImage', file)
    currentSrc.value = file[props.valueProps.url]
    currentSrcIsVideo.value = _getFileType(file) === 'video'
    showReviewBox.value = true

};

const downloadFile = (file: any) => {
    // 下载文件
    const a = document.createElement("a");
    a.href = file[props.valueProps.url];
    a.download = file[props.valueProps.name];
    a.target = "_blank";
    a.click();
};

const remoteFile = async (file: any, idx: number) => {
    // 删除文件
    if(props.disabled) return;
    if(props.beforeRemove){
        const status = await promisify(props.beforeRemove, file,idx)
        if(!status) return;
    }
    if(props.mode==='template') {
        file[props.valueProps.url]=''
    }else if(props.mode==='append'){
        fileList.value.splice(idx, 1);
    }else{
        throw new Error('mode配置错误')
    }
    outPutValue();
    emits("delete-file", file,idx);
};

</script>
<style lang="scss">
@import './style.scss'
</style>