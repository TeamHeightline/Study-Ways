import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper, TextField } from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";

type IUIQSDescriptionProps = PaperProps;

const UIQSDescription = observer(({ ...props }: IUIQSDescriptionProps) => (
  <Paper elevation={0} {...props}>
    <TextField
      value={editQSStore.qsData?.description}
      onChange={editQSStore.changeQSDescription}
      size="small"
      label="Описание серии вопросов"
      variant="outlined"
      fullWidth
    />
  </Paper>
));

export default UIQSDescription;
