import { Card, Chip, Paper, Stack, Typography } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { sequenceDataI } from "../../../../../Shared/ServerLayer/Types/question-sequence.type";
import {
  RootState,
  useAppDispatch,
} from "../../../../../App/ReduxStore/RootStore";
import { loadQSDataThunk } from "../redux-store/async-actions";

type ISelectedQSByDataProps = PaperProps;

export default function SelectedQSByData({ ...props }: ISelectedQSByDataProps) {
  const sequenceData: sequenceDataI | null | undefined = useSelector(
    (state: RootState) => state?.examEditor?.selected_qs_data,
  );
  const selectedQSID = useSelector(
    (state: RootState) => state?.examEditor?.exam_data?.question_sequence_id,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedQSID) {
      dispatch(loadQSDataThunk(String(selectedQSID)));
    }
  }, [selectedQSID]);

  if (sequenceData?.id != selectedQSID || selectedQSID == undefined) {
    return <div />;
  }
  return (
    <Paper elevation={0} {...props}>
      <Card variant="outlined">
        <Typography variant="h6" color="textSecondary" sx={{ pl: 2, pt: 1 }}>
          <strong>{`ID: ${sequenceData?.id}`}</strong>
        </Typography>
        <Typography sx={{ pl: 2 }}>
          {`Название: ${sequenceData?.name}`}
        </Typography>

        <Typography sx={{ pl: 2 }}>
          {sequenceData?.description
            ? `Описание: ${sequenceData?.description}`
            : "Описание отсутствует"}
        </Typography>

        <Stack
          sx={{ pl: 2, pr: 2, mb: 2, pt: 1, overflowY: "auto" }}
          spacing={2}
          direction={"row"}
        >
          {sequenceData?.sequence_data?.sequence?.map((question_id, qIndex) => (
            <Chip
              label={question_id || ""}
              variant="outlined"
              key={`${qIndex}QuestionKey`}
            />
          ))}
        </Stack>
      </Card>
    </Paper>
  );
}
