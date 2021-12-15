import { createApp } from "vue";
import { Vue3Mq } from "vue3-mq";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";

const app = createApp(App);

app.use(Vue3Mq);

app.use(store);

app.use(VueAxios, axios);

app.use(router);

app.mount("#app");
