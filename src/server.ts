import express from "express";
import { GroupByType } from "./enums/GroupByType";
import { DataAggregation } from "./services/DataAggregation";
import { ScanDataAccess } from "./services/ScanDataAccess";
import { IScan } from "./types/IScan";
import { Dictionary } from "lodash";

const app = express();
const PORT: number = 6060;
const dataAccess = new ScanDataAccess();
const dataAggregation = new DataAggregation();

app.get('/grouped-scans', async (request, response) => {
    const groupByType = <GroupByType> request.query.groupBy;

    if (!groupByType) {
        response.status(400).send(`Missing groupBy parameter`);
        return;
    }
    try {
        const dataResponse: IScan[] = await dataAccess.getScans();
        const groupedResult: Dictionary<IScan[]> = dataAggregation.groupScanResponse(groupByType, dataResponse)
        response.status(200).json(groupedResult);
    } catch (error) {
        response.status(500).json(error);
    }
});

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})