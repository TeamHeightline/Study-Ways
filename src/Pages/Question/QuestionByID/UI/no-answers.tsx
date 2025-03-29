import {observer} from "mobx-react";
import {Alert} from "@mui/lab";
import {AlertTitle, Button, Stack} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";

export const NoAnswers = observer(() => {
    const navigate = useNavigate();

    function handleGoBack() {
        navigate(-1)
    }

    return (
        <Stack alignItems={'center'}>
            <div style={{maxWidth: 600}}>
                <Alert severity={'warning'}>
                    <AlertTitle>Внимание</AlertTitle>
                    К сожалению для этого вопроса нет вариантов ответа, предназначенных для подготовки
                </Alert>
                <Button startIcon={<ArrowBackIcon/>} onClick={handleGoBack}>
                    Вернуться назад
                </Button>
            </div>
        </Stack>
    )
})