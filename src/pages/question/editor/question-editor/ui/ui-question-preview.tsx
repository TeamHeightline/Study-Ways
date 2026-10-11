import React from 'react';
import { Button, Collapse } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { useQuestionEditor } from '../store/use-question-editor';
export const UiQuestionPreview = () => {
  const editor = useQuestionEditor();
  return (
    <section className="sw-qedit-question-preview">
      <Button
        startIcon={<VisibilityOutlinedIcon />}
        endIcon={editor.showPreview ? <ExpandLessRoundedIcon /> : undefined}
        aria-expanded={editor.showPreview}
        onClick={() => {
          editor.togglePreview();
        }}
      >
        {editor.showPreview
          ? 'Скрыть предпросмотр вопроса'
          : 'Предпросмотр вопроса'}
      </Button>
      <Collapse in={editor.showPreview} unmountOnExit>
        <div className="sw-qedit-preview-content">
          {editor.selectedQuestionImageURL && (
            <img
              src={editor.selectedQuestionImageURL}
              alt="Иллюстрация к вопросу"
            />
          )}
          <div>
            <span>Вопрос №{editor.selectedQuestionID}</span>
            <p>
              {editor.selectedQuestionText ||
                'Формулировка вопроса пока не добавлена.'}
            </p>
          </div>
        </div>
      </Collapse>
    </section>
  );
};
