import { observer } from "mobx-react";
import React from "react";
import { Grid, TextField } from "@mui/material";
import { CSSObject } from "../Store/CardSelectorStore";

type ICleverSearchingProps = React.HTMLAttributes<HTMLDivElement>;

export const CleverSearching = observer(
  ({ ...props }: ICleverSearchingProps) => (
    <div {...props}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <TextField
            value={CSSObject.searching_string}
            onChange={CSSObject.changeSearchString}
            fullWidth
            label="Поиск"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  ),
);
