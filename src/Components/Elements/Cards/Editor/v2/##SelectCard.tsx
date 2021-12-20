import {observer} from "mobx-react";
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {MainCardPublicView} from "../../../../PublicPages/MainCardPublicView";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import Popover from '@mui/material/Popover';
import CardMicroView from "../../CardView/#CardMicroView";
import {toJS} from "mobx";
import {Fab} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ISelectCardProps extends React.HTMLAttributes<HTMLDivElement>{
    card_direction: "cardBefore"| "cardDown" | "cardNext" | "cardUp"
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const SelectCard = observer(({card_direction, ...props}: ISelectCardProps) =>{
    const [openCardSelector, setOpenCardSelector] = React.useState(false);
    const [openPopover, setOpenPopover] = React.useState(false);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if(String(toJS(CESObject.getField(card_direction, ""))).length > 0){
            setOpenPopover(true)
            setPopoverAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setOpenPopover(false)
        setPopoverAnchorEl(null);
    };

    const handleClickOpenSelectCard = () => {
        setOpenCardSelector(true);
    };

    const handleCloseSelectCard = () => {
        setOpenCardSelector(false);
    };
    return(
        <div {...props}>
            <Button onMouseEnter={handlePopoverOpen}
                    // onMouseLeave={handlePopoverClose}
                    variant="outlined" onClick={handleClickOpenSelectCard}>
                {CESObject.getField(card_direction, "") ?
                    "Выбрана карточка c ID:" + CESObject.getField(card_direction, ""):
                "Нажмите для выбора карточки"}
            </Button>
            <Fab size="small" color="inherit"
                 onClick={() => window.open("https://www.sw-university.com/card/" +
                     CESObject.getField(card_direction, ""), "_blank")}
                 disabled={!CESObject.getField(card_direction, "")}
                 sx={{color: "gray", bgcolor: 'neutral', ml: 2}} >
                <OpenInNewIcon />
            </Fab>
            <Popover
                open={openPopover}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <CardMicroView cardID={CESObject.getField(card_direction, "")}/>
            </Popover>
            <Dialog
                fullScreen
                open={openCardSelector}
                onClose={handleCloseSelectCard}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseSelectCard}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Нажмите на карточку, чтобы выбрать ее
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseSelectCard}>
                            Закрыть
                        </Button>
                    </Toolbar>
                </AppBar>
                <MainCardPublicView onlyCardSelectionMode={true} onCardSelect={(selected_card_id: number) =>{
                    CESObject.changeFieldByValue(card_direction, selected_card_id)
                    handleCloseSelectCard()
                }}/>
            </Dialog>
        </div>
    )
})