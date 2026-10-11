import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Button, Grid } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';
import UIQuestionMiniViewByData from './ui-question-mini-view-by-data';
import DeleteIcon from '@mui/icons-material/Delete';

type IUiSelectedQuestionsProps = PaperProps;

const UiSelectedQuestions = ({ ...props }: IUiSelectedQuestionsProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Grid container className="sw-sequence-grid">
      {editQSStore?.qsData?.sequence_data?.sequence?.map(
        (questionID, questionIndex) => {
          const questionData = editQSStore?.allQuestions.find(
            questionObj => questionObj.id == String(questionID),
          );
          if (questionData) {
            return (
              <UIQuestionMiniViewByData
                onClickOnCard={() =>
                  editQSStore.setCheckQuestionID(String(questionID))
                }
                questionData={questionData}
                key={`${questionData.id}-${questionIndex}`}
                actionButton={
                  <Button
                    onClick={() =>
                      editQSStore.removeSelectedQuestion(questionIndex)
                    }
                    sx={{ mt: 1 }}
                    variant={'outlined'}
                    color={'primary'}
                    startIcon={<DeleteIcon />}
                  >
                    Убрать из серии
                  </Button>
                }
              />
            );
          } else {
            return null;
          }
        },
      )}
    </Grid>
  );
};

export default UiSelectedQuestions;
