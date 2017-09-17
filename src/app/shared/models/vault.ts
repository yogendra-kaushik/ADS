import { IDataTransfer } from './modal';

/**
 * Represents the entire vault data structure returned by the API.
 */
export interface IVaultDirectory {
    name?: string;

    files?: Array<IVaultFile>;

    sub_directories?: Array<IVaultDirectory>;

    id?: string;
}

/**
 * Represents a Vault file.
 */
export interface IVaultFile {
    file_size?: string;

    fileName?: string;

    import?: IVaultImport;

    uri?: string;
}

/**
 * Represents the telemetry data import object.
 */
export interface IVaultImport {
    locations?: IVaultImportLocations;
    dateRange?: string;
}

/**
 * Represents the location object for the telemetry data import.
 */
export interface IVaultImportLocations {
    id?: number;
    name?: string;
}

/**
 * Represents the object used by the modal to transfer data between
 * the parent component and the modal component.
 */
export interface ITelemetryImportDatum extends IDataTransfer {
    import: IVaultImport;
}

/**
 * Represents a sharable vault file link as returned by the API.
 */
export interface IVaultLinkShare {
    link: string;
}

/**
 * Represnts the model that is passed into the Vault share dialog.
 */
export interface IVaultShareDialogData {

    /**
     * The id (or uri) of the file to be shared.
     */
    id: string;

    /**
     * The name of the file to be shared.
     */
    name: string;
}

/**
 * Represents vault remove file params.
 */
export interface IVaultFileRemoveQueryParams extends IVaultQueryParams {
    uri: string;
}

/**
 * Represnts the Vault query parameters for retrieving the vault list.
 */
export interface IVaultGetVaultListQueryParams extends IVaultQueryParams { }

export interface IVaultGetVaultListQueryParams extends IVaultQueryParams { }
export interface IVaultGetSharedLinkQueryParams extends IVaultQueryParams {
    uri: string;
    expirationHours: number;
}

/**
 * Represents the vault upload result object which is used as a return in the modal.
 */
export interface IVaultUploadResult {

    /**
     * Represents the file name.
     */
    fileName: string;

    /**
     * Represents a value indicating whether this file was succesfully uploaded.
     */
    isSuccess: boolean;
}

/**
 * Represents the default query parameters.
 */
interface IVaultQueryParams {
    /**
     * Represents the customer surrogate identifier.
     */
    cid: number;
}
