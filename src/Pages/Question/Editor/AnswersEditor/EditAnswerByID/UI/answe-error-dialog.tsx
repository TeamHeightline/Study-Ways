import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { observer } from "mobx-react";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";

interface IAnswerErrorDialogProps extends BoxProps {
  answer_object: EditAnswerByIdStore;
}

const AnswerErrorDialog = observer(
  ({ answer_object, ...props }: IAnswerErrorDialogProps) => {
    const isOpen = answer_object.isOpenAnswerErrorMessageDialog;
    return (
      <Box {...props}>
        <Dialog
          open={isOpen && answer_object.answerErrorMessage.length > 0}
          onClose={answer_object.closeAnswerErrorMessageDialog}
        >
          <DialogTitle>{"Сообщения о ошибках в ответе"}</DialogTitle>
          <DialogContent>
            {answer_object.answerErrorMessage?.map((message) => (
              <Box key={message.id} sx={{ mt: 1 }}>
                <DialogContentText variant={"h6"}>
                  {message.text}
                </DialogContentText>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"end"}
                >
                  <DialogContentText variant={"body1"}>
                    {message?.users_customuser?.users_userprofile?.lastname ||
                    message?.users_customuser?.users_userprofile?.firstname
                      ? `${message?.users_customuser?.users_userprofile?.lastname} ${message?.users_customuser?.users_userprofile?.firstname}`
                      : message?.users_customuser?.username}
                  </DialogContentText>
                  <DialogContentText variant={"caption"}>
                    {message.createdAt?.slice(0, 10)?.replace(/-/g, "-")}
                  </DialogContentText>
                </Stack>
                <Stack alignItems={"end"}>
                  <LoadingButton
                    startIcon={<DoneIcon />}
                    loading={
                      message.id === answer_object.updatingAnswerErrorMessageID
                    }
                    onClick={() =>
                      answer_object.onCloseAnswerReportClick(message.id)
                    }
                    variant="outlined"
                    size={"small"}
                    color={"success"}
                  >
                    Обработано
                  </LoadingButton>
                </Stack>
              </Box>
            ))}
            {/* <DialogActions>*/}
            <Stack alignItems={"end"} sx={{ mt: 2 }}>
              <Button
                onClick={answer_object.closeAnswerErrorMessageDialog}
                autoFocus
                fullWidth
                color={"info"}
                startIcon={<CloseIcon />}
              >
                Закрыть
              </Button>
            </Stack>
            {/* </DialogActions>*/}
          </DialogContent>
        </Dialog>
      </Box>
    );
  },
);

export default AnswerErrorDialog;
