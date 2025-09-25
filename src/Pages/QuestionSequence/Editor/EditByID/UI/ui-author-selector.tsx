import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";

type IUIAuthorSelectorProps = PaperProps;

const UIAuthorSelector = observer(({ ...props }: IUIAuthorSelectorProps) => (
  <Paper elevation={0} {...props}>
    <FormControl fullWidth sx={{ width: 200 }}>
      <InputLabel>Автор</InputLabel>
      <Select
        value={editQSStore.selectedAuthorID}
        label="Автор"
        onChange={editQSStore.changeSelectedAuthorID}
      >
        <MenuItem value={"-1"}>Все</MenuItem>
        {editQSStore.questionAuthors.map((authorObj) => (
          <MenuItem value={authorObj.user_id} key={authorObj.user_id}>
            {authorObj.firstname} {authorObj.lastname}
            {!authorObj.firstname && !authorObj.lastname && "Неизвестный автор"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Paper>
));

export default UIAuthorSelector;
