import { JsonProperty, Serializable } from "typescript-json-serializer";

@Serializable()
export class Forecast {
    @JsonProperty({
        afterDeserialize: (date: string) => new Date(date),
    })
    public date!: Date;
    @JsonProperty()
    public temperatureC!: number;
    @JsonProperty()
    public temperatureF!: number;
    @JsonProperty()
    public summary?: string;
}
