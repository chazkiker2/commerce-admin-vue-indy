import { Controllers, Endpoints } from "@/constants";
import {
    AudienceType,
    CountryCode,
    Currency,
    ProductOffer,
    ProductOfferType,
    TimePeriod,
} from "@/models";
import { JsonProperty, Serializable } from "typescript-json-serializer";
import { SolrDoc } from "@/models";

type SearchSolrOfferDocumentsQueryParameters = {
    searchQuery?: string;
    countryCode?: CountryCode;
    rows?: number;
    startRow?: number;
    activeOnly?: boolean;
    premiumProductNames?: string[];
    productName?: string;
    subscriptionTerm?: string;
    acquisitionPrice?: number;
    campaignId?: number;
    audienceTypes?: AudienceType[];
};

export type SearchSolrOfferDocumentsParameters = SearchSolrOfferDocumentsQueryParameters;

@Serializable()
export class SearchSolrDocsResponse {
    @JsonProperty()
    numFound!: number;
    @JsonProperty()
    end!: number;
    @JsonProperty()
    start!: number;
    @JsonProperty({ type: SolrDoc })
    docs!: SolrDoc[];
}

export const searchSolrOfferDocuments = {
    method: "get",
    pathParams: [],
    queryParams: [
        "searchQuery",
        "countryCode",
        "rows",
        "startRow",
        "activeOnly",
        "premiumProductNames",
        "productName",
        "subscriptionTerm",
        "acquisitionPrice",
        "campaignId",
        "audienceTypes",
    ],
    bodyParams: [],
    path: (): string => `${Controllers.Promotions}/search`,
} as const;

export type ListPromotionsQueryParameters = {
    name?: string;
    limit?: number;
    offset?: number;
};

export type ListPromotionsParameters = ListPromotionsQueryParameters;

@Serializable()
export class Offer {
    @JsonProperty()
    type!: "subscription";
    @JsonProperty()
    trialOffer!: null;
    @JsonProperty()
    subscriptionPeriod!: TimePeriod;
    @JsonProperty()
    moneyBackGuaranteePeriod!: TimePeriod;
    @JsonProperty()
    swapGuaranteePeriod!: TimePeriod | null;
    @JsonProperty()
    renewalRefundPeriod!: TimePeriod;
    @JsonProperty()
    printDelivery!: boolean;
    @JsonProperty()
    renewalPrice!: Currency;
    @JsonProperty()
    id!: number;
    @JsonProperty()
    name?: string;
    @JsonProperty()
    product: unknown;
}

@Serializable()
export class PromotionListEntry {
    @JsonProperty()
    id?: number;
    @JsonProperty()
    code!: string;
    @JsonProperty()
    startDate!: Date;
    @JsonProperty()
    subscriptionPeriod!: TimePeriod;
    @JsonProperty()
    moneyBackGuaranteePeriod!: TimePeriod;
    @JsonProperty()
    renewalRefundPeriod!: TimePeriod;
    @JsonProperty()
    printDelivery!: boolean;
    @JsonProperty()
    renewalPrice!: Currency;
    @JsonProperty()
    totalOrders!: number;
    @JsonProperty()
    tags!: unknown[] | null;
    @JsonProperty()
    modifiedByUid!: number;
    @JsonProperty()
    modifiedDate!: string;
    @JsonProperty()
    createdByUid!: number;
    @JsonProperty()
    countryCode!: string;
    @JsonProperty()
    name?: string;
    @JsonProperty()
    description!: string;
    @JsonProperty()
    endDate!: string;
    @JsonProperty()
    redirectSettings: unknown | null;
    @JsonProperty()
    campaignId!: number;
    @JsonProperty()
    audienceType!: number | null;
    @JsonProperty({ type: Offer })
    offers!: Offer[];
}

@Serializable()
export class ListPromotionsResponse {
    @JsonProperty()
    offset!: number | null;
    @JsonProperty()
    limit!: number | null;
    @JsonProperty()
    totalResults!: number;
    @JsonProperty({ type: PromotionListEntry })
    results!: PromotionListEntry[];
}

export const listPromotions = {
    method: "get",
    pathParams: [],
    queryParams: ["name", "limit", "offset"],
    bodyParams: [],
    path: (): string => `${Controllers.ClientPromotions}/list`,
} as const;

export type GetProductOffersQueryParameters = {
    countryCode?: CountryCode;
    productOfferType?: ProductOfferType;
};

export type GetProductOffersParameters = GetProductOffersQueryParameters;

@Serializable()
export class GetProductOffersResponseItem extends ProductOffer {}

export const getProductOffers = {
    method: "get",
    pathParams: [],
    queryParams: ["countryCode", "productOfferType"],
    bodyParams: [],
    path: (): string => Endpoints.offers.get,
} as const;

export type GetPremiumsQueryParams = {
    countryCode?: CountryCode;
};

export type GetPremiumsParameters = GetPremiumsQueryParams;

export const getPremiums = {
    method: "get",
    pathParams: [],
    queryParams: ["countryCode"],
    bodyParams: [],
} as const;
