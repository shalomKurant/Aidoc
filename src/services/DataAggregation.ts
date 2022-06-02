import { GroupByOption } from "../enums/GroupByOption";
import _ from 'lodash';

export class DataAggregation<T> {

    constructor(private groupByFieldsMapping: Map<GroupByOption, Array<keyof T>>, 
                private specialGroupByFunctionMapping: Map<keyof T, (item: T) => any>) {
    }
    
    public groupDataResponse(groupByType: GroupByOption, items: Array<T>): _.Dictionary<T[]> {
        const fieldDetails = this.groupByFieldsMapping.get(groupByType);
        return this.groupByParameters(items, fieldDetails!);
    }

    private groupByParameters(items: T[], parameters: Array<keyof T>): _.Dictionary<Array<T>> {
        const groupedByObject = _.groupBy(items, (item: T) => {
            const valuesToGrouped: Array<string> = parameters.map(parameter => this.getFieldValue(parameter, item));
            return valuesToGrouped.join('|');
        });
        return groupedByObject;
    }

    private getFieldValue(parameter: keyof T, item: T): string {
        return this.specialGroupByFunctionMapping.has(parameter) ? 
            this.specialGroupByFunctionMapping.get(parameter)!(item) : item[parameter];
    }
}