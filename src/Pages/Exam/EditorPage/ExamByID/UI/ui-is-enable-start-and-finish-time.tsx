import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import React from "react";

type IUIIsEnableStartAndFinishTimeProps = BoxProps;

export default function UIIsEnableStartAndFinishTime({
  ...props
}: IUIIsEnableStartAndFinishTimeProps) {
  return (
    <Box {...props}>
      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label="Начало и конец в определенное время"
      />
    </Box>
  );
}
