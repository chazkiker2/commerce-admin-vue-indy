<template>
    <!-- eslint-disable vue/no-v-model-argument -->
    <div class="container-fluid" style="margin-top: 10px">
        <NLayout>
            <NLayoutHeader>
                <h3>Promotion Search</h3>
            </NLayoutHeader>
            <NLayout :has-sider="hasSider">
                <NLayoutContent content-style="padding: 24px;">
                    <PromoSearchForm v-model:model-prop="model" :form="form" @submitted="submit" />
                </NLayoutContent>
                <NLayoutSider
                    :width="hasSider ? '20%' : '100%'"
                    :content-style="`${hasSider ? '' : 'padding: 24px;'} text-align: center;}`"
                >
                    <NButton tag="a" large :href="createNewPromoUrl" type="primary">
                        Create Promotion
                    </NButton>
                </NLayoutSider>
            </NLayout>
        </NLayout>
        <div v-if="isLoading">
            <div class="text-center">
                <i class="fa fa-cog fa-spin fa-2x" />
            </div>
        </div>
        <div v-else>
            <NSpace justify="center">
                <NP>
                    {{ countText }}
                </NP>
            </NSpace>
            <PromoSearchDataTable :promos="promotions" />
        </div>
    </div>
</template>

<script lang="ts">
    import { nextTick, defineComponent, PropType, toRefs, ref } from "vue";
    import {
        NButton,
        NLayout,
        NLayoutHeader,
        NLayoutContent,
        NLayoutSider,
        NSpace,
        NP,
    } from "naive-ui";

    import { SearchSolrOfferDocumentsParameters } from "@/client/api-endpoints";
    import PromoSearchForm, { FormProp } from "./PromoSearchForm.vue";
    import PromoSearchDataTable from "./PromoSearchDataTable.vue";
    import { AudienceTypeHelper } from "@/models";
    import Client from "@/client";

    interface ModelRef {
        term?: string | null;
        product?: string | null;
        premiums?: Array<string> | null;
        acquisitionPrice?: number | null;
        campaign?: number | null;
        search?: string | null;
        isActiveOnly?: boolean;
        isShowAll?: boolean;
        audienceTypes?: Array<string> | null;
    }

    export default defineComponent({
        name: "PromoSearchPage",
        components: {
            // Local Components
            PromoSearchForm,
            PromoSearchDataTable,
            // Naive UI
            NButton,
            NLayout,
            NLayoutHeader,
            NLayoutContent,
            NLayoutSider,
            NSpace,
            NP,
        },
        inject: ["mq"],
        props: {
            form: {
                type: Object as PropType<FormProp>,
                default: () => ({
                    term: "string",
                    term_choices: [[1, "one"]],
                    products: [[1, "one"]],
                    acquisition_price: 1,
                    campaign: [[1, "one"]],
                    premiums: [[1, "one"]],
                    full_search: [[1, "one"]],
                    active_only: true,
                    show_all: true,
                    audience_types: [[1, "one"]],
                }),
            },
            buyForUid: {
                type: Number as PropType<number>,
                default: () => undefined,
            },
        },
        data: function () {
            const modelRef = ref<ModelRef>({
                term: null,
                product: null,
                premiums: null,
                acquisitionPrice: null,
                campaign: null,
                search: null,
                audienceTypes: null,
                isActiveOnly: this.form.active_only ?? true,
                isShowAll: this.form.show_all ?? false,
            });
            return {
                isLoading: false,
                createNewPromoUrl: "",
                model: modelRef,
                promotions: {},
                start: 0,
                numRows: 0,
                numFound: 0,
            };
        },
        computed: {
            countText: function () {
                const start = Math.min(this.start + 1, this.numFound);
                const end = Math.min(start + this.numRows, this.numFound);
                return `Showing results ${start} - ${end} out of ${this.numFound}`;
            },
            hasSider: function () {
                return (this as any).mq.xlPlus;
            },
        },
        mounted: function () {
            this.submit();
        },
        methods: {
            submit: function () {
                this.isLoading = true;

                nextTick(() => {
                    const {
                        acquisitionPrice,
                        campaign,
                        isActiveOnly,
                        isShowAll,
                        premiums,
                        product,
                        search,
                        term,
                        audienceTypes,
                    } = toRefs(this.model);

                    const data: SearchSolrOfferDocumentsParameters = {
                        // buyForUid: this.buyForUid,
                        productName: product?.value ?? undefined,
                        searchQuery: search?.value ?? undefined,
                        premiumProductNames: premiums?.value ?? undefined,
                        acquisitionPrice: acquisitionPrice?.value ?? undefined,
                        activeOnly: isActiveOnly?.value,
                        campaignId: campaign?.value ?? undefined,
                        subscriptionTerm: term?.value ?? undefined,
                        rows: isShowAll?.value ? 500000 : 50,
                        audienceTypes:
                            audienceTypes?.value?.map(AudienceTypeHelper.fromString) ?? undefined,
                    };

                    const api = new Client();
                    api.promotions
                        .search(data)
                        .then(res => {
                            // const { createNewPromoUrl, promotions, start, numFound, numRows } = res;
                            console.log({ res });
                            const { docs, start, numFound } = res;
                            // this.createNewPromoUrl = createNewPromoUrl;
                            this.promotions = docs;
                            console.log({ docs });
                            this.start = start;
                            this.numFound = numFound;
                            // this.numRows = numRows;
                        })
                        .catch(console.error)
                        .finally(() => {
                            this.isLoading = false;
                        });
                });
            },
        },
    });
</script>

<style scoped>
    .n-layout-content {
        background-color: #a8dadc;
    }
</style>
