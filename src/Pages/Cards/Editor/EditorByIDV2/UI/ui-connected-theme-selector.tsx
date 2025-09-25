import { observer } from "mobx-react";
import React, { useState } from "react";
import TreeSelect from "antd/es/tree-select";
import { CESObject } from "../Store/CardEditorStorage";
import { toJS } from "mobx";

type IConnectedThemeSelectorProps = React.HTMLAttributes<HTMLDivElement>;

const { SHOW_CHILD } = TreeSelect;

export const UiConnectedThemeSelector = observer(
  ({ ...props }: IConnectedThemeSelectorProps) => {
    const value = toJS(CESObject.card_object?.connectedTheme || []).map(
      (theme) => String(theme),
    );
    const changeValue = (themesArray: string[]) => {
      const uniqThemes = [...new Set(themesArray)];
      CESObject.changeFieldByValue("connectedTheme", uniqThemes);
    };

    const tProps = {
      treeDataSimpleMode: true,
      treeData: toJS(CESObject.connectedThemesForSelector),
      value,
      onChange: changeValue,
      multiple: true,
      showSearch: false,
      showCheckedStrategy: SHOW_CHILD,
      disabled: !CESObject.isAllConnectedThemesLoaded,
      placeholder: "Выберите тему карточки",
      // bordered: true,
      style: {
        width: "100%",
      },
    };
    return (
      <div {...props}>
        <TreeSelect {...tProps} size={"large"} />
      </div>
    );
  },
);
