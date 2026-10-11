import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Alert, Button, Skeleton } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
import { UserStorage } from '../../../../../Shared/Store/UserStore/UserStore';
import EditCardUI from './EditCardUI';
import { useAppDispatch } from '../../../../../App/ReduxStore/RootStore';
import { cardApi } from '../../../CardByID/API/card-api';
import { cardSelectorApi } from '../../../Selector/Store/card-selector-api';
import '../card-editor.css';

export const EditCardByID = observer(({ id }: { id?: string | number }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    CESObject.invalidateCardData = cardId => {
      dispatch(cardApi.util.invalidateTags([{ type: 'Card', id: cardId }]));
      dispatch(cardSelectorApi.util.invalidateTags(['CardList']));
    };
    return () => {
      CESObject.invalidateCardData = undefined;
    };
  }, [dispatch]);
  useEffect(() => {
    CESObject.loadCardDataFromServer(id);
  }, [id, UserStorage.userAccessLevel]);

  if (CESObject.cardLoadError)
    return (
      <div className="sw-cedit sw-cedit-workspace">
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => CESObject.loadCardDataFromServer(id)}
            >
              Повторить
            </Button>
          }
        >
          Не удалось загрузить карточку.
        </Alert>
      </div>
    );
  if (!CESObject.cardDataLoaded)
    return (
      <div
        className="sw-cedit sw-cedit-workspace"
        aria-busy="true"
        aria-label="Загрузка редактора карточки"
      >
        <Skeleton variant="rounded" height={38} width="45%" />
        <div className="sw-cedit-grid sw-cedit-loading">
          <Skeleton variant="rounded" height={480} />
          <Skeleton variant="rounded" height={350} />
        </div>
      </div>
    );
  return <EditCardUI />;
});
