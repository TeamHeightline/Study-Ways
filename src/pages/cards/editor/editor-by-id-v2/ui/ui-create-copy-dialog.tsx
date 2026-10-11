import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCardEditor } from '../model/use-card-editor';
const UICreateCopyDialog = () => {
  const editor = useCardEditor();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (editor.copyOpen) setError(false);
  }, [editor.copyOpen]);
  const close = () => {
    if (!editor.copying) editor.closeCopyCardDialog();
  };
  const create = async () => {
    setError(false);
    try {
      const oldId = editor.draft?.id;
      const result = await editor.createCopyCard();
      const newId = result?.data?.id;
      if (!oldId || !newId) throw new Error('Copy was not created');
      editor.closeCopyCardDialog();
      navigate(
        location.pathname.replace(new RegExp(`/${oldId}/?$`), `/${newId}`),
      );
    } catch {
      setError(true);
    }
  };
  return (
    <Dialog
      open={editor.copyOpen}
      onClose={close}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { className: 'sw-cedit-dialog' },
      }}
    >
      <DialogTitle>
        Создать копию карточки
        <IconButton
          disabled={editor.copying}
          onClick={close}
          aria-label="Закрыть"
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Будет создана новая карточка с тем же содержанием и настройками. Вы
          сразу перейдёте к её редактированию.
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Не удалось создать копию. Попробуйте ещё раз.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={editor.copying} onClick={close}>
          Отмена
        </Button>
        <Button
          variant="contained"
          startIcon={<ContentCopyRoundedIcon />}
          loading={editor.copying}
          onClick={create}
        >
          Создать копию
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default UICreateCopyDialog;
