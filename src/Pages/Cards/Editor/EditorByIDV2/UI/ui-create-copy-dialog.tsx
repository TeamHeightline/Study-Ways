import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
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
import { LoadingButton } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';
import { CESObject } from '../Store/CardEditorStorage';
const UICreateCopyDialog = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (CESObject.isOpenCopyCardDialog) setError(false);
  }, [CESObject.isOpenCopyCardDialog]);
  const close = () => {
    if (!CESObject.isPendingCreateCopy) CESObject.closeCopyCardDialog();
  };
  const create = async () => {
    setError(false);
    try {
      const oldId = CESObject.card_object?.id;
      const result = await CESObject.createCopyCard();
      const newId = result?.data?.id;
      if (!oldId || !newId) throw new Error('Copy was not created');
      CESObject.closeCopyCardDialog();
      navigate(
        location.pathname.replace(new RegExp(`/${oldId}/?$`), `/${newId}`),
      );
    } catch {
      setError(true);
    }
  };
  return (
    <Dialog
      open={CESObject.isOpenCopyCardDialog}
      onClose={close}
      fullWidth
      maxWidth="xs"
      PaperProps={{ className: 'sw-cedit-dialog' }}
    >
      <DialogTitle>
        Создать копию карточки
        <IconButton
          disabled={CESObject.isPendingCreateCopy}
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
        <Button disabled={CESObject.isPendingCreateCopy} onClick={close}>
          Отмена
        </Button>
        <LoadingButton
          variant="contained"
          startIcon={<ContentCopyRoundedIcon />}
          loading={CESObject.isPendingCreateCopy}
          onClick={create}
        >
          Создать копию
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
});
export default UICreateCopyDialog;
