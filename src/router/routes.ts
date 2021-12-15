import { RouteRecordRaw } from "vue-router";
import HelloRoute from "@/views/Home.vue";
import PromoSearch from "@/views/PromoSearch/PromoSearchPage.vue";

export class Routes {
    static home = "/";
    static helloWorld = "/hello-world";
    static promoSearch = "/search";
    static viewPromotion = (promoCode: string): string => `promo/${promoCode}`;
}

export const routes: Array<RouteRecordRaw> = [
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
    {
        path: Routes.promoSearch,
        name: "PromoSearch",
        component: PromoSearch,
    },
    { path: "/:pathMatch(.*)", component: import("../components/NotFound.vue") },
];
