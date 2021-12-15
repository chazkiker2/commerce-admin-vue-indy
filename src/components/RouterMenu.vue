<script setup lang="ts">
    import { h } from "vue";
    import { RouterLink } from "vue-router";
    import { NMenu } from "naive-ui";
    import { MenuMixedOption } from "naive-ui/lib/menu/src/interface";

    const props = defineProps<{
        routePairs: string[][];
    }>();

    const makeMenuOption = (route: string, displayText: string) => ({
        label: () =>
            h(
                RouterLink,
                {
                    to: route,
                },
                {
                    default: () => displayText,
                }
            ),
        key: route,
    });

    const menuOptions: MenuMixedOption[] = props.routePairs.map(([route, displayText]) =>
        makeMenuOption(route, displayText)
    );
</script>

<template>
    <NMenu mode="horizontal" :options="menuOptions" />
</template>
