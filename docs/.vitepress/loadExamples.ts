import { defineAsyncComponent } from 'vue';
// @ts-ignore
export const components = import.meta.glob('../examples/*/*.vue');
export default {
    install({app}) {
        for (const path in components) {
            const paths = path.split('/')
            // @ts-ignore
            const filename = paths.pop().replace('.vue', '');
            const componentName = 'ep-' + paths.pop() + '-' + filename;
            app.component(componentName, defineAsyncComponent(components[path]));
        }
    }
};