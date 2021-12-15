<template>
    <!-- eslint-disable vue/no-v-model-argument -->
    <NForm ref="formRef" :model="model" @submit="submit" @update="submit">
        <NGrid :span="24" :x-gap="24">
            <!-- PRODUCT -->
            <NFormItemGi :span="8" path="product" label="Product">
                <NSelect
                    v-model:value="model.product"
                    filterable
                    clearable
                    :options="products"
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- TERM -->
            <NFormItemGi :span="8" path="term" label="Term">
                <NSelect
                    v-model:value="model.term"
                    clearable
                    filterable
                    :options="terms"
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
                    filterable
                    clearable
                    :options="campaigns"
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- PREMIUMS -->
            <NFormItemGi :span="8" path="premiums" label="Premium">
                <!-- placeholder="You may add multiple reports." -->
                <NSelect
                    v-model:value="model.premiums"
                    filterable
                    multiple
                    clearable
                    :options="premiums"
                    @update:value="submit"
                />
            </NFormItemGi>

            <!-- AUDIENCE TYPES -->
            <NFormItemGi :span="8" path="audienceTypes" label="Audience Type">
                <NSelect
                    v-model:value="model.audienceTypes"
                    filterable
                    multiple
                    clearable
                    :options="audienceTypes"
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

<script lang="ts">
    import { PropType, defineComponent, ref } from "vue";
    import { NCheckbox, NInput, NInputNumber, NSelect, NForm, NGrid, NFormItemGi } from "naive-ui";

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

    type CountryCode = "US" | "GB" | "UK" | undefined;

    export default defineComponent({
        name: "PromoSearchForm",
        components: {
            NCheckbox,
            NInput,
            NSelect,
            NForm,
            NGrid,
            NFormItemGi,
            NInputNumber,
        },
        inheritAttrs: true,
        props: {
            modelProp: {
                type: Object,
                required: true,
            },
            form: {
                type: Object as PropType<FormProp>,
                required: true,
            },
            countryCode: {
                type: String as PropType<CountryCode>,
                default: () => "US",
            },
        },
        data: function () {
            const currencySymbol = this.countryCode
                ? { US: "$", GB: "£", UK: "£" }[this.countryCode]
                : "$";

            const formRef = ref(null);

            function mapToSelectOptions([id, name]: [number | string, string]) {
                return { value: id, label: name };
            }

            function mapNameToSelectOptions([, name]: [number | string, string]) {
                return { value: name, label: name };
            }

            return {
                formRef,
                model: this.modelProp,
                acquisitionPrice: this.form.acquisition_price,
                terms: this.form.term_choices.map(mapNameToSelectOptions),
                products: this.form.products.map(mapToSelectOptions),
                premiums: this.form.premiums.map(mapNameToSelectOptions),
                campaigns: this.form.campaign.map(mapToSelectOptions),
                audienceTypes: this.form.audience_types.map(mapToSelectOptions),
                currencySymbol,
            };
        },
        methods: {
            submit: function () {
                this.$emit("submitted");
            },
        },
    });
</script>
