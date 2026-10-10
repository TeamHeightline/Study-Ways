import { observer } from 'mobx-react';
import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import editQSStore from '../store/edit-question-sequence-sore';
import { AuthorFilter } from '../../../../../Shared/Authors/AuthorFilter';

const UIAuthorSelector = observer((props: PaperProps) => (
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
));
export default UIAuthorSelector;
