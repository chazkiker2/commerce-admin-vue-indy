<template>
    <NSpace vertical>
        <NDataTable
            ref="columnsRef"
            :columns="columns"
            :data="data"
            :pagination="pagination"
            :single-line="false"
        />
    </NSpace>
</template>

<script lang="ts">
    import { h, defineComponent, ref } from "vue";
    import { NSpace, NDataTable, NLi, NButton } from "naive-ui";
    import { Promotion } from "@/types";
    import ActionLinks from "./ActionLinks.vue";

    const columns = [
        {
            title: "Start",
            key: "start_date",
            sorter: "default",
            width: 80,
        },
        {
            title: "Promotion",
            key: "promo_name",
            sorter: "default",
            width: 220,
            render(row: PromoData) {
                const promoNameLink = h(
                    NButton,
                    {
                        tag: "a",
                        text: true,
                        block: false,
                        type: "info",
                        href: row.promo_url,
                        style: "white-space: normal;",
                    },
                    {
                        default: () => row.promo_name,
                    }
                );
                return h(
                    NSpace,
                    {
                        vertical: true,
                    },
                    {
                        default: () => [promoNameLink, `ID: ${row.promo_id}`],
                    }
                );
            },
        },
        {
            title: "Offers",
            key: "product_name",
            sorter: "default",
            width: 160,
            render(row: PromoData) {
                return h("span", `${row.product_name} (${row.subscription_term})`);
            },
        },
        {
            title: "Price",
            key: "acquisition_price",
            width: 100,
            sorter: "default",
        },
        {
            title: "Premiums",
            key: "premiums",
            width: 200,
            ellipsis: {
                tooltip: true,
            },
            render(row: PromoData) {
                const premiums =
                    row.premiums?.map(premium => h(NLi, {}, { default: () => premium })) ?? [];
                return premiums.length > 0 ? premiums : "None";
            },
        },
        {
            title: "Audience Type",
            key: "audience_type",
            width: 100,
            sorter: "default",
        },
        {
            title: "Total Orders",
            key: "total_orders",
            width: 50,
            sorter: "default",
        },
        {
            title: "Buy",
            key: "order_url",
            width: 120,
            render(row: PromoData) {
                const links = [
                    { label: "Order", href: row.phone_order_url },
                    { label: "External", href: row.order_url },
                ];
                return h(ActionLinks, { links });
            },
        },
    ];

    interface PromoData {
        key: number;
        start_date: string;
        audience_type: string;
        premiums: Array<string>;
        promo_id: string;
        promo_name: string;
        promo_url: string;
        order_url: string;
        phone_order_url: string;
        total_orders: number;
        product_name: string;
        acquisition_price: string | number;
        subscription_term: string;
    }

    function mapPromoToData(promo: Promotion, index: number): PromoData {
        const firstOffer = promo.offers?.length > 0 ? promo.offers[0] : null;
        return {
            key: index,
            start_date: promo.start_date,
            promo_name: promo.promo_name,
            product_name: firstOffer?.product_name ?? "Unknown",
            acquisition_price: firstOffer?.acquisition_price ?? "Unknown",
            premiums: promo.all_premiums,
            audience_type: promo.audience_type,
            total_orders: promo.total_orders,
            promo_id: promo.promo_id,
            promo_url: promo.promo_url,
            order_url: promo.order_url,
            phone_order_url: promo.phone_order_url,
            subscription_term: firstOffer?.subscription_term ?? "",
        };
    }

    export default defineComponent({
        name: "PromoSearchDataTable",
        components: {
            NSpace,
            NDataTable,
        },
        props: {
            promos: {
                type: Object,
                default: () => ({}),
            },
        },
        data: function () {
            const columnsRef = ref(columns);
            const promos = Object.values(this.promos);
            console.log({ promos, originalPromos: this.promos });
            return {
                data: Object.values(this.promos).map(mapPromoToData),
                columns: columnsRef,
                pagination: { pageSize: 50 },
            };
        },
    });
</script>
