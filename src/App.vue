<script setup lang="ts">
    import "reflect-metadata";
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
    import { RouterView } from "vue-router";
    import RouterMenu from "./components/RouterMenu.vue";
    import { NSpace } from "naive-ui";
    import ForecastDataTable from "./components/ForecastDataTable.vue";

    const routePairs = [
        ["/", "Go to Home"],
        ["/hello-world", "Go to About"],
    ];
</script>

<template>
    <NSpace vertical class="app-wrapper">
        <NSpace vertical>
            <img alt="Vue logo" src="/logo.png" />
            <RouterMenu :route-pairs="routePairs" />
        </NSpace>

        <RouterView />

        <ForecastDataTable />
    </NSpace>
</template>

<style scoped>
    .n-space.app-wrapper {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
