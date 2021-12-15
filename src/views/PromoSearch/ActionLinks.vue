<script setup lang="ts">
    import { NSpace, NButton } from "naive-ui";

    interface Link {
        label: string;
        href: string;
    }

    defineProps<{
        links: Link[];
    }>();
</script>

<template>
    <NSpace justify="center">
        <NButton v-for="link in links" :key="link.href" tag="a" :href="link.href">
            {{ link.label }}
        </NButton>
    </NSpace>
</template>
