import { IScan } from "./IScan";

export interface IGroupByFieldDetails {
    fields: PatientScanFieldType[];
}

export type PatientScanFieldType = keyof IScan;
