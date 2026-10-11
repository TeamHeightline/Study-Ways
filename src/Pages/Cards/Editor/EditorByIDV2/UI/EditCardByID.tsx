import React, { useEffect } from 'react';
import { Alert, Button, Skeleton } from '@mui/material';
import {
  useUserSession,
  UserRole,
} from '../../../../../Shared/Store/UserStore/user-session';
import { useAppDispatch } from '../../../../../App/ReduxStore/RootStore';
import { useGetCardEditorDataQuery } from '../model/card-editor-api';
import { initializeDraft } from '../model/card-editor-slice';
import { toCardDraft } from '../model/types';
import {
  CardEditorProvider,
  useCardEditorController,
} from '../model/use-card-editor';
import EditCardUI from './EditCardUI';
import '../card-editor.css';

interface Props {
  id?: string | number;
  onSaveStateChange?: (saved: boolean) => void;
}

export function EditCardByID({ id, onSaveStateChange }: Props) {
  const { user, role } = useUserSession();
  const cardId = Number(id);
  if (!user || !['ADMIN', 'TEACHER', 'CARD_EDITOR'].includes(role))
    return (
      <Alert severity="error">
        Недостаточно прав для редактирования карточки.
      </Alert>
    );
  if (!Number.isInteger(cardId) || cardId < 1)
    return <Alert severity="error">Укажите корректный номер карточки.</Alert>;
  return (
    <EditorSession
      key={`${user.id}:${cardId}`}
      id={cardId}
      userId={user.id}
      role={role}
      onSaveStateChange={onSaveStateChange}
    />
  );
}

function EditorSession({
  id,
  userId,
  role,
  onSaveStateChange,
}: {
  id: number;
  userId: number;
  role: UserRole;
  onSaveStateChange?: Props['onSaveStateChange'];
}) {
  const dispatch = useAppDispatch();
  const key = `${userId}:${id}`;
  const query = useGetCardEditorDataQuery({ id, userId });
  const data = query.currentData;
  const allowed = !!data && (role === 'ADMIN' || data.created_by_id === userId);
  useEffect(() => {
    if (data && allowed)
      dispatch(
        initializeDraft({
          key,
          draft: toCardDraft(data),
          imagePath: data.cards_cardimage?.image ?? '',
        }),
      );
  }, [data, allowed, dispatch, key]);
  const editor = useCardEditorController(key, userId);
  useEffect(() => {
    onSaveStateChange?.(editor?.isSaved ?? true);
  }, [editor?.isSaved, onSaveStateChange]);

  if (data && !allowed)
    return (
      <Alert severity="error">Можно редактировать только свои карточки.</Alert>
    );
  if (data === null) return <Alert severity="info">Карточка не найдена.</Alert>;
  if (query.isError && !editor)
    return (
      <div className="sw-cedit sw-cedit-workspace">
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => query.refetch()}>
              Повторить
            </Button>
          }
        >
          Не удалось загрузить карточку.
        </Alert>
      </div>
    );
  if (!editor)
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
  return (
    <CardEditorProvider value={editor}>
      <EditCardUI />
    </CardEditorProvider>
  );
}
