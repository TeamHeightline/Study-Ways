import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Paper, TextField } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';

type IUIQSNameProps = PaperProps;

const UIQSName = ({ ...props }: IUIQSNameProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props}>
      <TextField
        value={editQSStore.qsData?.name}
        onChange={editQSStore.changeQSName}
        size="small"
        label="Название серии вопросов"
        variant="outlined"
        multiline
        fullWidth
      />
    </Paper>
  );
};

export default UIQSName;
