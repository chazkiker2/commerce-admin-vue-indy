import {
    GetPremiumsParameters,
    getProductOffers,
    GetProductOffersParameters,
    listPromotions,
    ListPromotionsParameters,
    ListPromotionsResponse,
    SearchSolrDocsResponse,
    SearchSolrOfferDocumentsParameters,
} from "./api-endpoints";
import { Controllers } from "@/constants";
import { pick } from "./helpers";
import { deserialize } from "typescript-json-serializer";
import axios from "axios";
import { AudienceType, ProductOffer, SubscriptionProductOffer } from "@/models";
import { Campaign } from "@/models/campaign";

const { API_GATEWAY_KEY, API_GATEWAY_URL } = (window as any).env;

const commerceAxios = axios.create({
    baseURL: `${API_GATEWAY_URL}commerce/`,
    headers: {
        // "Access-Control-Allow-Origin": "*",
        accept: "application/json",
        "x-apikey": API_GATEWAY_KEY,
    },
});
const mmsAxios = axios.create({
    baseURL: `${API_GATEWAY_URL}mms/api/`,
    headers: {
        accept: "application/json",
        "x-apikey": API_GATEWAY_KEY,
    },
});

type Method = "get" | "post" | "patch" | "delete";
type QueryParams = Record<string, unknown> | URLSearchParams;

export interface RequestParameters {
    path: string;
    method: Method;
    query?: QueryParams;
    body?: Record<string, unknown>;
    auth?: string;
}

class SearchParams {
    items: Record<string, string>;
    constructor() {
        this.items = {};
    }
    append(key: string, value: string) {
        this.items[key] = value;
    }
    toString() {
        const entries = Object.entries(this.items);
        if (entries.length === 0) {
            return "";
        }
        return `?${entries.map(([k, v]) => `${k}=${v}`).join("&")}`;
    }
}

class CommerceAdminUrl {
    path: string;
    searchParams: SearchParams;

    constructor(path: string) {
        this.path = path;
        this.searchParams = new SearchParams();
    }

    toString() {
        const queryString = this.searchParams.toString();
        return `${this.path}${queryString}`;
    }
}

class Client {
    public async request<ResponseBody>(requestParams: RequestParameters): Promise<ResponseBody> {
        try {
            const res = await commerceAxios.request<ResponseBody>({
                method: requestParams.method,
                url: requestParams.path,
                params: requestParams.query,
            });
            return Promise.resolve(res.data);
        } catch (err: unknown) {
            throw err;
        }
    }

    public async requestWithSerialize<T>(
        requestParams: RequestParameters,
        t: new (...args: any[]) => T
    ): Promise<T> {
        try {
            const data = await this.request(requestParams);
            return deserialize<T>(data, t);
        } catch (err: unknown) {
            throw err;
        }
    }

    public async requestWithSerializeList<T>(
        requestParams: RequestParameters,
        t: new (...args: any[]) => T
    ): Promise<T[]> {
        try {
            const data = await this.request<any[]>(requestParams);
            return data.map((x: any) => deserialize<T>(x, t));
        } catch (err: unknown) {
            throw err;
        }
    }

    public readonly offers = {
        get: (args: GetProductOffersParameters): Promise<ProductOffer[]> => {
            return new Promise((resolve, reject) => {
                commerceAxios
                    .get(getProductOffers.path(), { params: args })
                    .then(({ data }) => {
                        const serialized = data.map((item: any) => {
                            if ("subscriptionPeriod" in data) {
                                return deserialize<SubscriptionProductOffer>(
                                    item,
                                    SubscriptionProductOffer
                                );
                            }
                            return deserialize<ProductOffer>(item, ProductOffer);
                        });
                        resolve(serialized);
                    })
                    .catch(reject);
            });
        },

        premiums: {
            get: (args: GetPremiumsParameters): Promise<ProductOffer[]> => {
                return new Promise((resolve, reject) => {
                    commerceAxios
                        .get(`${Controllers.Offers}/premiums`, { params: args })
                        .then(({ data }) => {
                            const serialized = data.map((item: any) => {
                                return deserialize<ProductOffer>(item, ProductOffer);
                            });
                            resolve(serialized);
                        })
                        .catch(reject);
                });
            },
        },
    };

    public readonly promotions = {
        search: (
            args: SearchSolrOfferDocumentsParameters = {}
        ): Promise<SearchSolrDocsResponse> => {
            const params = {
                ...args,
                audienceTypes: args.audienceTypes?.map(a => AudienceType[a]),
            };
            console.log({ params });

            return new Promise((resolve, reject) => {
                commerceAxios
                    .get("v1/promotions/search", {
                        params,
                    })
                    .then(res => {
                        const d = deserialize<SearchSolrDocsResponse>(
                            res.data,
                            SearchSolrDocsResponse
                        );
                        resolve(d);
                    })
                    .catch(reject);
            });
        },
        list: (args: ListPromotionsParameters): Promise<ListPromotionsResponse> => {
            const requestParams: RequestParameters = {
                path: `${Controllers.ClientPromotions}`,
                method: "get",
                query: pick(args, listPromotions.queryParams),
                body: pick(args, listPromotions.bodyParams),
            };
            const res = this.requestWithSerialize<ListPromotionsResponse>(
                requestParams,
                ListPromotionsResponse
            );
            return res;
        },
        httpSearch: (
            args: SearchSolrOfferDocumentsParameters = {}
        ): Promise<SearchSolrDocsResponse> => {
            return new Promise((resolve, reject) => {
                commerceAxios
                    .get("v1/promotions/search", { params: args })
                    .then(res => {
                        const d = deserialize<SearchSolrDocsResponse>(
                            res.data,
                            SearchSolrDocsResponse
                        );
                        resolve(d);
                    })
                    .catch(reject);
            });
        },
    };

    public readonly campaigns = {
        get(): Promise<any> {
            return new Promise((resolve, reject) => {
                mmsAxios
                    .get("campaign-list/")
                    .then(res => {
                        const deserialized = res.data.map((d: any) =>
                            deserialize<Campaign>(d, Campaign)
                        );
                        resolve(deserialized);
                    })
                    .catch(reject);
            });
        },
    };
}

export default Client;
