import { JsonProperty, Serializable } from "typescript-json-serializer";
import { ProductOfferType, ProductOfferTypeHelper } from "./enums";
import { Currency, TimePeriod } from "./base";

@Serializable()
export class Product {
    @JsonProperty()
    id!: number;
    @JsonProperty()
    name!: string;
    @JsonProperty()
    url!: string;
    @JsonProperty()
    secureUrl!: string;
    @JsonProperty()
    isBackEnd!: boolean;
    @JsonProperty({
        beforeDeserialize(str: string): string[] {
            return str.split(",");
        },
    })
    primaryTickers?: string[];
    @JsonProperty()
    swapGuaranteePeriod?: TimePeriod;
    @JsonProperty({ name: "productType" })
    productTypeId!: number;
    @JsonProperty({
        afterDeserialize(productTypeId: 1 | 2 | 3): ProductOfferType {
            return ProductOfferTypeHelper.fromId(productTypeId);
        },
    })
    productType!: ProductOfferType;
}

@Serializable()
export class ProductOffer {
    @JsonProperty()
    name!: string;
    @JsonProperty()
    product!: Product;
    @JsonProperty()
    basePrice!: Currency;
    @JsonProperty()
    acquisitionPrice!: Currency;
    @JsonProperty()
    subscriptionPeriod?: TimePeriod;
}

@Serializable()
export class SubscriptionProductOffer extends ProductOffer {
    @JsonProperty()
    subscriptionPeriod!: TimePeriod;
}
