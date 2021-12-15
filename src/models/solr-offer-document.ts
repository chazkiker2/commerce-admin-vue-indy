import "reflect-metadata";
import { AudienceType, AudienceTypeHelper, CountryCode, CountryCodeHelper } from ".";
import { Serializable, JsonProperty } from "typescript-json-serializer";

@Serializable()
export class SolrDoc {
    @JsonProperty()
    acquisitionPrice!: number;

    @JsonProperty()
    campaignId!: number;

    @JsonProperty()
    domain!: string;

    @JsonProperty()
    offerId!: number;

    @JsonProperty()
    offerName!: string;

    @JsonProperty()
    premiums!: string[];

    @JsonProperty()
    productName!: string;

    @JsonProperty()
    promoCode!: string;

    @JsonProperty()
    searchText!: string;

    @JsonProperty()
    subscriptionTerm!: string;

    @JsonProperty()
    totalOrders!: number;

    @JsonProperty({
        afterDeserialize: audienceTypeId => AudienceTypeHelper.fromString(audienceTypeId),
    })
    audienceType!: AudienceType;

    @JsonProperty({
        afterDeserialize: countryCode => CountryCodeHelper.fromString(countryCode),
    })
    countryCode!: CountryCode;

    @JsonProperty({
        afterDeserialize: (startDate: string) => new Date(startDate),
    })
    startDate!: Date;

    @JsonProperty({
        afterDeserialize: (endDate?: string) => (endDate ? new Date(endDate) : undefined),
    })
    endDate?: Date;
}
