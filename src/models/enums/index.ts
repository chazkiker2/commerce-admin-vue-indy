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

export enum ProductOfferType {
    SingleItem = "SingleItem",
    Subscription = "Subscription",
    Any = "Any",
}

export class ProductOfferTypeHelper {
    static fromId(id: 1 | 2 | 3): ProductOfferType {
        return {
            [1]: ProductOfferType.SingleItem,
            [2]: ProductOfferType.Subscription,
            [3]: ProductOfferType.Any,
        }[id];
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
    static fromString(name: string): AudienceType {
        const at: { [key: string]: AudienceType } = {
            newmember: AudienceType.NewMember,
            "new member": AudienceType.NewMember,
            retention: AudienceType.Retention,
            acquisition: AudienceType.Acquisition,
        };
        const a = at[name.toLowerCase()];
        if (!a) {
            throw new Error(`Unacceptable audience type name: ${name}`);
        }
        return a;
    }
}
