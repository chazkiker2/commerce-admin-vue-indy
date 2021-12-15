export enum Controllers {
    Promotions = "/api/commercepromotion",
    ClientPromotions = "/v1/promotions",
    Offers = "/v1/offers",
}

export class Endpoints {
    static readonly offers = {
        get: `${Controllers.Offers}`,
    };
}
