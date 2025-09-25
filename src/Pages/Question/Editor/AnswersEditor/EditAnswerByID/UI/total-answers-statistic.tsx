import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Alert, Card, Paper, Typography } from "@mui/material";
import { QuestionEditorStorage } from "../../../QuestionEditor/Store/QuestionEditorStorage";

type ITotalAnswersStatisticProps = PaperProps;

const TotalAnswersStatistic = observer(
  ({ ...props }: ITotalAnswersStatisticProps) => {
    const errorRef: any = useRef(null);
    const scrollToError = () =>
      errorRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    useEffect(() => {
      if (QuestionEditorStorage.ErrorRequiredAnswerSoMuch) {
        scrollToError();
      }
    }, [QuestionEditorStorage.ErrorRequiredAnswerSoMuch]);

    return (
      <Paper elevation={0} {...props} sx={{ maxWidth: 300 }}>
        <Card
          variant="outlined"
          sx={{ pt: 2, pb: 2, pl: 2, pr: 2 }}
          ref={errorRef}
        >
          <Typography variant={"body1"}>
            Всего ответов:
            {` ${QuestionEditorStorage.NumberOfAllAnswers}`}
          </Typography>
          <Typography variant={"body1"}>
            Обязательных ответов:
            {` ${QuestionEditorStorage.NumberOfRequiredAnswers}`}
          </Typography>
          {QuestionEditorStorage.ErrorRequiredAnswerSoMuch && (
            <Alert severity={"error"} variant={"outlined"}>
              Обязательных ответов столько же или больше чем общее число
              отображаемых ответов, это значит, что необязательные ответы не
              будут отображаться
            </Alert>
          )}
          <Typography variant={"body1"}>
            Ответов в тренировочном режиме:
            {` ${QuestionEditorStorage.NumberOfAnswersInTrainingMode}`}
          </Typography>
        </Card>
      </Paper>
    );
  },
);

export default TotalAnswersStatistic;
