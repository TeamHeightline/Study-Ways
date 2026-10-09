import React from 'react';
import { observer } from 'mobx-react';
import { Button, Typography } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

export const ImageForQuestion = observer(() => {
  const store = QuestionEditorStorage;
  return (
    <div className="sw-qedit-question-media">
      {store.selectedQuestionImageURL ? (
        <img src={store.selectedQuestionImageURL} alt="Изображение вопроса" />
      ) : (
        <span className="sw-qedit-media-placeholder">
          <AddPhotoAlternateOutlinedIcon />
        </span>
      )}
      <div>
        <Typography component="h3">Изображение к вопросу</Typography>
        <Typography component="p" title={store.QuestionImageName}>
          {store.selectedQuestionImageURL
            ? store.QuestionImageName || 'Изображение добавлено'
            : 'Добавьте схему, фотографию или иллюстрацию'}
        </Typography>
        <Button
          component="label"
          size="small"
          variant="outlined"
          startIcon={<AddPhotoAlternateOutlinedIcon />}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            aria-label="Изображение к вопросу"
            onChange={event => {
              if (event.target.files?.length)
                store.uploadNewQuestionImage(event);
            }}
          />
          {store.selectedQuestionImageURL
            ? 'Заменить изображение'
            : 'Загрузить изображение'}
        </Button>
      </div>
    </div>
  );
});
