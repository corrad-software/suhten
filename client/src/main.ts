import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useUiThemeStore } from "@/stores/uiTheme";
import { useStSessionStore } from "@/st/stores/session";
import { useStWorkflowStore } from "@/st/stores/workflow";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
useUiThemeStore(pinia).initFromStorage();
// Boot the ST (Suruhanjaya Tenaga) D11 prototype: restore the demo session +
// seed/restore the workflow state before the router resolves the first route.
useStWorkflowStore(pinia).init();
useStSessionStore(pinia).restore();
app.use(router);
app.mount("#app");
