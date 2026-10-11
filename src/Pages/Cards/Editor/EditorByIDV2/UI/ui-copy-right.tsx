import React from 'react';
import { Collapse, TextField } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';
export const UiCopyRight = () => {
  const editor = useCardEditor();
  return (
    <Collapse
      in={!!(editor.draft.is_card_use_copyright ?? false)}
      unmountOnExit
    >
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        label="Автор или правообладатель"
        value={editor.draft.copyright ?? ''}
        onChange={editor.changeField('copyright')}
      />
    </Collapse>
  );
};
