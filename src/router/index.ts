import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HelloRoute from "../components/HelloRoute.vue";
import Routes from "./routes";

const routes: Array<RouteRecordRaw> = [
    {
        path: Routes.home,
        name: "Home",
        component: HelloRoute,
    },
    {
        path: Routes.helloWorld,
        name: "hello-world",
        component: () => import("../components/HelloWorld.vue"),
    },
    { path: "/:pathMatch(.*)", component: import("../components/NotFound.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
