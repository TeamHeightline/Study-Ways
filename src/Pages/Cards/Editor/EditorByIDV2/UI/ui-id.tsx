import { observer } from "mobx-react";
import React from "react";
import Typography from "@mui/material/Typography";
import { CESObject } from "../Store/CardEditorStorage";

type IIDProps = React.HTMLAttributes<HTMLDivElement>;

export const ID = observer(({ ...props }: IIDProps) => (
  <div {...props}>
    <Typography variant="h5" color="textPrimary" style={{ marginTop: 12 }}>
      {`ID: ${CESObject.getField("id", "")}`}
    </Typography>
  </div>
));
