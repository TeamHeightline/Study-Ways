import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Button, Grid } from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";
import UIQuestionMiniViewByData from "./ui-question-mini-view-by-data";
import DeleteIcon from "@mui/icons-material/Delete";

type IUiSelectedQuestionsProps = PaperProps;

const UiSelectedQuestions = observer(
  ({ ...props }: IUiSelectedQuestionsProps) => (
    <Grid container spacing={10} sx={{ mt: 2, pb: 4 }} alignItems="stretch">
      {editQSStore?.qsData?.sequence_data?.sequence?.map(
        (questionID, questionIndex) => {
          const questionData = editQSStore?.allQuestions.find(
            (questionObj) => questionObj.id == String(questionID),
          );
          if (questionData) {
            return (
              <UIQuestionMiniViewByData
                onClickOnCard={() =>
                  (editQSStore.checkQuestionID = String(questionID))
                }
                questionData={questionData}
                key={questionData.id}
                actionButton={
                  <Button
                    onClick={() =>
                      editQSStore.removeSelectedQuestion(questionIndex)
                    }
                    sx={{ mt: 1 }}
                    variant={"outlined"}
                    color={"secondary"}
                    startIcon={<DeleteIcon />}
                  >
                    Удалить
                  </Button>
                }
              />
            );
          } else {
            return <div />;
          }
        },
      )}
    </Grid>
  ),
);

export default UiSelectedQuestions;
