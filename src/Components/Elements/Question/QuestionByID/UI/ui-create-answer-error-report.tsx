import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";
import UISingleAnswerByData from "./ui-single-answer-by-data";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface ICreateErrorInAnswerReportProps extends BoxProps {
    questionStore: QuestionPlayerStore
}


const UiCreateAnswerErrorReport = observer(({questionStore, ...props}: ICreateErrorInAnswerReportProps) => {
    if (!questionStore?.answerIndexForCreateErrorReport) {
        return (<div/>)
    }
    const selectedAnswer = questionStore.answersArray[questionStore?.answerIndexForCreateErrorReport]
    return (
        <Box {...props}>
            <Dialog open={!!questionStore.answerIndexForCreateErrorReport && selectedAnswer}
                    onClose={questionStore.onCloseAnswerReportDialog}>
                <DialogTitle>Сообщить об ошибке в ответе</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Опишите максимально развернуто в чем состоит ошибка
                    </DialogContentText>
                    <Stack alignItems={"center"} sx={{mt: 2}}>
                        <UISingleAnswerByData text={selectedAnswer.answerText} imageURL={selectedAnswer.answerImageUrl}
                                              isImageDeleted={selectedAnswer.isImageDeleted} isSelected={false}/>
                    </Stack>
                    <TextField
                        value={questionStore.answerReportText}
                        onChange={questionStore.changeAnswerReportText}
                        multiline
                        autoFocus
                        margin="dense"
                        id="error description"
                        label="Описание ошибки"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={questionStore.onCloseAnswerReportDialog}
                            color={"error"}
                            endIcon={<CloseIcon/>}>
                        Отмена
                    </Button>
                    <Button onClick={questionStore.onSendAnswerReportButtonClick}
                            endIcon={<SendIcon/>}
                    >
                        Отправить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})

export default UiCreateAnswerErrorReport;