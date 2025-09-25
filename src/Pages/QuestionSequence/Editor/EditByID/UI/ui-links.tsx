import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper, Stack, Typography } from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";

type IUILinksProps = PaperProps;

const UILinks = observer(({ ...props }: IUILinksProps) => (
  <Paper elevation={0} {...props}>
    <Stack direction={"column"} spacing={2}>
      <Typography variant={"body2"} sx={{ color: "white" }}>
        {`Режим обучения - https://sw-university.com/qs/${editQSStore?.QuestionSequenceID}`}
      </Typography>
      <Typography variant="body2" sx={{ color: "white" }}>
        {`Режим экзамена - https://sw-university.com/qs/${editQSStore?.QuestionSequenceID}?exam=true`}
      </Typography>
    </Stack>
  </Paper>
));

export default UILinks;
