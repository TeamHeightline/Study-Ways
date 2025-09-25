import { observer } from "mobx-react";
import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
import { SASObject } from "../Store/SelectAttemptStore";

type IExamModeProps = React.HTMLAttributes<HTMLDivElement>;
export const ExamMode = observer(({ ...props }: IExamModeProps) => (
  <div {...props}>
    <FormControlLabel
      sx={{ pl: 1 }}
      control={
        <Switch
          checked={SASObject?.onlyInExam}
          onChange={(e) => (SASObject.onlyInExam = e.target.checked)}
          color="primary"
        />
      }
      label="Только режим экзамена"
    />
  </div>
));
