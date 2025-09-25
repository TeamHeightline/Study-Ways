import { observer } from "mobx-react";
import React from "react";
import { toJS } from "mobx";
import { InputAdornment, TextField } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { SASObject } from "../Store/SelectAttemptStore";

type IUserNameProps = React.HTMLAttributes<HTMLDivElement>;
export const UserName = observer(({ ...props }: IUserNameProps) => (
  <div {...props}>
    <TextField
      value={toJS(SASObject.userName)}
      onChange={async (e) => (SASObject.userName = e.target.value)}
      label="Имя пользователя"
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        ),
      }}
    />
  </div>
));
