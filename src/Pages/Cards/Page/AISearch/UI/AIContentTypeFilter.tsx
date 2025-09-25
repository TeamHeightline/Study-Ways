import { observer } from "mobx-react";
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AISObject } from "../Store/AISearch";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HttpIcon from "@mui/icons-material/Http";
import ImageIcon from "@mui/icons-material/Image";

type IContentTypeProps = React.HTMLAttributes<HTMLDivElement>;

export const ContentType = observer(({ ...props }: IContentTypeProps) => (
  <FormControl fullWidth size={"small"}>
    <InputLabel>Тип карточки:</InputLabel>
    <Select
      fullWidth
      style={{ width: "100%", maxWidth: 600 }}
      label="Тип карточки:"
      value={AISObject.contentType}
      onChange={AISObject.changeContentType}
    >
      <MenuItem value={"undefined"}>
        <DoneAllIcon style={{ marginRight: 12 }} fontSize="small" />
        Все типы
      </MenuItem>
      <MenuItem value={"0"}>
        <YouTubeIcon style={{ marginRight: 12 }} fontSize="small" />
        YouTube
      </MenuItem>
      <MenuItem value={"1"}>
        <HttpIcon style={{ marginRight: 12 }} fontSize="small" />
        Внешний ресурс
      </MenuItem>
      <MenuItem value={"2"}>
        <ImageIcon style={{ marginRight: 12 }} fontSize="small" />
        Изображение
      </MenuItem>
    </Select>
  </FormControl>
));
