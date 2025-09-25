import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Chip, Paper } from "@mui/material";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";

interface ITitleHardLevelProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}

const TitleHardLevel = observer(
  ({ answer_object, ...props }: ITitleHardLevelProps) => {
    const hardLevel = answer_object.answer_object?.hardLevelOfAnswer;
    return (
      <Paper elevation={0} {...props}>
        {hardLevel == "EASY" && (
          <Chip
            icon={<Filter1Icon />}
            onClick={answer_object.changeHardLevelSimpleMode}
            clickable
            variant={"outlined"}
            label={"Очевидный"}
            color={"success"}
          />
        )}
        {hardLevel == "MEDIUM" && (
          <Chip
            icon={<Filter2Icon />}
            onClick={answer_object.changeHardLevelSimpleMode}
            clickable
            variant={"outlined"}
            label={"Нормальный"}
            color={"info"}
          />
        )}
        {hardLevel == "HARD" && (
          <Chip
            icon={<Filter3Icon />}
            onClick={answer_object.changeHardLevelSimpleMode}
            clickable
            variant={"outlined"}
            label={"Каверзный"}
            color={"warning"}
          />
        )}
      </Paper>
    );
  },
);

export default TitleHardLevel;
