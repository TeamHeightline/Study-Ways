import { observer } from "mobx-react";
import { QuestionEditorStorage } from "../Store/QuestionEditorStorage";
import { Button, Typography } from "@mui/material";
import React from "react";
import Paper from "@mui/material/Paper";

export const ImageForQuestion = observer(() => (
  <Paper elevation={0}>
    {QuestionEditorStorage.questionHasBeenSelected && (
      <div>
        <Button color="primary" variant="outlined" component="label">
          <input
            type="file"
            hidden
            name="file"
            onChange={(fileData) =>
              QuestionEditorStorage.uploadNewQuestionImage(fileData)
            }
          />
          Изображение для вопроса
        </Button>
        <Typography>
          {QuestionEditorStorage.QuestionImageName.length > 31
            ? `${QuestionEditorStorage.QuestionImageName.slice(0, 30)}...`
            : QuestionEditorStorage.QuestionImageName}
        </Typography>
      </div>
    )}
  </Paper>
));
