<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef } from "vue";
import { isClient, useClipboard, useToggle } from "@vueuse/core";
import { EVENT_CODE } from "element-plus";
import { CaretTop, Expand, CopyDocument } from "@element-plus/icons-vue";
import SourceCode from "./vp-source-code.vue";

const props = defineProps<{
    source: string;
    path: string;
    rawSource: string;
    description: string;
}>();

const vm = getCurrentInstance()!;
// 防御一下在ssr环境中编译
if(typeof window !== 'undefined'){
    window.vm = vm;
}

const { copy, isSupported } = useClipboard({
    source: decodeURIComponent(props.rawSource),
    read: false,
});

const [sourceVisible, toggleSourceVisible] = useToggle();

const sourceCodeRef = ref<HTMLButtonElement>();

const locale = computed(() => {
    return {
        "view-source": "查看源码",
        "hide-source": "隐藏源码",
        "edit-in-editor": "Edit in Playground",
        "edit-on-github": "Edit on GitHub",
        "edit-in-codepen": "Edit in Codepen.io",
        "copy-code": "复制代码",
        "switch-button-option-text": "Switch to Options API",
        "switch-button-setup-text": "Switch to Composition API",
        "copy-success": "已复制!",
        "copy-error": "这个浏览器不支持复制！",
    };
});
const decodedDescription = computed(() =>
    decodeURIComponent(props.description)
);

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
    if (
        [EVENT_CODE.enter, EVENT_CODE.numpadEnter, EVENT_CODE.space].includes(
            e.code
        )
    ) {
        e.preventDefault();
        toggleSourceVisible(false);
        sourceCodeRef.value?.focus();
    }
};

const copyCode = async () => {
    const { $message } = vm.appContext.config.globalProperties;
    if (!isSupported) {
        $message.error(locale.value["copy-error"]);
    }
    try {
        await copy();
        $message.success(locale.value["copy-success"]);
    } catch (e: any) {
        $message.error(e.message);
    }
};
</script>

<template>
    <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
    <div text="sm" m="y-4" v-html="decodedDescription" />

    <div class="example">
        <div class="example-showcase">
            <slot name="source" />
        </div>

        <ElDivider class="m-0" />

        <div class="op-btns">
            <ElTooltip
                :content="locale['copy-code']"
                :show-arrow="false"
                :trigger="['hover', 'focus']"
                :trigger-keys="[]"
            >
                <ElIcon
                    :size="16"
                    :aria-label="locale['copy-code']"
                    class="op-btn"
                    tabindex="0"
                    role="button"
                    @click="copyCode"
                    @keydown.prevent.enter="copyCode"
                    @keydown.prevent.space="copyCode"
                >
                   
                    <CopyDocument />
                   
                </ElIcon>
            </ElTooltip>
            <ElTooltip
                :content="locale['view-source']"
                :show-arrow="false"
                :trigger="['hover', 'focus']"
                :trigger-keys="[]"
            >
                <button
                    ref="sourceCodeRef"
                    :aria-label="
                        sourceVisible ? locale['hide-source'] : locale['view-source']
                    "
                    class="reset-btn el-icon op-btn"
                    @click="toggleSourceVisible()"
                >
                    <ElIcon :size="16">
                        <Expand />
                    </ElIcon>
                </button>
            </ElTooltip>
        </div>

        <ElCollapseTransition>
            <SourceCode :visible="sourceVisible" :source="source" />
        </ElCollapseTransition>

        <Transition name="el-fade-in-linear">
            <div
                v-show="sourceVisible"
                class="example-float-control"
                tabindex="0"
                role="button"
                @click="toggleSourceVisible(false)"
                @keydown="onSourceVisibleKeydown"
            >
                <ElIcon :size="16">
                    <CaretTop />
                </ElIcon>
                <span>{{ locale['hide-source'] }}</span>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.example {
    border: 1px solid var(--border-color);
    border-radius: var(--el-border-radius-base);

    .example-showcase {
        padding: 1.5rem;
        margin: 0.5px;
        background-color: var(--bg-color);
    }

    .op-btns {
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 2.5rem;

        .el-icon {
            &:hover {
                color: var(--text-color);
            }
        }

        .op-btn {
            margin: 0 0.5rem;
            cursor: pointer;
            color: var(--text-color-lighter);
            transition: 0.2s;

            &.github a {
                transition: 0.2s;
                color: var(--text-color-lighter);

                &:hover {
                    color: var(--text-color);
                }
            }
        }
    }

    &-float-control {
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid var(--border-color);
        height: 44px;
        box-sizing: border-box;
        background-color: var(--bg-color, #fff);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        margin-top: -1px;
        color: var(--el-text-color-secondary);
        cursor: pointer;
        position: sticky;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        span {
            font-size: 14px;
            margin-left: 10px;
        }

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
