import React from 'react'
import {Button, Divider, ListItemIcon, Menu, MenuItem, Select} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import Switch from "@material-ui/core/Switch";
import YouTubeIcon from "@material-ui/icons/YouTube";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import CreateIcon from "@material-ui/icons/Create";
import DoneAllIcon from "@material-ui/icons/DoneAll";

export default function CardEditMenu({isUseMainContentHandler, isUseMainContent, mainContentType, mainContentTypeHandle,
                                         isUseMainTextHandle, isUseMainText, isUseAdditionalTextHandle,
                                         isUseAdditionalText, isUseBodyQuestionHandle, isUseBodyQuestion,
                                         isUseBeforeCardQuestionHandle, isUseBeforeCardQuestion}: any){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <div>
            <Button
                className="ml-5 mt-2"
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="outlined"
                color="primary"
                onClick={handleClick}
            >
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>
                Настроить содержимое
            </Button>
            <Menu
                id="customized-menu"
                anchorEl={anchorEl}
                // keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={isUseMainContentHandler}>
                    <Switch
                        checked={isUseMainContent}
                        onChange={isUseMainContentHandler}
                        name="checkedB"
                        color="secondary"
                    />
                    <ListItemIcon>
                        <YouTubeIcon/>
                    </ListItemIcon>
                    Основной контент
                </MenuItem>
                {isUseMainContent?
                    <div>
                        <MenuItem>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={mainContentType}
                                onChange={mainContentTypeHandle}
                                className="col-11 ml-3"
                            >
                                <MenuItem value={0}>Видео с Youtube</MenuItem>
                                <MenuItem value={1}>Ссылка на внешний ресурс</MenuItem>
                                <MenuItem value={2}>Изображение</MenuItem>
                            </Select>
                        </MenuItem>
                        <MenuItem onClick={isUseMainTextHandle}>
                            <Switch
                                checked={isUseMainText}
                                onChange={isUseMainTextHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <TextFieldsIcon/>
                            </ListItemIcon>
                            Основной текст
                        </MenuItem>
                    </div>
                    : null}
                <Divider/>
                <MenuItem onClick={isUseAdditionalTextHandle}>
                    <Switch
                        checked={isUseAdditionalText}
                        onChange={isUseAdditionalTextHandle}
                        name="checkedB"
                        color="secondary"
                    />
                    <ListItemIcon>
                        <CreateIcon/>
                    </ListItemIcon>
                    Дополнительный текст
                </MenuItem>
                <Divider/>
                <MenuItem onClick={isUseBodyQuestionHandle}
                >
                    <Switch
                        checked={isUseBodyQuestion}
                        onChange={isUseBodyQuestionHandle}
                        name="checkedB"
                        color="secondary"
                    />
                    <ListItemIcon>
                        <DoneAllIcon/>
                    </ListItemIcon>
                    Тест в карточке
                </MenuItem>
                <MenuItem onClick={isUseBeforeCardQuestionHandle}
                >
                    <Switch
                        checked={isUseBeforeCardQuestion}
                        onChange={isUseBeforeCardQuestionHandle}
                        name="checkedB"
                        color="secondary"
                    />
                    <ListItemIcon>
                        <DoneAllIcon/>
                    </ListItemIcon>
                    Тест перед карточкой
                </MenuItem>
            </Menu>
        </div>
    )
}