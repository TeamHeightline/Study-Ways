import React from 'react'
import {Button, Divider, FormControl, InputLabel, ListItemIcon, Menu, MenuItem, Select} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import Switch from "@material-ui/core/Switch";
import YouTubeIcon from "@material-ui/icons/YouTube";
import CreateIcon from "@material-ui/icons/Create";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CopyrightIcon from '@material-ui/icons/Copyright';
import HttpIcon from '@material-ui/icons/Http';
import ImageIcon from '@material-ui/icons/Image';

export default function CardEditMenu({ mainContentType, mainContentTypeHandle, isUseAdditionalTextHandle,
                                         isUseAdditionalText, isUseBodyQuestionHandle, isUseBodyQuestion,
                                         isUseBeforeCardQuestionHandle, isUseBeforeCardQuestion, isUseCopyright,
                                         setIsUseCopyright, autoSave}: any){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const isUseCopyrightHandle = () =>{
        autoSave()
        setIsUseCopyright(!isUseCopyright)
    }

    return(
        <div>
            <Button
                className="mt-2"
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
                <MenuItem onClick={isUseCopyrightHandle}>
                    <Switch
                        checked={isUseCopyright}
                        onChange={isUseCopyrightHandle}
                        color="secondary"
                    />
                    <ListItemIcon>
                        <CopyrightIcon/>
                    </ListItemIcon>
                    Авторское право
                </MenuItem>
                <Divider/>
                <MenuItem>
                    <FormControl fullWidth variant="filled">
                        <InputLabel>
                            Основной контент
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={mainContentType}
                            onChange={mainContentTypeHandle}
                        >
                            <MenuItem value={0}><YouTubeIcon/> {" Видео Youtube"}</MenuItem>
                            <MenuItem value={1}><HttpIcon/>{" Внешний ресурс"}</MenuItem>
                            <MenuItem value={2}><ImageIcon/>{" Изображение"}</MenuItem>
                        </Select>
                    </FormControl>
                </MenuItem>


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