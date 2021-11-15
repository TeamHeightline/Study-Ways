import React from 'react'
import {Button, Divider, FormControl, InputLabel, ListItemIcon, Menu, MenuItem, Select} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Switch from "@mui/material/Switch";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CreateIcon from "@mui/icons-material/Create";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CopyrightIcon from '@mui/icons-material/Copyright';
import HttpIcon from '@mui/icons-material/Http';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import Filter3Icon from '@mui/icons-material/Filter3';
export default function CardEditMenu({ mainContentType, mainContentTypeHandle, isUseAdditionalTextHandle,
                                         isUseAdditionalText, isUseBodyQuestionHandle, isUseBodyQuestion,
                                         isUseBeforeCardQuestionHandle, isUseBeforeCardQuestion, isUseCopyright,
                                         setIsUseCopyright, autoSave, isUseArrowNavigation, setIsUseArrowNavigation}: any){
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
    const isUseArrowNavigationHandler = () =>{
        autoSave()
        setIsUseArrowNavigation(!isUseArrowNavigation)
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
                {/*<MenuItem onClick={isUseCopyrightHandle}>*/}
                {/*    <Switch*/}
                {/*        checked={isUseCopyright}*/}
                {/*        onChange={isUseCopyrightHandle}*/}
                {/*        color="secondary"*/}
                {/*    />*/}
                {/*    <ListItemIcon>*/}
                {/*        <Filter3Icon/>*/}
                {/*    </ListItemIcon>*/}
                {/*    Уровень сложности*/}
                {/*</MenuItem>*/}
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

                <MenuItem onClick={isUseArrowNavigationHandler}>
                    <Switch
                        checked={isUseArrowNavigation}
                        onChange={isUseArrowNavigationHandler}
                        color="secondary"
                    />
                    <ListItemIcon>
                        <CodeIcon/>
                    </ListItemIcon>
                    Авторская навигация
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