export interface IScan {
    scanId: number;
    patientId: string;
    algorithmType: string;
    status: string;
    isPositive: boolean;
    date: string;
    hospital: string;
    bodyPart: string;
}