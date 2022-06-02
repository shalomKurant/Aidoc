
import { Dictionary } from "lodash";
import { GroupByOption } from "../enums/GroupByOption";
import { Request, Response } from 'express';
import { IScan } from "../types/IScan";
import { ScanDataAccess } from "../services/ScanDataAccess";
import { DataAggregation } from "../services/DataAggregation";
import { dateFormat } from "../constants/Constants";
import moment from "moment";

export class GroupedScansController {
    private readonly dataAccess: ScanDataAccess;
    private readonly dataAggregation: DataAggregation<IScan>;

    constructor() {
        this.dataAccess = new ScanDataAccess();
        this.dataAggregation = new DataAggregation<IScan>(
            this.getGroupByFieldsMapping(), this.getSpecialGroupByFunctionMapping());

    }
    public async getGroupedScans(request: Request, response: Response): Promise<void> {
        const groupByType = <GroupByOption> request.query.groupBy;

        if (!groupByType) {
            response.status(400).send(`Missing groupBy parameter`);
            return;
        }
        try {
            const dataResponse: IScan[] = await this.dataAccess.getScans();
            const groupedResult: Dictionary<IScan[]> = this.dataAggregation.groupDataResponse(groupByType, dataResponse)
            response.status(200).json(groupedResult);
        } catch (error) {
            response.status(500).json(error);
        }
    };

    private getGroupByFieldsMapping(): Map<GroupByOption, Array<keyof IScan>> {
        return new Map()
        .set(GroupByOption.patient, ["patientId"])
        .set(GroupByOption.algorithm, ["algorithmType"])
        .set(GroupByOption.hospital,["hospital"])
        .set(GroupByOption.bodyPart, ["bodyPart"])
        .set(GroupByOption.patientInSameDay, ["patientId", "date"])
        .set(GroupByOption.hospitalDepartment, ["hospital", "bodyPart"]);
    }

    private getSpecialGroupByFunctionMapping(): any {
        return new Map().set('date', (scan: IScan) => moment(scan.date).format(dateFormat));
    }
}