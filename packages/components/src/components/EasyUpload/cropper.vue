<template>
    <div class="easy-upload-cropper" v-if="props.show" :style="{
        zIndex: props.zIndex
    }">
        <div class="easy-upload-cropper-mask" :style="{
            zIndex: props.zIndex + 1
        }" @click="onCancelCropper" />
        <div class="easy-upload-cropper-content" :style="_mergeContentStyle">
            <div class="easy-upload-cropper-content-close" @click="onCancelCropper">
                x
            </div>
            <VueCropper v-if="props.show" ref="refCropper" :src="currentSrc" @crop-end="onCropEnd" @crop="onCropperInfo"
                :options="_mergeOptions" />
            <div class="easy-upload-cropper-toolbar" v-if="props.showRatioController">
                <el-radio-group v-model="currentRatio" @change="changeCurrentRatio">
                    <el-radio-button :value="item.value" v-for="item in _mergeRatioList" :key="item.value">{{ item.label
                        }}</el-radio-button>
                </el-radio-group>
            </div>
            <div class="easy-upload-cropper-toolbar preview-box">
                <div ref="previewCanvasRef" class="easy-upload-cropper-viewers" />
                <div class="easy-upload-zoom-toolbox" v-if="props.useZoom">
                    <div class="easy-upload-cropper-toolbar">
                        <div class="zoom-toolbox-row">
                            <el-checkbox :disabled="_parentLockSize" @change="changeLockZoom($event, 'width')"
                                v-model="isLockSizeOutWidth">按宽度缩放</el-checkbox>
                            <el-input v-model="currentWidth" size="small" :input-style="{ textAlign: 'right' }"
                                :disabled="!isLockSizeOutWidth || _parentLockSize"
                                @change="setZoomSize($event, 'width')">
                                <template #prefix>宽度:</template>
                                <template #append> 像素 </template>
                            </el-input>
                        </div>
                        <div class="zoom-toolbox-row">
                            <el-checkbox :disabled="_parentLockSize" v-model="isLockSizeOutHeight"
                                @change="changeLockZoom($event, 'height')">按高度缩放</el-checkbox>
                            <el-input v-model="currentHeight" size="small" :input-style="{ textAlign: 'right' }"
                                @change="setZoomSize($event, 'height')"
                                :disabled="!isLockSizeOutHeight || _parentLockSize">
                                <template #prefix>宽度:</template>
                                <template #append> 像素 </template>
                            </el-input>
                        </div>
                        <div class="zoom-toolbox-row" v-if="props.useWatermark">
                            <el-checkbox @change="changeWatermarkText()" :disabled="!props.allowChangeWatermarkText"
                                v-model="_useWatermark">使用水印</el-checkbox>
                            <el-input v-model="_watermarkText" size="small" :input-style="{ textAlign: 'right' }"
                                :disabled="!props.allowChangeWatermarkText || !_useWatermark"
                                @change="changeWatermarkText">
                            </el-input>
                        </div>
                    </div>
                    <div class="zoom-toolbox-row easy-upload-cropper-buttons">
                        <el-button @click="onCancelCropper">取消</el-button>
                        <el-button :loading="uploadLoading" type="primary" @click="onCropper">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, nextTick, watch, computed, PropType } from 'vue';
import VueCropper from './vueCropperjs';
import type { Options } from "./vueCropperjs"
import { makeWatermark, zoomImage, debounce, getFileFormatToCanvasType } from "./utils";

const refCropper = ref<any>(null);
const emit = defineEmits([
    'update:show',
    'cropped',
    'update:watermarkText',
    'cancel'
])
const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    quality: {
        type: Number
    },
    /** 
     * 图片信息
     */
    srcItem: {
        type: Object,
        default: () => {
            return {}
        }
    },
    show: {
        type: Boolean,
        default: false
    },
    zIndex: {
        type: Number,
        default: 2500
    },
    /** 
     * 窗体样式
     */
    contentStyle: {
        type: Object,
        default: () => {
            return {}
        }
    },
    /** 
     * 是否锁定宽高的尺寸到width和height像素
     */
    isLockSize: {
        type: Boolean,
        default: false
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    /**
     * https://github.com/fengyuanchen/cropperjs 详细配置
     */
    options: {
        type: Object as PropType<Options>,
        default: () => ({
            aspectRatio: 1 / 1,
            autoCropArea: 0.8
        })
    },
    /** 不锁定的时候，显示比例控制器 */
    showRatioController: {
        type: Boolean,
        default: true
    },
    /**
     * 是否使用缩放功能
     */
    useZoom: {
        type: Boolean,
        default: true
    },
    forceZoom: {
        type: Boolean,
        default: false
    },
    zoomLimit: {
        type: Object
    },
    /**
     * 剪裁比例列表
     */
    ratioList: {
        type: Array,
    },
    /**
     * 是否使用水印
     */
    useWatermark: {
        type: Boolean,
        default: true
    },
    /**
     * 水印配置： 参考watermarkjs
     * @param {target} canvas 水印目标画板 方便自己写水印
     * @param {String} text 水印文字
     * @param {Object} watermark watermarkjs对象
     * @returns {Object} 返回canvas对象 或者 watermark.text.lowerLeft等方法的返回值
     */
    watermarkFunc: {
        type: Function
    },
    /** 
     * 水印文字：默认会根据文件名生成水印文字平铺在图片上
     * 如果设置了watermarkText，会使用watermarkText作为水印文字
     * 如果设置了useWatermark为false，会忽略watermarkText
     * 如果配置了watermarkFunc，会忽略watermarkText
     */
    watermarkText: {
        type: String,
        default: ''
    },
    /** 
     * 允许修改水印文字: 必须要允许剪裁的时候生效，会让用户输入水印文字
     */
    allowChangeWatermarkText: {
        type: Boolean,
        default: false
    },
    uploadLoading: {
        type: Boolean,
        default: false
    },
})

const _watermarkText = ref(props.watermarkText);
const _useWatermark = ref(props.useWatermark);
const changeWatermarkText = () => {
    onCropperInfo({ detail: previewInfo.value });
}

const _parentLockSize = computed(() => {
    return props.forceZoom && props.zoomLimit;
})

/** 高宽都用像素锁定 */
const _parentLockSizeWidthHeight = computed(() => {
    return props.forceZoom && props.zoomLimit && props.zoomLimit.width && props.zoomLimit.height;
})


const _mergeContentStyle = computed(() => {
    return {
        width: '700px',
        zIndex: props.zIndex + 2,
        ...props.contentStyle,
    }
})

const currentSrc = ref(props.src);

watch(() => props.src, (val) => {
    currentSrc.value = val;
})

const _mergeRatioList = computed<any>(() => {
    const arr = [
        ...(props.ratioList||[])
    ];
   
    return arr;
});



const initCurrentRatio = ()=>{
    let value = 0;
    if(!_mergeRatioList.value || _mergeRatioList.value.length === 0){
        return value;
    }
    const def = _mergeRatioList.value.find((item:any)=>item.isDefault)
    if(def){
        value = def.value;
    }else {
        value = _mergeRatioList.value[0].value;
    }
    return value;
}
const currentRatio = ref(initCurrentRatio());

/** 给cropperjs的配置参数 */
const _mergeOptions = computed<Options>(() => {
    const _mp: any = {
        aspectRatio: 1 / 1,
        autoCropArea: 0.8,
        ...props.options
    }
    _mp.autoCrop = currentRatio.value<0?false:true;
    if (currentRatio.value <= 0) {
        _mp.aspectRatio = false;
    } else {
        _mp.isLockSize = true;
        _mp.aspectRatio = currentRatio.value;
    }
    return _mp;
})

const _clipping = ref(false);
const previewSrc = ref("");
const previewInfo = ref<any>({});
const currentWidth = ref(0);
const currentHeight = ref(0);
const previewCanvasRef = ref<any>(null);
const isLockSizeOutWidth = ref(false);
const isLockSizeOutHeight = ref(false);
const onCropEnd = (e: any) => {
    if (props.isLockSize) {
        return;
    }
    const cropper = refCropper.value.cropper;
    const box = cropper.getCropBoxData();
    const ratio = box.width / box.height;
    const has = _mergeRatioList.value.find((item: any) => item.value === ratio);
    if (!has) {
        // 如果没有找到，就是自由剪裁
        currentRatio.value = 0;
    } else {
        currentRatio.value = ratio;
    }
};

const canvasToBlob = (canvas: any, type: any = undefined, quality = 1) => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob: any) => {
            resolve(blob);
        }, type, quality);
    });
};


const _onCropperInfo = async (e: any) => {
    if (!e.detail.width || _clipping.value) {
        return;
    }
    const data = JSON.parse(JSON.stringify(e.detail));
    previewSrc.value = data.preview;
    data.width = Math.ceil(e.detail.width);
    data.height = Math.ceil(e.detail.height);
    data.x = Math.ceil(data.x);
    data.y = Math.ceil(data.y);
    previewInfo.value = data; //JSON.parse(JSON.stringify(data));
    let canvas = refCropper.value.cropper.getCroppedCanvas();
    if (_parentLockSize.value) {
        if (props.zoomLimit) {
            let w = props.zoomLimit.width;
            let h = props.zoomLimit.height;
            let ratio = 0;
            if (w && h) {
                // 如果两个都有，强制比例
                ratio = +(w / h).toFixed(2);
                if (currentRatio.value !== ratio) {
                    currentRatio.value = ratio;
                    changeCurrentRatio(ratio);
                }
                currentWidth.value = w;
                currentHeight.value = h;
                isLockSizeOutWidth.value = true;
                isLockSizeOutHeight.value = true;
                // changeCurrentRatio(ratio);
            } else if (w) {
                ratio = w / data.width;
                currentWidth.value = w;
                currentHeight.value = Math.ceil(data.height * ratio);
                isLockSizeOutWidth.value = true;
            } else if (h) {
                ratio = h / data.height;
                currentHeight.value = h;
                currentWidth.value = Math.ceil(data.width * ratio);
                isLockSizeOutHeight.value = true;
            }
        }
    } else {
        currentHeight.value = canvas.height;
        currentWidth.value = canvas.width;
    }


    canvas.style.objectFit = "contain";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";

    if (_useWatermark.value) {
        const watermarkText = _watermarkText.value;
        const imgBolb = await canvasToBlob(canvas);
        const bolb = await makeWatermark(imgBolb, watermarkText, props.watermarkFunc);
        // 把bolb 绘制到canvas上
        const img = new Image();
        img.src = URL.createObjectURL(bolb);
        img.onload = () => {
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        previewCanvasRef.value.innerHTML = "";
        previewCanvasRef.value.appendChild(canvas);
    } else {
        previewCanvasRef.value.innerHTML = "";
        previewCanvasRef.value.appendChild(canvas);
    }
};

const onCropperInfo = debounce(_onCropperInfo, 100, false);

const setCopperSize = () => {
    const cropper = refCropper.value.cropper;
    previewInfo.value.width = +previewInfo.value.width;
    previewInfo.value.height = +previewInfo.value.height;
    previewInfo.value.x = +previewInfo.value.x;
    previewInfo.value.y = +previewInfo.value.y;
    cropper.setData(previewInfo.value);
};

const changeLockZoom = (value: number, key: string) => {
    if (value) {
        if (key === "width") {
            isLockSizeOutHeight.value = false;
        } else {
            isLockSizeOutWidth.value = false;
        }
    }
};

const setZoomSize = (value: number, key: string) => {
    let width = previewInfo.value.width;
    let height = previewInfo.value.height;
    let ratio = 0;
    if (key === "width") {
        ratio = width / currentHeight.value;
        height = Math.ceil(value / ratio);
        currentHeight.value = height;
    } else {
        ratio = height / currentWidth.value;
        width = Math.ceil(value / ratio);
        currentWidth.value = width;
    }
};

const changeCurrentRatio = async (value: any) => {
    const cropper = refCropper.value.cropper;
    if (value === -1) {
        cropper.setAspectRatio(NaN);
        cropper.clear();
        previewInfo.value = {
            x: 0,
            y: 0,
            width: currentWidth.value,
            height: currentHeight.value
        };
    } else {
        value = +value.toFixed(2);
        const obj = cropper.getCropBoxData();
        currentHeight.value = obj.height;
        currentWidth.value = obj.width;
        cropper.setAspectRatio(value);
        cropper.crop();
    }
};


onMounted(async () => {

})

const onCancelCropper = () => {
    emit('cancel')
    emit('update:show', false);
}

/** 裁剪开始，todo输出格式和压缩率等信息 */
const onCropper = async (): Promise<void> => {
    await nextTick();
    _clipping.value = true;
    const cropper = refCropper.value.cropper;
    const canvasOptions = props.isLockSize
        ? { width: props.width, height: props.height }
        : {};

    // 这个截图工具无法放大，只能缩小，改为后面自己处理缩放
    // if (isLockSizeOutWidth.value || isLockSizeOutHeight.value) {
    //     canvasOptions.width = Number(currentWidth.value);
    //     canvasOptions.height = Number(currentHeight.value);
    //     cropper.crop();
    //     const sizeData = refCropper.value.cropper.getCanvasData();
    //     cropper.setCropBoxData({
    //         height: sizeData.naturalHeight,
    //         width: sizeData.naturalWidth,
    //         top: 0,
    //         left: 0
    //     });
    // }
    const canvas = cropper.getCroppedCanvas(canvasOptions);
    let blob = await canvasToBlob(canvas);
    // 缩放
    if (isLockSizeOutWidth.value || isLockSizeOutHeight.value) {
        const params: any = {}
        if (isLockSizeOutWidth.value) {
            params["width"] = currentWidth.value;
        }
        if (isLockSizeOutHeight.value) {
            params["height"] = currentHeight.value;
        }
        blob = await zoomImage(blob, params);
    }

    if (_useWatermark.value) {
        const watermarkText = _watermarkText.value;
        blob = await makeWatermark(blob, watermarkText, props.watermarkFunc);
    }

    _clipping.value = false;
    emit("cropped", blob);
};


</script>

<style lang="scss" scoped>
.easy-upload-cropper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;


    .easy-upload-cropper-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1000;
    }

    .easy-upload-cropper-content {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 7px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        // overflow: hidden;
        padding: 10px;

        .easy-upload-cropper-content-close {
            position: absolute;
            top: -30px;
            right: -25px;
            cursor: pointer;
            font-size: 30px;
            color: #FFF;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

            img {
                width: 20px;
                height: 20px;
            }
        }

        .easy-upload-cropper-toolbar {
            // margin-top: 10px;
            display: flex;
            flex-direction: column;
            padding: 5px 0;

            // background-color: #f0f0f0;
            .easy-upload-cropper-toolbar_title {
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
            }

        }

        .preview-box {
            flex-direction: row;
            gap: 20px;

            .easy-upload-cropper-viewers {
                width: 300px;
                height: 200px;
            }

            .easy-upload-zoom-toolbox {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .el-input {
                    width: calc(100% - 150px);
                }

                .el-checkbox {
                    margin-right: 10px;
                }

            }




        }
    }

    .zoom-toolbox-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .easy-upload-cropper-buttons {
        justify-content: flex-end;
    }
}
</style>