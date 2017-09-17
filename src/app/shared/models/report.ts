/**
 * Represents a generic report model which will
 * be used to populate dynamic headers and data.
 */
export interface IReportRecord {
    headers: Array<any>;

    data: Array<Array<any>>;
}
