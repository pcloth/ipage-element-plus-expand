type OptionsType = {
    min?: number;
    precision?: number;
    max?: number;
    complete?: boolean;
}

/** 默认配置
 * @type {Object}
 * @property {number} min 最小值
 * @property {number} precision 精度
 * @property {number} max 最大值
 * @property {boolean} complete 小数位是否补全
 * 
 */
const defaultOptions: OptionsType = {
    min: 0,
    precision: 2,
    max: Number.MAX_SAFE_INTEGER,
    complete: true
};

const setOptionsAndReturn = (el: HTMLElement, binding: any) => {
    const options = Object.assign({}, defaultOptions, binding.value);
    const input = el.tagName === "INPUT" ? el : el.querySelector("input");
    if (!input) {
        throw new Error("v-ipage-money must be used on an input element");
    }
    // @ts-ignore 为input元素添加配置属性，方便后续获取
    input._config = options;
    return { input, options };
}

const buildDynamicNumberRegex = (min:number|undefined, max:number|undefined, precision:number) => {
    // 处理符号部分
    let sign = '';
    if (typeof max === 'number' && max < 0) {
        sign = '-';        // 必须输入负数
    } else if (typeof min === 'number' && min < 0) {
        sign = '-?';       // 允许负数
    } else {
        sign = '';         // 不允许负数
    }
    // 处理整数部分（禁止前导零）
    const integer = '(0|([1-9]\\d*))?';
    // 处理小数部分
    let decimal = '';
    if (precision > 0) {
        decimal = `(\\.\\d{0,${precision}})?`;
    }
    const regStr = `${sign}${integer}${decimal}`;
    // 组合正则表达式
    return new RegExp(regStr);
}


/**
 * vue3 指令 - 金额格式化
 * v-ipage-money="{
 *     min: 0, // 最小值
 *     max: 100, // 最大值
 *     precision: 2, // 精度
 * }"
 */
export default {
    name: 'ipage-money',
    mounted(el: HTMLElement, binding: any, vnode: any) {
        const { input } = setOptionsAndReturn(el, binding);
        let isInputZh = false;
        input.addEventListener("compositionstart", () => {
            isInputZh = true;
        }, false);
        input.addEventListener("compositionend", () => {
            isInputZh = false;
            onInputHandler();
        }, false);
        input.oninput = () => {
            setTimeout(() => {
                onInputHandler();
            }, 0);
        }
        input.onblur = () => {
            setTimeout(() => {
                onInputHandler(true);
            }, 0);
        }

        function emitValue(input: any, value: string) {
            const strValue = value.toString();
            input.value = strValue;
            if (
                vnode &&
                vnode.ctx &&
                vnode.ctx.emit
            ) {
                vnode.ctx.emit("update:modelValue", strValue);
            }
        }
        function onInputHandler(blur=false) {
            if (isInputZh) {
                return;
            }
            // @ts-ignore 获取输入框的值
            const { value } = input;
            // @ts-ignore 获取配置属性
            const { precision, min, max, complete } = input._config;
            let val = value.replace(/[^-\d.]/g, "");
            if (val === "") {
                emitValue(input, "");
                return;
            }
            // 允许输入负数

            const reg = buildDynamicNumberRegex(min, max, precision);
            val = val.match(reg)[0];
            if (val === "") {
                emitValue(input, "");
                return;
            }
            if (min !== undefined && Number(val) < min) {
                val = min.toString();
            }
            if (max !== undefined && Number(val) > max) {
                val = max.toString();
            }
            

            if(blur && precision > 0 && complete){
                // 失去焦点补全小数位
                if(val === "-0"){
                    val = "0";
                }
                const [integer, decimal] = val.split(".");
                if(decimal && decimal.length < precision){
                    val = `${integer}.${decimal.padEnd(precision, "0")}`;
                }else if(decimal === undefined){
                    val = `${integer}.${"".padEnd(precision, "0")}`;
                }
            }
            emitValue(input, val);
        }
    },
    updated(el: HTMLElement, binding: any) {
        setOptionsAndReturn(el, binding);
    }
}