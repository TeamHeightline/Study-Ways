import { observer } from "mobx-react";
import React from "react";
import { QuestionEditorStorage } from "../../../QuestionEditor/Store/QuestionEditorStorage";
import Typography from "@mui/material/Typography";
import EditAnswerByID from "./edit-answer-by-id";
import { Grid, Stack } from "@mui/material";
import TotalAnswersStatistic from "./total-answers-statistic";
import { isMobileHook } from "../../../../../../Shared/CustomHooks/isMobileHook";

export const AnswersEditor = observer(() => {
  const isMobile = isMobileHook();

  if (!QuestionEditorStorage.questionHasBeenSelected) {
    return <></>;
  }
  return (
    <>
      <Stack alignItems={"center"} justifyContent={"center"}>
        <Typography variant={"h2"}>Редактор ответов</Typography>
      </Stack>
      <Grid container justifyContent={"center"}>
        <Grid item xs={isMobile ? 12 : 9} sx={{ pt: 2 }}>
          <Stack justifyContent={"flex-end"}>
            <TotalAnswersStatistic />
          </Stack>

          {QuestionEditorStorage.answersIDForUI?.map(
            (answer_id, answer_index) => (
              <EditAnswerByID
                answer_index={answer_index}
                answer_id={Number(answer_id)}
                key={`${answer_id}answerKey`}
              />
            ),
          )}
        </Grid>
      </Grid>
    </>
  );
});
