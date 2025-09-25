import { Box, Chip, Tooltip } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { useEffect, useState } from "react";
import { getAnswerStatistic } from "../Store/Query";
import { IAnswerStatistic } from "../Store/type";

interface IAnswerStatisticProps extends BoxProps {
  answer_id: number;
}

export default function AnswerStatistic({
  answer_id,
  ...props
}: IAnswerStatisticProps) {
  const [answerStatistic, setAnswerStatistic] =
    useState<IAnswerStatistic | null>(null);

  useEffect(() => {
    getAnswerStatistic(answer_id).then((data) => {
      setAnswerStatistic(data);
    });
  }, [answer_id]);

  if (
    !answerStatistic?.number_of_incorrect_answer_choices ||
    !answerStatistic?.number_of_all_answer_choices
  ) {
    return <div />;
  }

  const answerRightSelectPercent =
    (1 -
      (answerStatistic?.number_of_incorrect_answer_choices || 0) /
        (answerStatistic?.number_of_all_answer_choices || 1)) *
    100;
  const answerRightSelectPercentRounded = Math.round(answerRightSelectPercent);
  const answerRightSelectPercentRoundedString = `${answerRightSelectPercentRounded.toString()}%`;
  const colorBasedOnPercent =
    answerRightSelectPercentRounded > 70
      ? "green"
      : answerRightSelectPercentRounded > 50
        ? "orange"
        : "red";
  return (
    <Box {...props}>
      <Tooltip title={"Процент верного выбора/не выбора этого ответ"}>
        <Chip
          label={answerRightSelectPercentRoundedString}
          sx={{ backgroundColor: colorBasedOnPercent }}
        />
      </Tooltip>
    </Box>
  );
}
