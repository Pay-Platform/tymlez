import type { FC } from 'react';
import type { DropzoneOptions } from 'react-dropzone';
interface FileDropzoneProps extends DropzoneOptions {
    files?: any[];
    onRemove?: (file: any) => void;
    onRemoveAll?: () => void;
    onUpload?: () => void;
}
export declare const FileDropzone: FC<FileDropzoneProps>;
export {};
