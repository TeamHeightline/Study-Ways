import {Badge, Box, IconButton} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";
import ReportProblemIconOutlined from '@mui/icons-material/ReportProblemOutlined';


interface IUIAnswerErrorsButtonProps extends BoxProps {
    answer_object: EditAnswerByIdStore
}


const UIAnswerErrorsButton = observer(({answer_object, ...props}: IUIAnswerErrorsButtonProps) => {
    const numberOfErrorMessages = answer_object.answerErrorMessage.length
    return (
        <Box {...props}>
            {numberOfErrorMessages > 0 &&
                <IconButton color={"error"} onClick={answer_object.openAnswerErrorMessageDialog}>
                    <Badge badgeContent={numberOfErrorMessages} color={"error"}>
                        <ReportProblemIconOutlined/>
                    </Badge>
                </IconButton>
            }
        </Box>
    )
})

export default UIAnswerErrorsButton;