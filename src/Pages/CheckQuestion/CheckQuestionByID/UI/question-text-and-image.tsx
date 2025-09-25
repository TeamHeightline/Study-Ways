import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Card, Grid, Paper, Typography } from "@mui/material";
import { NanoQuestionStoreType } from "../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store";
import CardMedia from "@mui/material/CardMedia";
import { FILE_URL } from "../../../../settings";

interface IQuestionTextAndImageProps extends PaperProps {
  QuestionDataStore: NanoQuestionStoreType;
}

const QuestionTextAndImage = observer(
  ({ QuestionDataStore, ...props }: IQuestionTextAndImageProps) => (
    <Paper elevation={0} {...props}>
      <Card variant={"outlined"}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <CardMedia
              sx={{
                width: "100%",
                minHeight: 200,
                height: "100%",
                backgroundSize: "cover",
              }}
              image={`${FILE_URL}/${QuestionDataStore.questionImage}`}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant={"body1"} sx={{ p: 2 }}>
              {QuestionDataStore.text}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Paper>
  ),
);

export default QuestionTextAndImage;
