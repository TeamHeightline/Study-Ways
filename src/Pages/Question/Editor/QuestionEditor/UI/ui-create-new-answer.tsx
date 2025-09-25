import { observer } from "mobx-react";
import { QuestionEditorStorage } from "../Store/QuestionEditorStorage";
import { Button } from "@mui/material";
import React from "react";

export const CreateNewAnswer = observer(() => (
  <>
    {QuestionEditorStorage.questionHasBeenSelected && (
      <Button
        variant="outlined"
        color="primary"
        className="col-12 mt-3 justify-content-center"
        size="large"
        onClick={() => QuestionEditorStorage.createNewAnswer()}
      >
        Создать новый ответ
      </Button>
    )}
  </>
));
