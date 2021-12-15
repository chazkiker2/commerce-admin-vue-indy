import { JsonProperty, Serializable } from "typescript-json-serializer";

// {
//     "id": 841,
//     "uuid": "08c8e2d0-ba4d-4a5c-a1e5-505f0cb000ad",
//     "name": "10X - 21.06 - Launch Day",
//     "aid": null,
//     "members_url": "/premium/reports/",
//     "is_eastern_enddatetime": false,
//     "countdown_timer": true,
//     "countdown_copy": "This VIP offer will expire in",
//     "end_datetime": "2021-06-10 00:00:01"
// }

@Serializable()
export class Campaign {
    @JsonProperty()
    id!: number;

    @JsonProperty()
    uuid!: string;

    @JsonProperty()
    name!: string;

    @JsonProperty()
    aid!: string | null;

    @JsonProperty({ name: "members_url" })
    membersUrl!: string;

    @JsonProperty({ name: "is_eastern_enddatetime" })
    isEasternEndDateTime!: boolean;

    @JsonProperty({ name: "countdown_timer" })
    countdownTimer!: boolean;

    @JsonProperty({ name: "countdown_copy" })
    countdownCopy!: string;

    @JsonProperty({
        name: "end_datetime",
        afterDeserialize: (dateStr: string) => new Date(dateStr),
    })
    endDateTime!: Date;
}
