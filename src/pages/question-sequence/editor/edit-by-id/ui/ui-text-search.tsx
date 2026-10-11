import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Paper } from '@mui/material';
type IUITextSearchProps = PaperProps;
const UITextSearch = ({ ...props }: IUITextSearchProps) => (
  <Paper elevation={0} {...props}></Paper>
);
export default UITextSearch;
