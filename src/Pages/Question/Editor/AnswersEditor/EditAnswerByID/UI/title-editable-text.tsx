import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper, Stack, Typography } from "@mui/material";
import { isMobileHook } from "../../../../../../Shared/CustomHooks/isMobileHook";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";
import AnswerText from "./answer-text";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

interface ITitleEditableTextProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}

const TitleEditableText = observer(
  ({ answer_object, ...props }: ITitleEditableTextProps) => {
    const isMobile = isMobileHook();

    return (
      <Paper elevation={0} {...props}>
        {!answer_object.isEditTextInSimpleMode ? (
          <Stack direction={"row"} alignItems={"center"}>
            <Typography
              sx={{ userSelect: "none" }}
              onClick={answer_object.edittextInSimpleMode}
              variant={isMobile ? "body1" : "h6"}
              color="inherit"
            >
              {answer_object.answer_object?.text
                ? answer_object.answer_object?.text
                : "Кликните, чтобы редактировать"}
            </Typography>
            <IconButton onClick={answer_object.edittextInSimpleMode}>
              <EditIcon />
            </IconButton>
          </Stack>
        ) : (
          <div style={{ minWidth: isMobile ? undefined : 750 }}>
            <AnswerText answer_object={answer_object} />
          </div>
        )}
      </Paper>
    );
  },
);

export default TitleEditableText;
