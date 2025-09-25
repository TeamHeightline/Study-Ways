import { Box, Stack } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { observer } from "mobx-react";
import React from "react";
import { QuestionPlayerStore } from "../Store/QuestionPlayerStore";
import { isMobileHook } from "../../../../Shared/CustomHooks/isMobileHook";
import UISingleAnswerByData from "./ui-single-answer-by-data";
import UIUserMarkAndActionButtons from "./ui-user-mark-and-action-buttons";

interface IUIAnswersProps extends BoxProps {
  questionStore: QuestionPlayerStore;
}

const UIAnswers = observer(({ questionStore, ...props }: IUIAnswersProps) => {
  const isMobile = isMobileHook();
  return (
    <Box {...props}>
      <div style={{ overflowX: "scroll" }}>
        {/* <Row style={{width:  questionStore?.answersArray.length * 410}}>*/}
        <Stack
          style={{
            width: isMobile ? "" : questionStore?.answersArray.length * 410,
          }}
        >
          {questionStore?.answersArray && (
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{
                height: isMobile ? questionStore?.answersArray * 410 : "",
                pt: 2,
              }}
            >
              {questionStore?.answersArray.map((answer, aIndex) => (
                <Box sx={{ mb: 2, px: { xs: 1 } }} key={answer.id}>
                  <UISingleAnswerByData
                    text={answer.answerText}
                    imageURL={answer.answerImageUrl}
                    isImageDeleted={answer.isImageDeleted}
                    onAnswerClick={() => {
                      questionStore.selectAnswerHandleChange(answer.id);
                    }}
                    isSelected={questionStore?.selectedAnswers?.has(answer?.id)}
                  />
                  <UIUserMarkAndActionButtons
                    questionStore={questionStore}
                    answerID={answer.id}
                    answerIndex={aIndex}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </div>
    </Box>
  );
});

export default UIAnswers;
