import type { CSSProperties } from "vue";
import {
    defineComponent,
    onMounted,
    nextTick,
    ref,
    unref,
    computed,
    PropType
} from "vue";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export type Options = Cropper.Options;

const defaultOptions: Cropper.Options = {
    viewMode: 1,
    aspectRatio: 16 / 9, // 裁剪比例 false
    zoomable: true, // 是否缩放
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    autoCrop: true, // 是否在初始化时允许自动剪裁图片
    background: true, // 是否在容器上显示网格背景
    highlight: true, // 是否在剪裁框上显示白色的模态窗口
    center: true,
    responsive: true, // 是否在窗口尺寸改变的时候重置cropper
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    scalable: true,
    modal: true, // 是否在剪裁框上显示黑色的模态窗口
    guides: true, // 裁剪框的虚线(九宫格)
    movable: true, // 是否允许移动图片
    rotatable: true // 是否允许旋转图片
};

const props = {
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String
    },
    width: {
        type: [String, Number],
        default: ""
    },
    height: {
        type: [String, Number],
        default: "360px"
    },
    crossorigin: {
        type: String || Object,
        default: "anonymous"
    },
    imageStyle: {
        type: Object as PropType<CSSProperties>,
        default() {
            return {};
        }
    },
    options: {
        type: Object as PropType<Options>,
        default() {
            return {};
        }
    }
};

export default defineComponent({
    name: "ReCropper",
    props,
    emits: ["crop-end", "crop"],
    setup(props, { emit }) {
        const cropper: any = ref<Nullable<Cropper>>(null);
        const imgElRef = ref();

        const isReady = ref<boolean>(false);

        const getImageStyle = computed((): CSSProperties => {
            return {
                height: props.height,
                width: props.width,
                maxWidth: "100%",
                ...props.imageStyle
            };
        });

        const getWrapperStyle = computed((): CSSProperties => {
            const { height, width } = props;
            return {
                width: `${width}`.replace(/px/, "") + "px",
                height: `${height}`.replace(/px/, "") + "px"
            };
        });

        function init() {
            const imgEl = unref(imgElRef);
            if (!imgEl) {
                return;
            }
            imgEl.addEventListener("cropend", (e: any) => {
                emit("crop-end", e);
            });
            imgEl.addEventListener("crop", (e: any) => {
                emit("crop", e);
            });
            cropper.value = new Cropper(imgEl, {
                ...defaultOptions,
                ready: () => {
                    isReady.value = true;
                },
                ...props.options
            });
        }

        onMounted(() => {
            nextTick(() => {
                init();
            });
        });

        return {
            props,
            imgElRef,
            cropper,
            getWrapperStyle,
            getImageStyle
        };
    },
    render() {
        return (
            <>
                <div
                    class={{
                        excludeListeners: true,
                        excludeKeys: ["class"]
                    }}
                    style={this.getWrapperStyle}
                >
                    <img
                        ref="imgElRef"
                        src={this.props.src}
                        alt={this.props.alt}
                        crossorigin={this.props.crossorigin}
                        style={this.getImageStyle}
                    />
                </div>
            </>
        );
    }
});
