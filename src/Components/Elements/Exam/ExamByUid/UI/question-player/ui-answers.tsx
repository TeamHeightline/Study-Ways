import {Card, CardActionArea, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import React from "react";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import {useDispatch, useSelector} from "react-redux";
import {FILE_URL} from "../../../../../../settings";
import {changeSelectedAnswersId} from "../../redux-store/actions";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIAnswersProps extends PaperProps {

}

export default function UIAnswers({...props}: IUIAnswersProps) {
    const isMobile = isMobileHook()
    const dispatch = useDispatch();
    const answersArray = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_data?.usertests_answer)
    const selectedAnswersID = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_answers_id)

    const selectOrDeselectAnswer = (id: number) => {
        dispatch(changeSelectedAnswersId(id))
    }
    return (
        <div style={{overflowX: "scroll"}}>
            {answersArray &&
                <Stack direction={isMobile ? "column" : "row"} spacing={2}
                       sx={{
                           width: isMobile ? "" : answersArray?.length * 410,
                           height: isMobile ? answersArray?.length * 410 : "",
                           pt: 2, pb: 4
                       }}>
                    {answersArray.map((answer, aIndex) => {
                        return (
                            <Card key={aIndex} variant="outlined"
                                  sx={{
                                      backgroundColor: selectedAnswersID?.has(answer?.id) ? "#2296F3" : "",
                                      width: 385, height: 400
                                  }}
                                  onClick={() => {
                                      selectOrDeselectAnswer(answer.id)
                                  }}
                            >
                                <CardActionArea sx={{height: "100%"}}>
                                    {!answer.is_image_deleted && answer?.usertests_answerimage?.image &&
                                        <CardMedia
                                            sx={{
                                                opacity: selectedAnswersID?.has(answer?.id) ? 0.5 : 1,
                                                height: answer?.text ? 240 : 400
                                            }}
                                            // className={answer?.answerText ? classes.media : classes.fullHeightMedia}
                                            image={FILE_URL + "/" + answer?.usertests_answerimage?.image}
                                        />}
                                    {answer?.text &&
                                        <CardContent sx={{mb: 5}}>
                                            <Typography variant="body1" color="textSecondary" sx={{pb: 5}}>
                                                {answer?.text}
                                            </Typography>
                                        </CardContent>}
                                </CardActionArea>
                            </Card>)
                    })}

                </Stack>}
        </div>
    )
}
