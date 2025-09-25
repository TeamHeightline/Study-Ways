import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Button, Grid, Paper } from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";
import UIQuestionMiniViewByData from "./ui-question-mini-view-by-data";
import AddIcon from "@mui/icons-material/Add";

type IUIAllQuestionsProps = PaperProps;

const UIAllQuestions = observer(({ ...props }: IUIAllQuestionsProps) => (
  <Paper elevation={0} {...props}>
    <Grid container spacing={10} sx={{ mt: 2 }} alignItems="stretch">
      {editQSStore.QuestionsForSelect.map((questionData) => (
        <UIQuestionMiniViewByData
          onClickOnCard={() => (editQSStore.checkQuestionID = questionData.id)}
          // onClick={() => editQSStore.addSelectedQuestion(questionData.id)}
          questionData={questionData}
          actionButton={
            <Button
              onClick={() =>
                editQSStore.addSelectedQuestion(Number(questionData.id))
              }
              sx={{ mt: 1 }}
              variant={"outlined"}
              color={"primary"}
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
));

export default UIAllQuestions;
