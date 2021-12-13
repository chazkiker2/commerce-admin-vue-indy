<script setup lang="ts">
    import { reactive, h } from "vue";
    import { Forecast } from "../models/forecast";
    import { NDataTable, NSpace } from "naive-ui";
    import { TableColumns } from "naive-ui/lib/data-table/src/interface";
    import Client from "@/client";

    interface Data {
        loading: boolean;
        post: null | Forecast[];
    }

    const client = new Client();

    client.promotions
        .httpSearch()
        .then(res => {
            console.log("SUCCESS");
            console.log({ res });
        })
        .catch(err => {
            console.log("FAILURE");
            console.error(err);
        });

    client.promotions
        .list({ name: "Stock Advisor", limit: 50 })
        .then(res => {
            console.log("client.promotions.list(): SUCCESS");
            console.log(res);
        })
        .catch(console.error);

    const data = reactive<Data>({ loading: false, post: null });

    const columns: TableColumns<Forecast> = [
        {
            title: "Date",
            key: "date",
            render(row: Forecast) {
                return h("span", null, { default: () => row.date.toDateString() });
            },
            sorter: ({ date: date1 }: Forecast, { date: date2 }: Forecast) =>
                date1.getTime() - date2.getTime(),
        },
        {
            title: "Temp. (C)",
            key: "temperatureC",
            sorter: "default",
        },
        {
            title: "Temp. (F)",
            key: "temperatureF",
            sorter: "default",
        },
        {
            title: "Summary",
            key: "summary",
            sorter: "default",
        },
    ];
</script>

<template>
    <NSpace vertical size="medium">
        <div v-if="data.loading" class="loading">
            Loading... Please refresh once the ASP.NET backend has started. See
            <a href="https://aka.ms/jspsintegrationvue">https://aka.ms/jspsintegrationvue</a>
            for more details.
        </div>
        <NDataTable :data="data.post || []" :columns="columns" />
    </NSpace>
</template>
