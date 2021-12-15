import { SolrDoc } from ".";
import { AudienceType, CountryCode } from "./enums";

export interface Promotion {
    allPremiums: string[];
    audienceType: AudienceType;
    countryCode: CountryCode;
    startDate: Date;
    endDate?: Date;
    numberOffers: number;
    offers: SolrDoc[];
    promoCode: string;
    orderUrl: string;
    phoneOrderUrl: string;
    promoId: string;
    promoName: string;
    promoUrl: string;
    totalOrders: number;
}
