import {Button, Grid, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {useDispatch, useSelector} from "react-redux";
import {checkAnswers} from "../../redux-store/ExamPlayerSlice";
import UiComebackLaterDialog from "./ui-come-back-later-dialog";
import {RootState, useAppSelector} from "../../../../../ReduxStore/RootStore";

interface IUIQuestionTextProps extends PaperProps {

}

export default function UIQuestionText({...props}: IUIQuestionTextProps) {
    const isMobile = isMobileHook()
    const dispatch = useDispatch();
    const [disableCheckButton, setDisableCheckButton] = useState(false)
    const [isOpenComeBackLaterDialog, setIsOpenComeBackLaterDialog] = useState(false)
    const questionText = useSelector((state: RootState) => state?.examPlayer?.selected_question_data?.text)
    const remaining_attempts = useAppSelector(state => state.examPlayer?.remaining_attempts)
    const is_enable_max_question_attempts = useAppSelector(state => state.examPlayer?.exam_data?.is_enable_max_question_attempts)


    function checkError() {
        dispatch(checkAnswers())
    }

    return (
        <Grid item xs={12} md={6}
              style={{height: isMobile ? window.innerWidth - 100 : 500, width: "100%"}}>
            <UiComebackLaterDialog isOpenComeBackLaterDialog={isOpenComeBackLaterDialog}
                                   setIsOpenComeBackLaterDialog={setIsOpenComeBackLaterDialog}/>
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
                                    onClick={() => setIsOpenComeBackLaterDialog(true)}
                                    fullWidth>
                                Сдаться
                            </Button>
                        </Stack>
                        {is_enable_max_question_attempts &&
                            <Typography>
                                Осталось попыток: {remaining_attempts}
                            </Typography>}
                    </Grid>
                </Grid>
            </CardContent>
        </Grid>
    )
}
