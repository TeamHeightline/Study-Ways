import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Dialog, Paper } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';
import CheckQuestionByID from '../../../../CheckQuestion/CheckQuestionByID/UI/check-question-by-id';

type IUICheckQuestionProps = PaperProps;

const UICheckQuestion = ({ ...props }: IUICheckQuestionProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props}>
      <Dialog
        open={editQSStore.checkQuestionID != null}
        onClose={() => editQSStore.setCheckQuestionID(null)}
        fullWidth={true}
        maxWidth={'lg'}
      >
        {editQSStore.checkQuestionID && (
          <CheckQuestionByID question_id={editQSStore.checkQuestionID} />
        )}
      </Dialog>
    </Paper>
  );
};

export default UICheckQuestion;
