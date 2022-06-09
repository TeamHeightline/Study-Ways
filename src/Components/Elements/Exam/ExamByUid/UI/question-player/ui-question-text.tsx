import {Button, Grid, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {checkAnswers} from "../../redux-store/actions";

interface IUIQuestionTextProps extends PaperProps {

}

export default function UIQuestionText({...props}: IUIQuestionTextProps) {
    const isMobile = isMobileHook()
    const dispatch = useDispatch();
    const [disableCheckButton, setDisableCheckButton] = useState(false)
    const questionText = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_data?.text)

    function checkError() {
        dispatch(checkAnswers())
    }

    return (
        <Grid item xs={12} md={6}
              style={{height: isMobile ? window.innerWidth - 100 : 500, width: "100%"}}>
            <CardContent sx={{height: "100%"}}>
                <Grid sx={{height: "100%"}} container alignItems="center">
                    <Grid item xs={12} spacing={2}>
                        <Typography component="h5" variant="h5">
                            Вопрос
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p"
                                    style={{userSelect: "none", content: "Foobar"}}>
                            {questionText}
                        </Typography>
                        <Stack direction={"row"} spacing={1}>
                            <Button
                                disabled={disableCheckButton}
                                variant="contained" color="primary"
                                onClick={(e) => {
                                    // props.onClick1(e)
                                    checkError()
                                    setDisableCheckButton(true)
                                    setTimeout(setDisableCheckButton, 1000, false)
                                }}
                                fullWidth>
                                Проверить
                            </Button>
                            <Button variant="outlined" color="secondary"
                                // onClick={() => setOpenAcceptDefeatDialog(true)}
                                    fullWidth>
                                Сдаться
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Grid>
    )
}
