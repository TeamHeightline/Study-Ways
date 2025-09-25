import { observer } from "mobx-react";
import React from "react";
import {
  FormControl,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { QuestionEditorStorage } from "../Store/QuestionEditorStorage";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";

export const UiNumberOfShowingAnswers = observer(() => {
  const isMobile = isMobileHook();
  return (
    <div>
      <Stack direction={isMobile ? "column" : "row"} alignItems={"center"}>
        <Typography variant={"body1"}>
          Количество отображаемых ответов
        </Typography>
        <FormControl variant="outlined">
          <TextField
            sx={{ minWidth: 100, pl: 1 }}
            select
            label="От 2 до 12"
            fullWidth
            value={QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers}
            onChange={(e) => {
              QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers =
                String(e.target.value);
            }}
          >
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
            <MenuItem value={"4"}>4</MenuItem>
            <MenuItem value={"5"}>5</MenuItem>
            <MenuItem value={"6"}>6</MenuItem>
            <MenuItem value={"7"}>7</MenuItem>
            <MenuItem value={"8"}>8</MenuItem>
            <MenuItem value={"9"}>9</MenuItem>
            <MenuItem value={"10"}>10</MenuItem>
            <MenuItem value={"11"}>11</MenuItem>
            <MenuItem value={"12"}>12</MenuItem>
          </TextField>
        </FormControl>
      </Stack>
    </div>
  );
});
