import { observer } from "mobx-react";
import React from "react";
import { CSSObject } from "../Store/CardSelectorStore";
import TreeSelect from "antd/es/tree-select";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

export const ConnectedThemes = observer(() => {
  const tProps = {
    treeDataSimpleMode: true,
    treeData: CSSObject.connectedThemesForSelector,
    value: CSSObject.cardConnectedTheme,
    onChange: (data) => {
      CSSObject.cardConnectedTheme = data;
    },
    disabled: !CSSObject.connectedThemesHasBeenLoaded,
    placeholder: "Выбирите тему карточки",
    style: {
      width: "100%",
    },
  };
  return (
    <Paper elevation={0} sx={{ width: "100%", backgroundColor: "transparent" }}>
      <Stack direction={"row"}>
        <TreeSelect {...tProps} size={"large"} />
        <IconButton
          disabled={!CSSObject.cardConnectedTheme}
          onClick={() => (CSSObject.cardConnectedTheme = undefined)}
        >
          <ClearIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
});
