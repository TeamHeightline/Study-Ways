import React from 'react';
import { useAISearch } from '../store/AISearch';
import { AuthorFilter } from '../../../../../shared/authors/AuthorFilter';
export default (function AIAuthorSelector() {
  const search = useAISearch();
  return (
    <AuthorFilter
      scope="cards"
      value={search.selectedCardAuthor}
      onChange={id => search.changeCardAuthor(id ? { id: Number(id) } : null)}
    />
  );
});
