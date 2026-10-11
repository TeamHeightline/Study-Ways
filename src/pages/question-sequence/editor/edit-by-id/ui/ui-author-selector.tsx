import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';
import { AuthorFilter } from '../../../../../shared/authors/AuthorFilter';

const UIAuthorSelector = (props: PaperProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props}>
      <AuthorFilter
        scope="questions"
        value={editQSStore.selectedAuthorID}
        onChange={id =>
          editQSStore.changeSelectedAuthorID({ target: { value: id || '-1' } })
        }
        specialOptions={[{ id: '-1', label: 'Все авторы' }]}
      />
    </Paper>
  );
};
export default UIAuthorSelector;
