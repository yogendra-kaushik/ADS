import { IReportRecord } from './report';

export interface IDailySummaryData {
    name?: any;

    value?: any;

    isIdentifier?: boolean;
}

export interface IHeader {
    name?: string;
    colspan?: number;
}

export interface IDailySummaryReport extends IReportRecord {
    headers: Array<Array<IHeader>>;
    data: Array<Array<IDailySummaryData>>;

}

export interface IDailySummaryLocationDetail {
    locationName?: string;

    report?: IDailySummaryReport;
}
