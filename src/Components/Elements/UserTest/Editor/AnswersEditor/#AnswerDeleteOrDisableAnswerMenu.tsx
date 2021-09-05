import {observer} from "mobx-react";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";


export const AnswerDeleteOrDisableAnswerMenu = observer(({answer}) =>{


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return(
        <div>
            <div>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem key={0} value="Delete" onClick={() => answer.openDeleteDialog = !answer.openDeleteDialog}>
                        Удалить
                    </MenuItem>
                    <MenuItem key={1} value="Make Invisible" onClick={() => answer.openMakeInvisibleDialog = !answer.openMakeInvisibleDialog}>
                        Скрыть
                    </MenuItem>
                    <MenuItem key={2} value="Create new answer based on this answer" onClick={() => answer.createNewAnswerBasedOnThisAnswer()}>
                        Создать новый ответ на основе этого
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )
})