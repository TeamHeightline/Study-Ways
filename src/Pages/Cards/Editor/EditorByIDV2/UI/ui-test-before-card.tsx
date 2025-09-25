import { observer } from "mobx-react";
import React from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { CESObject } from "../Store/CardEditorStorage";

type ITestBeforeCardProps = React.HTMLAttributes<HTMLDivElement>;

export const UiTestBeforeCard = observer(
  ({ ...props }: ITestBeforeCardProps) => (
    <div {...props}>
      <Stack direction={"column"}>
        <TextField
          type="number"
          label="ID вопроса перед карточкой"
          variant={"outlined"}
          value={CESObject.getField("test_before_card_id", "")}
          onChange={CESObject.changeField("test_before_card_id")}
        />
        {CESObject.testBeforeCardData && (
          <div>
            <Typography variant={"h6"}>
              ID: {CESObject?.testBeforeCardData?.id}
            </Typography>
            <Typography variant={"body1"}>
              Текст: {CESObject?.testBeforeCardData?.text}
            </Typography>
          </div>
        )}
      </Stack>
    </div>
  ),
);
