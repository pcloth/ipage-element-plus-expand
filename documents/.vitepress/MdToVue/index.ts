import vpDemo from "./vp-demo.vue";
import vpSourceCode from "./vp-source-code.vue";
import vpApiTyping from "./vp-api-typing.vue";

export default {
  intall({ app }) {
    app.component("Demo", vpDemo);
    app.component("vp-source-code", vpSourceCode);
    app.component("api-typing", vpApiTyping);
  },
};