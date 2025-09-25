import { Grid, Paper } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";
import Card from "@mui/material/Card";
import React from "react";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";
import UIQuestionImage from "./ui-question-image";
import UIQuestionText from "./ui-question-text";

type IUIQuestionProps = PaperProps;

export default function UIQuestion({ ...props }: IUIQuestionProps) {
  const isMobile = isMobileHook();
  window.addEventListener("keydown", function (e) {
    if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
      e.preventDefault();
    }
  });

  return (
    <Paper elevation={0} {...props}>
      <Card
        variant="outlined"
        sx={{
          padding: 0,
          maxHeight: isMobile ? "100%" : 510,
          overflowY: "auto",
          width: "100%",
        }}
      >
        <Grid container justifyContent={"center"}>
          <UIQuestionImage />
          <UIQuestionText />
        </Grid>
      </Card>
    </Paper>
  );
}
