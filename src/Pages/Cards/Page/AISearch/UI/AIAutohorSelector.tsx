import React from 'react';
import { observer } from 'mobx-react';
import { AISObject } from '../Store/AISearch';
import { AuthorFilter } from '../../../../../Shared/Authors/AuthorFilter';

export default observer(function AIAuthorSelector() {
  return (
    <AuthorFilter
      scope="cards"
      value={AISObject.selectedCardAuthor}
      onChange={id =>
        AISObject.changeCardAuthor(id ? { id: Number(id) } : null)
      }
    />
  );
});
