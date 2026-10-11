import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Autocomplete, Paper, TextField } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';

type IUIThemeSearchProps = PaperProps;

const UIThemeSearch = ({ ...props }: IUIThemeSearchProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props}>
      <Autocomplete
        sx={{ width: 600 }}
        fullWidth
        onChange={editQSStore.changeSearchThemeString}
        freeSolo
        options={editQSStore.QuestionThemes}
        renderInput={params => <TextField {...params} label="Поиск по темам" />}
      />
    </Paper>
  );
};

export default UIThemeSearch;
