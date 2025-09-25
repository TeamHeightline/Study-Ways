import { observer } from "mobx-react";
import React from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Routes from "@mui/material/Switch";
import CopyrightIcon from "@mui/icons-material/Copyright";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HttpIcon from "@mui/icons-material/Http";
import ImageIcon from "@mui/icons-material/Image";
import CodeIcon from "@mui/icons-material/Code";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { CESObject } from "../Store/CardEditorStorage";

export const UiCMenu = observer(({ ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div {...props}>
      <div>
        <Button
          size={"large"}
          variant="outlined"
          color="primary"
          onClick={handleClick}
          startIcon={<SettingsIcon />}
        >
          {/* <ListItemIcon>*/}
          {/*    <SettingsIcon/>*/}
          {/* </ListItemIcon>*/}
          Настроить содержимое
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <FormControl fullWidth variant="filled">
              <InputLabel>Основной контент</InputLabel>
              <Select
                value={CESObject.getField("card_content_type", 0)}
                onChange={CESObject.changeField("card_content_type")}
              >
                <MenuItem value={0}>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <YouTubeIcon />
                    <div>{" Видео Youtube"}</div>
                  </Stack>
                </MenuItem>
                <MenuItem value={1}>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <HttpIcon />
                    <div>{" Внешний ресурс"}</div>
                  </Stack>
                </MenuItem>
                <MenuItem value={2}>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <ImageIcon />
                    <div>{" Изображение"}</div>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          <Divider />

          <MenuItem
            onClick={CESObject.changeField("is_card_use_copyright", "checked")}
          >
            <Routes
              checked={CESObject.getField("is_card_use_copyright", false)}
              onChange={CESObject.changeField(
                "is_card_use_copyright",
                "checked",
              )}
              color="secondary"
            />
            <ListItemIcon>
              <CopyrightIcon />
            </ListItemIcon>
            Авторское право
          </MenuItem>

          <MenuItem
            onClick={CESObject.changeField(
              "is_card_use_arrow_navigation",
              "checked",
            )}
          >
            <Routes
              checked={CESObject.getField(
                "is_card_use_arrow_navigation",
                false,
              )}
              onChange={CESObject.changeField(
                "is_card_use_arrow_navigation",
                "checked",
              )}
              color="secondary"
            />
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            Авторская навигация
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={CESObject.changeField("test_in_card_id", "checked")}
          >
            <Routes
              checked={CESObject.getField("test_in_card_id", false)}
              onChange={CESObject.changeField("test_in_card_id", "checked")}
              name="checkedB"
              color="secondary"
            />
            <ListItemIcon>
              <DoneAllIcon />
            </ListItemIcon>
            Тест в карточке
          </MenuItem>
          <MenuItem
            onClick={CESObject.changeField("test_before_card_id", "checked")}
          >
            <Routes
              checked={CESObject.getField("test_before_card_id", false)}
              onChange={CESObject.changeField("test_before_card_id", "checked")}
              name="checkedB"
              color="secondary"
            />
            <ListItemIcon>
              <DoneAllIcon />
            </ListItemIcon>
            Тест перед карточкой
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
});
