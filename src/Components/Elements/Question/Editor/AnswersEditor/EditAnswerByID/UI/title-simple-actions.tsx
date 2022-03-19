import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface ITitleSimpleActionsProps extends PaperProps {
    answer_object: answer_object_type

}

const TitleSimpleActions = observer(({answer_object}: ITitleSimpleActionsProps) => {
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
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem key={0} value="Delete" onClick={() => {
                        answer_object.isOpenDeleteDialog = !answer_object.isOpenDeleteDialog
                        handleClose()
                    }}>
                        Удалить
                    </MenuItem>
                    {/*<MenuItem key={1} value="Make Invisible" onClick={() => {*/}
                    {/*    answer_object.openMakeInvisibleDialog = !answer_object.openMakeInvisibleDialog*/}
                    {/*    handleClose()*/}
                    {/*}}>*/}
                    {/*    Скрыть*/}
                    {/*</MenuItem>*/}
                    <MenuItem key={2} value="Create new answer based on this answer" onClick={() => {
                        answer_object.createNewAnswerBasedOnExist()
                        handleClose()
                    }}>
                        Создать копию
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
})

export default TitleSimpleActions