import { JsonProperty, Serializable } from "typescript-json-serializer";

@Serializable()
export class Currency {
    @JsonProperty()
    currencyCode?: string;
    @JsonProperty()
    amount?: number;
}

@Serializable()
export class TimePeriod {
    @JsonProperty()
    id!: number;
    @JsonProperty()
    units!: number;
    @JsonProperty()
    type!: number;
    @JsonProperty()
    typeName!: string;
    @JsonProperty()
    name!: string;
}
