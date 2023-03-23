import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Alert, Paper, AlertTitle, Button, Typography, Stack} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import {useNavigate} from "react-router-dom";


interface ITestBeforeCardProps extends PaperProps {
    card_store: CardByIDStore
}

const TestBeforeCard = observer(({card_store, ...props}: ITestBeforeCardProps) => {
    const navigate = useNavigate()

    function closeAlert() {
        card_store.is_test_in_card_closed = true
    }

    const onGoToTest = () => {
        navigate("/iq/" + card_store.card_data?.testBeforeCard?.id)
    }

    const isCardHaveTestBeforeCard = card_store.card_data?.testBeforeCard?.id && card_store.card_data?.isCardUseTestBeforeCard

    const is_test_in_card_closed = card_store.is_test_in_card_closed

    const is_hide_this_alert = !(!is_test_in_card_closed && isCardHaveTestBeforeCard)
    

    if (is_hide_this_alert) return null

    return (
        <Paper elevation={0} {...props}>
            <Alert severity={"error"} variant="outlined">
                <AlertTitle>
                    <Typography variant={"h5"}>
                        Тест перед карточкой
                    </Typography>
                </AlertTitle>
                <Typography variant={"subtitle1"}>
                    Перед тем, как просмотреть данную карточку, советуем пройти тест, чтобы проверить, имеются ли у Вас
                    знания, необходимые для ее просмотра.
                </Typography>
                <Stack direction={"row"} spacing={"2"} sx={{mt: 2}}>
                    <Button variant={"contained"} onClick={onGoToTest}>
                        Пройти тест
                    </Button>
                    <Button onClick={closeAlert}>
                        Продолжить просмотр карточки
                    </Button>
                </Stack>
            </Alert>

        </Paper>
    )
})

export default TestBeforeCard
