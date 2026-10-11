import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Button, Grid, Paper } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';
import UIQuestionMiniViewByData from './ui-question-mini-view-by-data';
import AddIcon from '@mui/icons-material/Add';

type IUIAllQuestionsProps = PaperProps;

const UIAllQuestions = ({ ...props }: IUIAllQuestionsProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props}>
      <Grid container className="sw-sequence-grid">
        {editQSStore.QuestionsForSelect.map(questionData => (
          <UIQuestionMiniViewByData
            onClickOnCard={() =>
              editQSStore.setCheckQuestionID(questionData.id)
            }
            // onClick={() => editQSStore.addSelectedQuestion(questionData.id)}
            questionData={questionData}
            actionButton={
              <Button
                onClick={() =>
                  editQSStore.addSelectedQuestion(Number(questionData.id))
                }
                sx={{ mt: 1 }}
                variant={'outlined'}
                color={'primary'}
                startIcon={<AddIcon />}
              >
                Добавить
              </Button>
            }
            key={questionData.id}
          />
        ))}
      </Grid>
    </Paper>
  );
};

export default UIAllQuestions;
