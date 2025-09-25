import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { CheckAnswerByIdStore } from "../Store/check-answer-by-id-store";
import ImageAnswerNode from "../../../../Question/ImageAnswerNode";

interface IUICreateErrorReportDialogProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UICreateErrorReportDialog = observer(
  ({ answerStore, ...props }: IUICreateErrorReportDialogProps) => (
    <Paper elevation={0} {...props}>
      <Dialog
        open={answerStore.isOpenAnswerReportDialog}
        onClose={answerStore.closeAnswerReportDialog}
      >
        <DialogTitle>Сообщить об ошибке в ответе</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Опишите максимально развернуто в чем состоит ошибка
          </DialogContentText>
          <Stack alignItems={"center"} sx={{ mt: 2 }}>
            {answerStore?.answerData && (
              <ImageAnswerNode
                answer={answerStore.answerData}
                borderIsTrueStrategy
                selected={[]}
                onChange={() => {
                  void 0;
                }}
              />
            )}
          </Stack>
          <TextField
            value={answerStore.answerReportText}
            onChange={answerStore.changeAnswerReportText}
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
          <Button
            onClick={answerStore.closeAnswerReportDialog}
            color={"error"}
            endIcon={<CloseIcon />}
          >
            Отмена
          </Button>
          <Button
            onClick={() => answerStore.onSendAnswerReportButtonClick()}
            endIcon={<SendIcon />}
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  ),
);

export default UICreateErrorReportDialog;
