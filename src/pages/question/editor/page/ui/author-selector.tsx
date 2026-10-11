import { useUserSession } from '../../../../../shared/store/user-store/user-session';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/RootStore';
import { AuthorFilter } from '../../../../../shared/authors/AuthorFilter';
import { changeAuthorFilter } from '../redux-store/QuestionEditorPageSlice';
export default (function AuthorSelector() {
  const session = useUserSession();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(
    state => state.questionEditorPage.author_filter,
  );
  if (session.role !== 'ADMIN') return null;
  return (
    <AuthorFilter
      scope="questions"
      className="sw-qedit-author-filter"
      label="Автор вопросов"
      value={filter}
      onChange={id => dispatch(changeAuthorFilter(id || 'all'))}
      specialOptions={[
        { id: 'my', label: 'Мои вопросы' },
        { id: 'all', label: 'Все авторы' },
      ]}
    />
  );
});
