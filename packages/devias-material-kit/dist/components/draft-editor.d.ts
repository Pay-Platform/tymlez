import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import type { FC } from 'react';
import type { EditorProps } from 'react-draft-wysiwyg';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
interface DraftEditorProps extends EditorProps {
    sx?: SxProps<Theme>;
}
export declare const DraftEditor: FC<DraftEditorProps>;
export {};
