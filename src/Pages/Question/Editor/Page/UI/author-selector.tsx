import { useUserSession } from '../../../../../Shared/Store/UserStore/user-session';
import React from 'react';
import { observer } from 'mobx-react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { AuthorFilter } from '../../../../../Shared/Authors/AuthorFilter';
import { changeAuthorFilter } from '../redux-store/QuestionEditorPageSlice';

export default observer(function AuthorSelector() {
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
