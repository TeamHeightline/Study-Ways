import {observer} from "mobx-react";
import React from 'react';
import {Alert, Button, Stack} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";

interface IProps {
    card_store: CardByIDStore

}

const GoToTestDialog = observer(({card_store}: IProps) => {
    const onCloseButtonClick = () => {
        card_store.isOpenGoToTestDialogAfterVideo = false
    }

    const onGoToTestButtonClick = () => {
        console.log("testing time")
        if (!!card_store?.testElementRef?.current) {
            card_store.testElementRef.current.scrollIntoView({behavior: "smooth"})
        }
    }

    return (
        <Stack alignItems={"center"} justifyContent={"center"}
               sx={{
                   width: "100%",
                   height: {xs: 200, md: 440},
                   backgroundColor: "rgba(50, 50, 50, 0.96)"
               }}>
            <Alert variant={"filled"}>
                Вы просмотрели видеофрагмент, не хотите ли пройти тест по этому фрагменту?
            </Alert>
            <Stack direction={"row"} sx={{mt: 1}} spacing={2}>
                <Button variant={"outlined"} color={"error"} onClick={onCloseButtonClick}>
                    Закрыть
                </Button>
                <Button variant={"contained"} color={"info"} onClick={onGoToTestButtonClick}>
                    К тесту
                </Button>
            </Stack>

        </Stack>
    )
})

export default GoToTestDialog
