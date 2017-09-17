/**
 * Represents the model that is passed into the FileViewComponent.
 */
export interface IFileView {
    extension: string;

    name: string;

    type: FileType;

    url: URL;
}

/**
 * Represents the common types of files.
 */
export enum FileType {
    Unknown = 0,
    Image,
    Text
}
