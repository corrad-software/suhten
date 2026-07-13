import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useUiThemeStore } from "@/stores/uiTheme";
import { startStDevBridge } from "@/st/dev/dev-bridge";
import { useStWorkflowStore } from "@/st/stores/workflow";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
useUiThemeStore(pinia).initFromStorage();
// Boot the ST (Suruhanjaya Tenaga) D11 prototype: restore the demo session +
// seed/restore the workflow state before the router resolves the first route.
useStWorkflowStore(pinia).init();
startStDevBridge();
app.use(router);
app.mount("#app");
