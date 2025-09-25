import { Box, Chip, Tooltip } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { getQuestionStatistic, IQuestionStatistic } from "../Store/Struct";
import React, { useEffect, useState } from "react";
import { QuestionEditorStorage } from "../Store/QuestionEditorStorage";

import SchoolIcon from "@mui/icons-material/School";
import ArchitectureIcon from "@mui/icons-material/Architecture";

type IUIQuestionStatisticProps = BoxProps;

export default function UIQuestionStatistic({
  ...props
}: IUIQuestionStatisticProps) {
  const [questionStatistic, setQuestionStatistic] =
    useState<IQuestionStatistic | null>(null);

  useEffect(() => {
    if (QuestionEditorStorage.selectedQuestionID) {
      getQuestionStatistic(QuestionEditorStorage.selectedQuestionID).then(
        (data) => {
          setQuestionStatistic(data);
        },
      );
    }
  }, [QuestionEditorStorage.selectedQuestionID]);

  console.log(questionStatistic);

  return (
    <Box {...props}>
      {questionStatistic?.training_avg && (
        <Tooltip title={"Средний балл в тренировочном режиме"}>
          <Chip
            label={`${Math.ceil(questionStatistic?.training_avg)}%`}
            icon={<ArchitectureIcon />}
            sx={{
              backgroundColor:
                questionStatistic.training_avg > 70
                  ? "green"
                  : questionStatistic.training_avg > 50
                    ? "orange"
                    : "red",
            }}
          />
        </Tooltip>
      )}
      {questionStatistic?.exam_avg && (
        <Tooltip title={"Средний балл в экзаменационном режиме"}>
          <Chip
            label={`${Math.ceil(questionStatistic.exam_avg)}%`}
            icon={<SchoolIcon />}
            sx={{
              backgroundColor:
                questionStatistic.exam_avg > 70
                  ? "green"
                  : questionStatistic.exam_avg > 50
                    ? "orange"
                    : "red",
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
}
