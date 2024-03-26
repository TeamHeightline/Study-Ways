import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import {useNavigate} from "react-router-dom";


interface IGoToTestButtonProps extends PaperProps {
    card_store: CardByIDStore

}

const GoToTestButton = observer(({card_store, ...props}: IGoToTestButtonProps) => {

    const navigate = useNavigate()

    const onGoToTestButtonClick = () => {
        navigate("/iq/" + card_store.card_data?.testInCard?.id)
    }

    return (
        <Paper elevation={0} {...props}>
            {card_store.card_data?.isCardUseTestInCard && card_store.card_data?.testInCard?.id &&
                <Button sx={{mb: 1}} color={"error"} fullWidth variant={"contained"} onClick={onGoToTestButtonClick}>
                    К тесту
                </Button>}
        </Paper>
    )
})

export default GoToTestButton
