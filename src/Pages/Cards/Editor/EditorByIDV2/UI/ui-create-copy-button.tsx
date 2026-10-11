import React from 'react';
import { Button } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useCardEditor } from '../model/use-card-editor';
const UICreateButton = () => {
  const editor = useCardEditor();
  return (
    <Button
      variant="outlined"
      startIcon={<ContentCopyRoundedIcon />}
      disabled={!editor.isSaved}
      onClick={editor.openCopyCardDialog}
    >
      Создать копию
    </Button>
  );
};
export default UICreateButton;
