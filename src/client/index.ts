import {
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

const { API_GATEWAY_KEY, API_GATEWAY_URL } = (window as any).env;

const commerceAxios = axios.create({
    baseURL: `${API_GATEWAY_URL}commerce/`,
    headers: {
        // "Access-Control-Allow-Origin": "*",
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
    private async _request({ path, method, query, body }: RequestParameters): Promise<string> {
        const bodyAsJsonString =
            !body || Object.entries(body).length === 0 ? undefined : JSON.stringify(body);
        const url = new CommerceAdminUrl(path);
        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            }
        }
        const headers: Record<string, string> = {};
        if (bodyAsJsonString !== undefined) {
            headers["content-type"] = "application/json";
        }
        try {
            const response = await fetch(url.toString(), {
                method,
                headers,
                body: bodyAsJsonString,
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw Error(responseText);
            }

            return Promise.resolve(responseText);
        } catch (error: unknown) {
            throw error;
        }
    }
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

    public readonly promotions = {
        search: (
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
}

export default Client;
