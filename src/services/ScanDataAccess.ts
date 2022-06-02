import axios, { AxiosResponse } from "axios";
import { adiocUsername, scansAPI } from "../constants/Constants";
import { IScan } from "../types/IScan";

export class ScanDataAccess {
    public async getScans(): Promise<IScan[]> {
        try {
            const scanResponse: AxiosResponse = await axios.get(scansAPI, {headers: {
                username: adiocUsername
            }});
            return scanResponse.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}