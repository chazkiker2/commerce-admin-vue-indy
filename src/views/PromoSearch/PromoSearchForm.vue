<script lang="ts">
    import { defineComponent } from "vue";
    // eslint-disable-next-line vue/one-component-per-file
    export default defineComponent({
        name: "PromoSearchForm",
        inheritAttrs: true,
    });
</script>

<script setup lang="ts">
    import { ref, reactive, toRefs } from "vue";
    import { NCheckbox, NInput, NInputNumber, NSelect, NForm, NGrid, NFormItemGi } from "naive-ui";
    import Client from "@/client";
    import { AudienceType, CountryCode, ProductOffer, SubscriptionProductOffer } from "@/models";

    export interface FormProp {
        term: string;
        term_choices: Array<[number, string]>;
        products: Array<[number, string]>;
        acquisition_price: number;
        campaign: Array<[number, string]>;
        premiums: Array<[number, string]>;
        full_search: string;
        active_only: boolean;
        show_all: boolean;
        audience_types: Array<[string, string]>;
    }

    interface Props {
        modelProp: any;
        form: FormProp;
        countryCode?: CountryCode;
    }
    const props = withDefaults(defineProps<Props>(), {
        countryCode: CountryCode.US,
    });

    const currencySymbol = props.countryCode
        ? { US: "$", GB: "£", UK: "£" }[props.countryCode]
        : "$";

    const formRef = ref(null);

    const { modelProp: model } = toRefs(props);

    const client = new Client();

    const isLoading = ref(false);

    type Option = { value: number | string; label: string };
    interface Options {
        [key: string]: Option[];
    }

    const options = reactive<Options>({
        products: [],
        terms: [],
        premiums: [],
        campaigns: [],
        audienceTypes: [
            { value: AudienceType.Acquisition, label: "Acquisition" },
            { value: AudienceType.NewMember, label: "New Member" },
            { value: AudienceType.Retention, label: "Retention" },
        ],
    });

    function filterUnique<T>(arr: T[], hasherFn: (t: T) => string | number): T[] {
        const cache = Object.create(null);
        return arr.filter(item => {
            const hash = hasherFn(item);
            if (!cache[hash]) {
                cache[hash] = true;
                return true;
            }
            return false;
        });
    }

    function filterProductOffers(arr: ProductOffer[]) {
        return filterUnique<ProductOffer>(arr, po => po.product.id);
    }

    async function getProductOptions() {
        const offers = filterProductOffers(
            await client.offers.get({
                countryCode: CountryCode.US,
            })
        );

        const subscriptionOffers: SubscriptionProductOffer[] = offers.filter(
            offer => offer.subscriptionPeriod
        ) as SubscriptionProductOffer[];

        options.products = offers.map(({ product }) => ({
            value: product.id,
            label: product.name,
        }));
        options.terms = filterUnique<SubscriptionProductOffer>(
            subscriptionOffers as SubscriptionProductOffer[],
            po => po.subscriptionPeriod.id
        ).map((po: SubscriptionProductOffer) => ({
            value: po.subscriptionPeriod.id,
            label: po.subscriptionPeriod.name,
        }));
    }

    async function getPremiumOptions() {
        const res = await client.offers.premiums.get({ countryCode: CountryCode.US });
        const premiums = filterProductOffers(res).map(({ product }) => ({
            value: product.id,
            label: product.name,
        }));
        options.premiums = premiums;
    }

    async function getCampaignOptions() {
        const res = await client.campaigns.get();
        const campaigns = res.map((c: any) => ({ value: c.id, label: c.name }));
        options.campaigns = campaigns;
    }

    function populateOptions() {
        isLoading.value = true;
        Promise.all([getProductOptions(), getPremiumOptions(), getCampaignOptions()]).finally(
            () => {
                isLoading.value = false;
            }
        );
    }
    populateOptions();

    const emit = defineEmits(["submitted"]);

    function submit() {
        emit("submitted");
    }
</script>

<template>
    <!-- eslint-disable vue/no-v-model-argument -->
    <NForm ref="formRef" :v-if="!isLoading" :model="model" @submit="submit" @update="submit">
        <NGrid :span="24" :x-gap="24">
            <!-- PRODUCT -->
            <NFormItemGi :span="8" path="product" label="Product">
                <!-- remote -->
                <NSelect
                    v-model:value="model.product"
                    :options="options.products"
                    :loading="isLoading"
                    filterable
                    clearable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- TERM -->
            <NFormItemGi :span="8" path="term" label="Term">
                <NSelect
                    v-model:value="model.term"
                    :options="options.terms"
                    :loading="isLoading"
                    clearable
                    filterable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- PRICE -->
            <NFormItemGi :span="8" path="acquisitionPrice" label="Price">
                <NInputNumber
                    v-model:value="model.acquisitionPrice"
                    clearable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- CAMPAIGN -->
            <NFormItemGi :span="8" path="campaign" label="Campaign">
                <!-- :on-update:value="submit" -->
                <NSelect
                    v-model:value="model.campaign"
                    :options="options.campaigns"
                    :loading="isLoading"
                    filterable
                    clearable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- PREMIUMS -->
            <NFormItemGi :span="8" path="premiums" label="Premium">
                <!-- placeholder="You may add multiple reports." -->
                <NSelect
                    v-model:value="model.premiums"
                    :options="options.premiums"
                    :loading="isLoading"
                    filterable
                    multiple
                    clearable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- AUDIENCE TYPES -->
            <NFormItemGi :span="8" path="audienceTypes" label="Audience Type">
                <NSelect
                    v-model:value="model.audienceTypes"
                    :options="options.audienceTypes"
                    filterable
                    multiple
                    clearable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- SEARCH -->
            <NFormItemGi :span="16" path="search" label="Search">
                <NInput
                    v-model:value="model.search"
                    type="text"
                    autocomplete="off"
                    placeholder="Keywords or promo code..."
                    clearable
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- ACTIVE ONLY -->
            <NFormItemGi :span="4" path="isActiveOnly">
                <NCheckbox v-model:checked="model.isActiveOnly" @update:checked="submit">
                    Active only?
                </NCheckbox>
            </NFormItemGi>

            <!-- SHOW ALL -->
            <NFormItemGi :span="4" path="isShowAll">
                <NCheckbox v-model:checked="model.isShowAll" @update:checked="submit">
                    Show all?
                </NCheckbox>
            </NFormItemGi>
        </NGrid>
    </NForm>
</template>
