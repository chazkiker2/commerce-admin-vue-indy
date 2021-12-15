<template>
    <NSpace justify="center">
        <NButton
            v-for="link in links"
            :key="link.href"
            tag="a"
            :href="link.href"
        >
            {{ link.label }}
        </NButton>
    </NSpace>
</template>

<script lang="ts">
    import { defineComponent, PropType, } from "vue";
    import { NSpace, NButton, } from "naive-ui";

    interface Link {
        label: string,
        href: string,
    }

    export default defineComponent({
        name: "ActionLinks",
        components: {
            NSpace,
            NButton,
        },
        props: {
            links: {
                type: Object as PropType<Link[]>,
                required: true,
            }
        },

    })

</script>
