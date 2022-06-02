import { GroupByType } from "../enums/GroupByType";
import { Dictionary } from "lodash";
import moment from "moment";
import { IScan } from "../types/IScan";
import { IGroupByFieldDetails, PatientScanFieldType } from "../types/IGroupByFieldDetails";
import { dateFormat } from "../constants/Constants";
import _ from 'lodash';

export class DataAggregation {
    private groupByFieldsMapping!: Map<GroupByType, IGroupByFieldDetails>;
    private spesialGroupByFunctionMapping!: Map<PatientScanFieldType, (scan: IScan) => any>;
    
    constructor() {
        this.initializeScanFieldsMapping();
    }
    
    public groupScanResponse(groupByType: GroupByType, scans: Array<IScan>): Dictionary<IScan[]> {
        const fieldDetails = this.groupByFieldsMapping.get(groupByType);
        return this.groupByParameters(scans, fieldDetails!.fields);
    }

    private initializeScanFieldsMapping(): void {
        this.groupByFieldsMapping = new Map().set(GroupByType.patient, {
            fields: ["patientId"]
        }).set(GroupByType.algorithm, {
            fields: ["algorithmType"]
        }).set(GroupByType.hospital, {
            fields: ["hospital"]
        }).set(GroupByType.bodyPart, {
            fields: ["bodyPart"]
        }).set(GroupByType.patientInSameDay, {
            fields: ["patientId", "date"]
        }).set(GroupByType.hospitalDepartment, {
            fields: ["hospital", "bodyPart"]
        })

        this.spesialGroupByFunctionMapping = new Map().set('date', (scan: IScan) => moment(scan.date).format(dateFormat));
    }
    
    private groupByFunction(scans: IScan[], fieldName: PatientScanFieldType): any {
        return _.groupBy(scans, (scan: IScan) => 
            this.spesialGroupByFunctionMapping.has(fieldName) ? 
            this.spesialGroupByFunctionMapping.get(fieldName)!(scan) : scan[fieldName]);
    }

    private groupByParameters(scans: IScan[], parameters: Array<PatientScanFieldType>) {
        let groupedByObject: any = {};
        parameters.forEach((parameter, index) => {
            if (index === 0) {
                groupedByObject = this.groupByFunction(scans, parameter);
            } else {
                _.forEach(groupedByObject, (value, key) => {
                    groupedByObject[key] = this.groupByFunction(scans, parameter);
                });
            }
        });
        return groupedByObject;
    }
}