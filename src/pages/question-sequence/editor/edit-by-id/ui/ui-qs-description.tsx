import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Paper, TextField } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';

type IUIQSDescriptionProps = PaperProps;

const UIQSDescription = ({ ...props }: IUIQSDescriptionProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props}>
      <TextField
        value={editQSStore.qsData?.description}
        onChange={editQSStore.changeQSDescription}
        size="small"
        label="Описание серии вопросов"
        variant="outlined"
        fullWidth
      />
    </Paper>
  );
};

export default UIQSDescription;
