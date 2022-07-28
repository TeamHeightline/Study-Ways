import {observer} from "mobx-react";
import React from 'react';
import {Button, Divider, FormControl, InputLabel, ListItemIcon, Menu, MenuItem, Select} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Routes from "@mui/material/Switch";
import CopyrightIcon from "@mui/icons-material/Copyright";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HttpIcon from "@mui/icons-material/Http";
import ImageIcon from "@mui/icons-material/Image";
import CodeIcon from "@mui/icons-material/Code";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {CESObject,} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

export const CMenu = observer(({...props}) => {
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
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem>
                        <FormControl fullWidth variant="filled">
                            <InputLabel>
                                Основной контент
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={CESObject.getField("cardContentType", "A_0")}
                                onChange={CESObject.changeField("cardContentType")}
                            >
                                <MenuItem value={"A_0"}><YouTubeIcon/> {" Видео Youtube"}</MenuItem>
                                <MenuItem value={"A_1"}><HttpIcon/>{" Внешний ресурс"}</MenuItem>
                                <MenuItem value={"A_2"}><ImageIcon/>{" Изображение"}</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                    <Divider/>

                    <MenuItem onClick={CESObject.changeField("isCardUseCopyright", "checked")}>
                        <Routes
                            checked={CESObject.getField("isCardUseCopyright", false)}
                            onChange={CESObject.changeField("isCardUseCopyright", "checked")}
                            color="secondary"
                        />
                        <ListItemIcon>
                            <CopyrightIcon/>
                        </ListItemIcon>
                        Авторское право
                    </MenuItem>

                    <MenuItem onClick={CESObject.changeField("isCardUseArrowNavigation", "checked")}>
                        <Routes
                            checked={CESObject.getField("isCardUseArrowNavigation", false)}
                            onChange={CESObject.changeField("isCardUseArrowNavigation", "checked")}
                            color="secondary"
                        />
                        <ListItemIcon>
                            <CodeIcon/>
                        </ListItemIcon>
                        Авторская навигация
                    </MenuItem>

                    {/*<Divider/>*/}
                    {/*<MenuItem onClick={CESObject.changeField("isCardUseAdditionalText", "checked")}>*/}
                    {/*    <Routes*/}
                    {/*        checked={CESObject.getField("isCardUseAdditionalText", false)}*/}
                    {/*        onChange={CESObject.changeField("isCardUseAdditionalText", "checked")}*/}
                    {/*        name="checkedB"*/}
                    {/*        color="secondary"*/}
                    {/*    />*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <CreateIcon/>*/}
                    {/*    </ListItemIcon>*/}
                    {/*    Дополнительный текст*/}
                    {/*</MenuItem>*/}
                    <Divider/>
                    <MenuItem onClick={CESObject.changeField("isCardUseTestInCard", "checked")}>
                        <Routes
                            checked={CESObject.getField("isCardUseTestInCard", false)}
                            onChange={CESObject.changeField("isCardUseTestInCard", "checked")}
                            name="checkedB"
                            color="secondary"
                        />
                        <ListItemIcon>
                            <DoneAllIcon/>
                        </ListItemIcon>
                        Тест в карточке
                    </MenuItem>
                    <MenuItem onClick={CESObject.changeField("isCardUseTestBeforeCard", "checked")}>
                        <Routes
                            checked={CESObject.getField("isCardUseTestBeforeCard", false)}
                            onChange={CESObject.changeField("isCardUseTestBeforeCard", "checked")}
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
        </div>
    )
})