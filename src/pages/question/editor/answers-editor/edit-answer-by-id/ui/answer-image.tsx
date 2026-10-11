import React, { useState } from 'react';
import { PaperProps } from '@mui/material/Paper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerImageProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const AnswerImage = ({ answer_object, ...props }: IAnswerImageProps) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const openDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const isImageDeleted = answer_object.draft.isImageDeleted;
  return (
    <Paper elevation={0} {...props} className="sw-qedit-answer-media">
      <Stack
        direction={'row'}
        sx={{
          alignItems: 'center',
        }}
      >
        <Button
          size={'small'}
          color="primary"
          variant="outlined"
          component="label"
          loading={answer_object.uploading}
        >
          <input
            type="file"
            accept="image/*"
            aria-label={`Изображение к ответу №${answer_object.answer_id}`}
            hidden
            name="file"
            onChange={e => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) void answer_object.updateImage(file);
            }}
          />
          Изображение для ответа
        </Button>
        <IconButton
          aria-label="Удалить изображение ответа"
          onClick={openDeleteDialog}
          disabled={
            !answer_object.imageName ||
            isImageDeleted ||
            answer_object.uploading
          }
        >
          <ClearIcon />
        </IconButton>
      </Stack>

      <div>
        {!isImageDeleted &&
          (answer_object?.imageName?.length > 30
            ? `${answer_object.imageName.slice(0, 20)}...`
            : answer_object.imageName)}
      </div>

      <Dialog
        open={isOpenDeleteDialog}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: { className: 'sw-qedit-dialog' },
        }}
      >
        <DialogTitle>{'Удалить изображение для ответа?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Изображение больше не будет показываться в этом ответе.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              answer_object.changeValue('isImageDeleted', true);
              closeDeleteDialog();
            }}
            variant={'outlined'}
            color={'secondary'}
          >
            Удалить
          </Button>
          <Button onClick={closeDeleteDialog} autoFocus>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AnswerImage;
