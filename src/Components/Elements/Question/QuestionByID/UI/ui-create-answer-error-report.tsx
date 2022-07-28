import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";

interface ICreateErrorInAnswerReportProps extends BoxProps {
    questionStore: QuestionPlayerStore
}


const UiCreateAnswerErrorReport = observer(({questionStore, ...props}: ICreateErrorInAnswerReportProps) => {
    return (
        <Box {...props}>
            <Dialog open={!!questionStore.answerIndexForCreateErrorReport}
                    onClose={questionStore.onCloseAnswerReportDialog}>
                <DialogTitle>Сообщить об ошибке в ответе</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={questionStore.onCloseAnswerReportDialog}>Cancel</Button>
                    <Button onClick={questionStore.onCloseAnswerReportDialog}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})

export default UiCreateAnswerErrorReport;