import {observer} from "mobx-react";
import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {CardSelector} from "../../Selector/UI/CardSelector";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface ICardSelectorForArrowProps extends React.HTMLAttributes<HTMLDivElement> {

}

const UiCardSelectorForArrowNavigation = observer(({...props}: ICardSelectorForArrowProps) => {
    return (
        <div {...props}>
            <AppBar position={"relative"}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={CESObject.onCloseSelectCard}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Нажмите на карточку, чтобы выбрать ее
                    </Typography>
                    <Button autoFocus color="inherit" onClick={CESObject.onCloseSelectCard}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <CardSelector
                id={"select-card-from-arrow-nav"}
                onCardSelect={CESObject.onCardSelect}/>
        </div>
    )
})

export default UiCardSelectorForArrowNavigation
