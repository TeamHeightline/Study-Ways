import { observer } from "mobx-react";
import React from "react";

import { Card, CardActionArea, Grid, Stack, Typography } from "@mui/material";
import { SQSObject } from "../Store/SelectQuestionStore";

interface ISequencesProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectQS: (qs_id: number) => void;
}
export const Sequences = observer(
  ({ onSelectQS, ...props }: ISequencesProps) => (
    <div {...props}>
      <Grid
        container
        item
        xs={12}
        sx={{ pt: 2, pl: 6, pr: 2 }}
        rowSpacing={3}
        justifyContent={"space-evenly"}
        columnSpacing={8}
      >
        {SQSObject.sequenceArrayForDisplay?.map((sequence) => (
          <Grid item xs={12} md={4}>
            <Card variant="outlined" key={`${sequence?.id}SequenceKey`}>
              <CardActionArea
                onClick={() => {
                  onSelectQS(Number(sequence.id));
                }}
              >
                <Typography
                  variant="h6"
                  color="textSecondary"
                  sx={{ pl: 2, pt: 1 }}
                >
                  <strong>{`ID: ${sequence?.id}`}</strong>
                </Typography>
                <Typography sx={{ pl: 2 }}>
                  {`Название: ${sequence?.name}`}
                </Typography>

                <Typography sx={{ pl: 2 }}>
                  {sequence?.description
                    ? `Описание: ${sequence?.description}`
                    : "Описание отсутствует"}
                </Typography>

                <Stack
                  sx={{ pl: 2, pr: 2, mb: 2, pt: 1, overflowY: "auto" }}
                  spacing={2}
                  direction={"row"}
                >
                  {sequence?.sequenceData?.sequence?.map(
                    (question_id, qIndex) => (
                      <Card
                        sx={{ pl: 1, pr: 1 }}
                        style={{ borderColor: "#2296F3" }}
                        variant="outlined"
                        key={`${sequence?.id}SequenceKey${qIndex}QuestionKey`}
                      >
                        {question_id}
                      </Card>
                    ),
                  )}
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  ),
);
