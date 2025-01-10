import vpDemo from "./vp-demo.vue";
import vpSourceCode from "./vp-source-code.vue";

export default {
  intall({ app }) {
    app.component("Demo", vpDemo);
    app.component("vp-source-code", vpSourceCode);
  },
};