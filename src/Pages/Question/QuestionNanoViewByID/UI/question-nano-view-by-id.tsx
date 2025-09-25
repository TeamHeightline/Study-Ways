import { observer } from "mobx-react";
import React, { useState } from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Card, CardActionArea, Chip, Paper, Typography } from "@mui/material";
import { QuestionNanoViewByIdStore } from "../Store/question-nano-view-by-id-store";
import SkeletonNanoView from "./skeleton-nano-view";
import QuestionImage from "./question-image";

interface IQuestionNanoViewByIDProps extends PaperProps {
  question_id: number;
}

export const questionNanoViewCardSize = {
  width: 350,
  height: 160,
};

const QuestionNanoViewByID = observer(
  ({ question_id, ...props }: IQuestionNanoViewByIDProps) => {
    const [QuestionObject] = useState(
      new QuestionNanoViewByIdStore(question_id),
    );
    if (!QuestionObject.dataHasBeenLoaded) {
      return <SkeletonNanoView />;
    }
    return (
      <Paper elevation={0} {...props}>
        <QuestionImage QuestionObject={QuestionObject} />
        <Card
          onMouseEnter={QuestionObject.handlePopoverOpen}
          onMouseLeave={QuestionObject.handlePopoverClose}
          sx={{
            width: questionNanoViewCardSize.width,
            height: questionNanoViewCardSize.height,
            textAlign: "center",
          }}
          variant="outlined"
        >
          <CardActionArea style={{ height: "100%" }} sx={{ pl: 1, pr: 1 }}>
            <Typography>{`ID: ${QuestionObject.id}`}</Typography>
            <Typography sx={{ maxHeight: 95, overflow: "hidden" }}>
              {QuestionObject?.text}
            </Typography>
            <Chip size={"small"} label={QuestionObject.owner_username} />
          </CardActionArea>
        </Card>
      </Paper>
    );
  },
);

export default QuestionNanoViewByID;
