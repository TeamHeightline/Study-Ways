import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper, Stack, Typography } from "@mui/material";

type IUIPageTitleProps = PaperProps;

const UIPageTitle = observer(({ ...props }: IUIPageTitleProps) => (
  <Paper elevation={0} {...props}>
    <Stack alignItems={"center"} sx={{ mt: 4, mb: 4 }}>
      <Typography variant={"h4"}>Редактор экзамена</Typography>
    </Stack>
  </Paper>
));

export default UIPageTitle;
