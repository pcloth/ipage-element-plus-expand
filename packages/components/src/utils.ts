/** 处理一个值是否有效，确定是否需要合并 */
export const effectiveValue = obj => {
    if (obj === undefined || obj === null) return false;
    if (Array.isArray(obj)) {
        return obj.length > 0;
    } else if (typeof obj === "object") {
        return Object.keys(obj).length > 0;
    } else if (typeof obj === "boolean") {
        return true;
    } else {
        return obj ? true : false;
    }
};

/** 深度合并有效参数 */
const deepMergeEffectiveValue = (target, source) => {
    const targetKeys = Object.keys(target);
    const sourceKeys = Object.keys(source);
    const allKeys = [...targetKeys, ...sourceKeys];
    const result = {};
    allKeys.forEach(key => {
        if (source[key] !== undefined) {
            result[key] = source[key];
        } else {
            result[key] = target[key];
        }
    });
    return result;
};

/** 深度合并:传入参数覆盖默认参数 */
export const deepAssign = (source: any, target: any) => {
    const result = Object.assign({}, source);
    const keys: any = [...Object.keys(result), Object.keys(target)];
    Object.keys(target).forEach(key => {
        if (!keys.includes(key)) {
            keys.push(key);
        }
    });
    for (const key of keys) {
        if (effectiveValue(target[key])) {
            const obj1 = result[key];
            const obj2 = target[key];
            if (Array.isArray(obj2)) {
                // 数组替换
                result[key] = obj2;
            } else if (typeof obj1 === "object" && typeof obj2 === "object") {
                // 对象继续合并
                result[key] = deepAssign(obj1, obj2);
            } else {
                result[key] = obj2;
            }
        }
    }
    return result;
};

/** 有效值合并，用于表单数据合并 */
export const meargeObject = (...objs) => {
    const result = {};
    objs.forEach(obj => {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            // undefined和null不合并
            if (value !== undefined && value !== null) {
                result[key] = value;
            }
        });
    });
    return result;
};

/** 生成uuid */
export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};

/** 遍历数据产生uuid */
export const traverseData = (data, childKey) => {
    if (data && data.length) {
        data.forEach(item => {
            item._uuid_ = uuid();
            if (childKey && item[childKey]) {
                traverseData(item[childKey], childKey);
            }
        });
    }
};

/** 获取传入的方法，叠加row参数 */
export const getEvents = (item, onName, row) => {
    const events = {};
    for (const key in item[onName]) {
        if (Object.hasOwnProperty.call(item[onName], key)) {
            const fn = item[onName][key];
            events[key] = (...args) => {
                return fn(row, ...args);
            };
        }
    }
    return events;
};

/** 递归一个对象里面的，如果是方法，使用toEventsAppendParams包装 */
export const toEventsAppendParamsDeep = (obj, row, that) => {
    const result = {};
    if (!obj) return obj;
    if (typeof obj === "string") {
        return obj;
    } else if (obj instanceof Function) {
        return _toEventsAppendParams_(obj, "", row, that);
    } else if (obj instanceof Date) {
        return obj;
    } else if (obj instanceof RegExp) {
        return obj;
    }
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value === "function") {
                result[key] = _toEventsAppendParams_(value, key, row, that);
            } else if (Array.isArray(value)) {
                if (value.length > 0) {
                    result[key] = value.map(item => {
                        return toEventsAppendParamsDeep(item, row, that);
                    });
                } else {
                    result[key] = value;
                }
            } else if (typeof value === "object") {
                result[key] = toEventsAppendParamsDeep(value, row, that);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
};

/** 给一个方法包装参数 */
export const _toEventsAppendParams_ = (func, key, row, that) => {
    if (
        !func ||
        typeof func !== "function" ||
        func.constructor.name === "Promise"
    ) {
        return func;
    }
    return (...args) => {
        if (["change"].includes(key) && that) {
            // 把特定事件抛给父组件
            that.$emit(key, ...args, row);
        }
        return func(...args, row);
    };
};

// 给事件添加荷载数据，并且给事件添加on前缀
export const toEventsAppendParams = (onEvent, loadData, on = true) => {
    const events = {};
    if ([undefined, null].includes(onEvent)) return onEvent;
    if (onEvent.constructor.name === "Function") {
        return (...args) => {
            return onEvent(...args, loadData);
        };
    } else if (onEvent.constructor.name === "Object") {
        for (const key in onEvent) {
            const fn = onEvent[key];
            if (!fn?.constructor) {
                // 不处理
                events[key] = fn;
                continue;
            }
            if (
                fn.constructor.name === "Function" ||
                fn.constructor.name === "AsyncFunction"
            ) {
                // 如果key前面没有on，添加on，并把key首字母大写
                if (!key.startsWith("on") && on) {
                    events[`on${key[0].toUpperCase()}${key.slice(1)}`] = (
                        ...args
                    ) => {
                        return fn(...args, loadData);
                    };
                } else {
                    events[key] = (...args) => {
                        return fn(...args, loadData);
                    };
                }
            } else if (fn.constructor.name === "Object") {
                events[key] = toEventsAppendParams(onEvent[key], loadData);
            } else if (fn.constructor.name === "Array") {
                // 如果是array
                events[key] = fn.map((element: any) => {
                    return toEventsAppendParams(element, loadData);
                });
            } else {
                events[key] = fn;
            }
        }
        return events;
    } else if (onEvent.constructor.name === "Array") {
        return onEvent.map((element: any) => {
            return toEventsAppendParams(element, loadData);
        });
    } else {
        return onEvent;
    }
};

/** 获取深度数据 */
export const getPathValue = (path, obj, noValue) => {
    const paths = path.split(".");
    let result = obj;
    for (const p of paths) {
        result = result[p];
    }
    return result || noValue;
};

/** 给传入的事件方法添加on前缀，并首字母大写 */
export const preprocessEventToTsx = on => {
    const onEvent = {};
    Object.keys(on).forEach(key => {
        onEvent[`on${key[0].toUpperCase()}${key.slice(1)}`] = on[key];
    });
    return onEvent;
};

/** debounce 防抖 */
export const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

/** throttle 节流 */
export const throttle = (fn, delay) => {
    let timer = null;
    return function (...args) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
};

/** 防重复提交
 * 先执行，一定时间内不允许执行了
 */
export const preventRepeat = (fn, delay) => {
    let timer = null;
    return function (...args) {
        return new Promise((resolve, reject) => {
            if (timer) {
                reject("preventRepeat drop");
            } else {
                resolve(fn.apply(this, args));
                timer = setTimeout(() => {
                    timer = null;
                }, delay);
            }
        });
    };
};

/** 判断一个对象是否vue的虚拟dom */
export const isVNode = (obj: Object) => {
    return (
        obj !== null &&
        typeof obj === "object" &&
        obj.hasOwnProperty &&
        obj.hasOwnProperty("componentOptions")
    );
};

/** 判断一个对象是否RenderCell参数对象 */
export const isRenderCell = obj => {
    // 至少有slot或者render方法
    return (
        obj !== null &&
        typeof obj === "object" &&
        (typeof obj.slot === "string" || typeof obj.render === "function")
    );
};

//直接删除object里面为空的字段，创建返回一个新的对象（不删后端枚举报错）
export const delObjectEmpty = originObj => {
    const cleanedObj = {};
    for (const [key, value] of Object.entries(originObj)) {
        if (value !== "" && value !== undefined && value !== null) {
            cleanedObj[key] = value;
        }
    }
    return cleanedObj;
};

/** 处理fn，并返回值 */
export const fnToValue = async (fn: any, loadData: object) => {
    if (["AsyncFunction", "Function"].includes(fn.constructor.name)) {
        const nv = fn(loadData);
        if (!nv) return nv;
        if (nv.constructor.name === "Promise") {
            return await nv;
        } else {
            return nv;
        }
    } else if (fn.constructor.name === "Promise") {
        return await fn;
    } else {
        return fn;
    }
};

export default {
    effectiveValue,
    deepAssign,
    meargeObject,
    deepMergeEffectiveValue,
    uuid,
    traverseData,
    getEvents,
    toEventsAppendParamsDeep,
    toEventsAppendParams,
    getPathValue,
    preprocessEventToTsx,
    debounce,
    throttle,
    preventRepeat,
    isVNode,
    isRenderCell,
    delObjectEmpty
};
