<script setup lang="ts">
    import { h, ref } from "vue";
    import { NSpace, NDataTable, NLi, NButton, NText } from "naive-ui";
    import ActionLinks from "./ActionLinks.vue";
    import { TableColumns } from "naive-ui/lib/data-table/src/interface";
    import { AudienceType, Promotion } from "@/models";

    const columnsRaw: TableColumns<PromoData> = [
        {
            title: "Start",
            key: "startDate",
            sorter: "default",
            width: 80,
            render(row: PromoData) {
                return h(NText, null, {
                    default: () => row.startDate.toString(),
                });
            },
        },
        {
            title: "Promotion",
            key: "promoName",
            sorter: "default",
            width: 220,
            render({ promoUrl, promoName, promoId }: PromoData) {
                const promoNameLink = h(
                    NButton,
                    {
                        tag: "a",
                        text: true,
                        block: false,
                        type: "info",
                        href: promoUrl,
                        style: "white-space: normal;",
                    },
                    {
                        default: () => promoName,
                    }
                );
                return h(
                    NSpace,
                    {
                        vertical: true,
                    },
                    {
                        default: () => [promoNameLink, `ID: ${promoId}`],
                    }
                );
            },
        },
        {
            title: "Offers",
            key: "productName",
            sorter: "default",
            width: 160,
        },
        {
            title: "Term",
            key: "subscriptionTerm",
            sorter: "default",
            width: 80,
        },
        {
            title: "Price",
            key: "acquisitionPrice",
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
            render({ premiums }: PromoData) {
                const premiumItems =
                    premiums?.map(premium => h(NLi, {}, { default: () => premium })) ?? [];
                return premiumItems.length > 0 ? premiumItems : "None";
            },
        },
        {
            title: "Audience Type",
            key: "audienceType",
            width: 100,
            sorter: "default",
        },
        {
            title: "Total Orders",
            key: "totalOrders",
            width: 50,
            sorter: "default",
        },
        {
            title: "Buy",
            key: "orderUrl",
            width: 120,
            render({ phoneOrderUrl, orderUrl }: PromoData) {
                const links = [
                    { label: "Order", href: phoneOrderUrl },
                    { label: "External", href: orderUrl },
                ];
                return h(ActionLinks, { links });
            },
        },
    ];

    interface PromoData {
        key: number;
        startDate: string;
        audienceType: string;
        premiums: Array<string>;
        promoId: string;
        promoName: string;
        promoUrl: string;
        orderUrl: string;
        phoneOrderUrl: string;
        totalOrders: number;
        productName: string;
        acquisitionPrice: string | number;
        subscriptionTerm: string;
    }

    function mapPromoToData(promo: Promotion, index: number): PromoData {
        const firstOffer = promo.offers.length > 0 ? promo.offers[0] : null;
        const {
            startDate,
            promoName,
            allPremiums,
            totalOrders,
            promoId,
            promoUrl,
            orderUrl,
            phoneOrderUrl,
            audienceType,
        } = promo;
        return {
            key: index,
            startDate: startDate.toDateString(),
            promoName,
            premiums: allPremiums,
            audienceType: AudienceType[audienceType],
            totalOrders,
            promoId,
            promoUrl,
            orderUrl,
            phoneOrderUrl,
            productName: firstOffer?.productName ?? "Unknown",
            acquisitionPrice: firstOffer?.acquisitionPrice ?? "Unknown",
            subscriptionTerm: firstOffer?.subscriptionTerm ?? "None",
        };
    }

    const props = withDefaults(
        defineProps<{
            promos: { [promoCode: string]: Promotion };
        }>(),
        {
            promos: () => ({}),
        }
    );

    const data = Object.values(props.promos).map((promo, index) => mapPromoToData(promo, index));
    const pagination = { pageSize: 50 };
    const columns = ref(columnsRaw);
</script>

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
