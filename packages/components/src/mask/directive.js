import masker from "./masker";
import tokens from "./tokens";

export default {
    mounted(el, binding, vnode) {
        let config = binding.value;
        if (Array.isArray(config) || typeof config === "string") {
            config = {
                mask: config,
                tokens: tokens
            };
        }
        const ele = el.tagName === "INPUT" ? el : el.querySelector("input");
        // 将参数记录到dom上
        ele._config = config;
        let isInputZh = false;
        ele.addEventListener(
            "compositionstart",
            function () {
                isInputZh = true;
            },
            false
        );
        ele.addEventListener(
            "compositionend",
            function () {
                isInputZh = false;
                onInputHandler();
            },
            false
        );
        ele.oninput = function () {
            setTimeout(() => {
                onInputHandler();
            }, 0);
        };
        ele.onblur = function () {
            setTimeout(() => {
                onInputHandler();
            }, 0);
        };

        function onInputHandler() {
            if (isInputZh) {
                return;
            }
            let position = ele.selectionEnd;
            // save the character just inserted
            const digit = ele.value[position - 1];
            const _config = ele._config;
            ele.value = masker(ele.value, _config.mask, true, _config.tokens);
            // if the digit was changed, increment position until find the digit again
            while (
                position < ele.value.length &&
                ele.value.charAt(position - 1) !== digit
            ) {
                position++;
            }
            if (ele === document.activeElement) {
                ele.setSelectionRange(position, position);
                setTimeout(function () {
                    ele.setSelectionRange(position, position);
                }, 0);
            }
            if (
                vnode &&
                vnode.componentInstance &&
                vnode.componentInstance.$emit
            ) {
                vnode.componentInstance.$emit("input", ele.value);
            }
        }
    },
    updated(el, binding) {
        let config = binding.value;
        if (Array.isArray(config) || typeof config === "string") {
            config = {
                mask: config,
                tokens: tokens
            };
        }
        const ele = el.tagName === "INPUT" ? el : el.querySelector("input");
        // 更新参数
        ele._config = config;
    }
};
