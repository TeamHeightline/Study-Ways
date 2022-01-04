import {observer} from "mobx-react";
import React from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


export const AnswerDeleteOrDisableAnswerMenu = observer(({answer}) =>{


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div>
            <div>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="large">
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem key={0} value="Delete" onClick={() => {
                        answer.openDeleteDialog = !answer.openDeleteDialog
                        handleClose()
                    }}>
                        Удалить
                    </MenuItem>
                    <MenuItem key={1} value="Make Invisible" onClick={() => {
                        answer.openMakeInvisibleDialog = !answer.openMakeInvisibleDialog
                        handleClose()
                    }}>
                        Скрыть
                    </MenuItem>
                    <MenuItem key={2} value="Create new answer based on this answer" onClick={() => {
                        answer.createNewAnswerBasedOnThisAnswer()
                        handleClose()
                    }}>
                        Создать копию
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
})