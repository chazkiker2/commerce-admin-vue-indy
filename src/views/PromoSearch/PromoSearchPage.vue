<script setup lang="ts">
    import { nextTick, toRefs, ref, computed, ToRefs, reactive } from "vue";
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
    import { useMq } from "vue3-mq";

    import PromoSearchDataTable from "./PromoSearchDataTable.vue";
    import { AudienceTypeHelper, SolrDoc, Promotion, AudienceType } from "@/models";
    import Client from "@/client";
    import { Routes } from "@/router/routes";

    interface Props {
        form?: FormProp;
        buyForUid?: number;
    }

    const props = withDefaults(defineProps<Props>(), {
        form: () => {
            return {
                term: "string",
                term_choices: [[1, "one"]],
                products: [[1, "one"]],
                acquisition_price: 1,
                campaign: [[1, "one"]],
                premiums: [[1, "one"]],
                full_search: "one",
                active_only: true,
                show_all: false,
                audience_types: [["1", "one"]],
            };
        },
    });

    interface ModelRef {
        term?: string | null;
        product?: string | null;
        premiums?: Array<string> | null;
        acquisitionPrice?: number | null;
        campaign?: number | null;
        search?: string | null;
        isActiveOnly?: boolean;
        isShowAll?: boolean;
        audienceTypes?: AudienceType[] | null;
    }

    const state = reactive({
        isLoading: false,
        createNewPromoUrl: "",
        model: ref<ModelRef>({
            term: null,
            product: null,
            premiums: null,
            acquisitionPrice: null,
            campaign: null,
            search: null,
            audienceTypes: null,
            isActiveOnly: props.form.active_only ?? true,
            isShowAll: props.form.show_all ?? false,
        }),
        promotions: {},
        start: 0,
        numRows: 0,
        numFound: 0,
    });

    const countText = computed(() => {
        const start_ = Math.min(state.start + 1, state.numFound);
        const end = Math.min(start_ + state.numRows, state.numFound);
        return `Showing results ${start_} - ${end} out of ${state.numFound}`;
    });
    const mq = useMq();
    const hasSider = computed(() => mq.xlPlus);

    function submit() {
        state.isLoading = true;

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
            } = toRefs(state.model) as ToRefs<ModelRef>;

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
                audienceTypes: audienceTypes?.value ?? undefined,
            };

            const api = new Client();
            api.promotions
                .search(data)
                .then(res => {
                    const { docs } = res;
                    // construct promotions
                    const promos: { [promoId: string]: SolrDoc[] } = {};

                    docs.forEach(function (doc) {
                        const promoCode = doc.promoCode;
                        if (promoCode in promos) {
                            promos[promoCode].push(doc);
                        } else {
                            promos[promoCode] = [doc];
                        }
                    });

                    const cleanedPromos = Object.fromEntries(
                        Object.entries(promos).map(([promoCode, offers]) => {
                            const firstOffer = offers[0];

                            function constructNewEntry(offer: SolrDoc): Promotion {
                                const {
                                    // promoId,
                                    // promoCode,
                                    // promoName,
                                    totalOrders,
                                    countryCode,
                                    startDate,
                                    endDate,
                                    audienceType,
                                } = offer;
                                const allPremiums: string[] = [];
                                offers.forEach(o => o.premiums.forEach(p => allPremiums.push(p)));
                                return {
                                    promoId: "1",
                                    promoCode,
                                    promoName: promoCode,
                                    totalOrders,
                                    countryCode,
                                    startDate,
                                    endDate,
                                    audienceType,
                                    offers,
                                    numberOffers: offers.length,
                                    allPremiums,
                                    promoUrl: Routes.viewPromotion(promoCode),
                                    phoneOrderUrl: Routes.viewPromotion(promoCode),
                                    orderUrl: Routes.viewPromotion(promoCode),
                                };
                            }
                            const newEntry = constructNewEntry(firstOffer);
                            return [promoCode, newEntry];
                        })
                    );
                    state.promotions = cleanedPromos;
                    state.start = res.start;
                    state.numFound = res.numFound;
                })
                .catch(console.error)
                .finally(() => {
                    state.isLoading = false;
                });
        });
    }
    submit();
</script>

<template>
    <!-- eslint-disable vue/no-v-model-argument -->
    <div class="container-fluid" style="margin-top: 10px">
        <NLayout>
            <NLayoutHeader>
                <h3>Promotion Search</h3>
            </NLayoutHeader>
            <NLayout :has-sider="hasSider">
                <NLayoutContent content-style="padding: 24px;">
                    <PromoSearchForm
                        v-model:model-prop="state.model"
                        :form="form"
                        @submitted="submit"
                    />
                </NLayoutContent>
                <NLayoutSider
                    :width="hasSider ? '20%' : '100%'"
                    :content-style="`${hasSider ? '' : 'padding: 24px;'} text-align: center;}`"
                >
                    <NButton tag="a" large :href="state.createNewPromoUrl" type="primary">
                        Create Promotion
                    </NButton>
                </NLayoutSider>
            </NLayout>
        </NLayout>
        <div v-if="state.isLoading">
            <div class="text-center">
                Loading!
                <i class="fa fa-cog fa-spin fa-2x" />
            </div>
        </div>
        <div v-else>
            <NSpace justify="center">
                <NP>
                    {{ countText }}
                </NP>
            </NSpace>
            <PromoSearchDataTable :promos="state.promotions" />
        </div>
    </div>
</template>

<style scoped>
    .n-layout-content {
        background-color: #a8dadc;
    }
</style>
