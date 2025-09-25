import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper } from "@mui/material";

type IUITextSearchProps = PaperProps;

const UITextSearch = observer(({ ...props }: IUITextSearchProps) => (
  <Paper elevation={0} {...props}></Paper>
));

export default UITextSearch;
