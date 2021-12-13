export { Forecast } from "./forecast";
export { SolrDoc } from "./solr-offer-document";

export enum CountryCode {
    US = "US",
    UK = "UK",
}

export class CountryCodeHelper {
    static fromString(countryCode: "US" | "UK"): CountryCode {
        return {
            US: CountryCode.US,
            UK: CountryCode.UK,
        }[countryCode];
    }
}

export enum AudienceType {
    NewMember = 1,
    Retention = 2,
    Acquisition = 3,
}

export class AudienceTypeHelper {
    static fromId(id: 1 | 2 | 3): AudienceType {
        return {
            [AudienceType.NewMember]: AudienceType.NewMember,
            [AudienceType.Retention]: AudienceType.Retention,
            [AudienceType.Acquisition]: AudienceType.Acquisition,
        }[id];
    }
}
