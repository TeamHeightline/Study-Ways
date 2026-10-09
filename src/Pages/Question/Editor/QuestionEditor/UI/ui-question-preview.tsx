import React from 'react';
import { observer } from 'mobx-react';
import { Button, Collapse } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

export const UiQuestionPreview = observer(() => (
  <section className="sw-qedit-question-preview">
    <Button
      startIcon={<VisibilityOutlinedIcon />}
      endIcon={
        QuestionEditorStorage.showPreview ? (
          <ExpandLessRoundedIcon />
        ) : undefined
      }
      aria-expanded={QuestionEditorStorage.showPreview}
      onClick={() => {
        QuestionEditorStorage.showPreview = !QuestionEditorStorage.showPreview;
      }}
    >
      {QuestionEditorStorage.showPreview
        ? 'Скрыть предпросмотр вопроса'
        : 'Предпросмотр вопроса'}
    </Button>
    <Collapse in={QuestionEditorStorage.showPreview} unmountOnExit>
      <div className="sw-qedit-preview-content">
        {QuestionEditorStorage.selectedQuestionImageURL && (
          <img
            src={QuestionEditorStorage.selectedQuestionImageURL}
            alt="Иллюстрация к вопросу"
          />
        )}
        <div>
          <span>Вопрос №{QuestionEditorStorage.selectedQuestionID}</span>
          <p>
            {QuestionEditorStorage.selectedQuestionText ||
              'Формулировка вопроса пока не добавлена.'}
          </p>
        </div>
      </div>
    </Collapse>
  </section>
));
