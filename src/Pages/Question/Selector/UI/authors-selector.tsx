import { observer } from 'mobx-react';
import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import QSSObject from '../Store/question-selector-store';
import { AuthorFilter } from '../../../../Shared/Authors/AuthorFilter';

const AuthorSelector = observer((props: PaperProps) => (
  <Paper elevation={0} {...props} sx={{ pl: 3, pt: 2, maxWidth: 360 }}>
    <AuthorFilter
      scope="questions"
      value={QSSObject.selectedAuthorID}
      onChange={id =>
        QSSObject.changeSelectedAuthorID({ target: { value: id || '-2' } })
      }
      specialOptions={[
        { id: '-2', label: 'Все вопросы' },
        { id: '-1', label: 'Мои вопросы' },
      ]}
    />
  </Paper>
));

export default AuthorSelector;
