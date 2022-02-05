import {observer} from "mobx-react";
import React from 'react';
import {Backdrop, CircularProgress, SpeedDial} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {SpeedDialAction} from "@mui/lab";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import SchoolIcon from '@mui/icons-material/School';
import {
    QuestionEditorStorage
} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";

interface IAdditionalActionsProps extends React.HTMLAttributes<HTMLDivElement>{

}
function openQuestionInStudyMode(){
    window.open("https://www.sw-university.com/iq/" + QuestionEditorStorage.selectedQuestionID)
}
function openQuestionInExamMode(){
    window.open("https://www.sw-university.com/iq/" + QuestionEditorStorage.selectedQuestionID
    + "?exam=true")
}

const actions = [
    { icon: <ReplyIcon />, name: 'Открыть в режиме подготовки', action:  openQuestionInStudyMode},
    { icon: <SchoolIcon />, name: 'Открыть в режиме экзамена', action: openQuestionInExamMode},
    { icon: <ContentCopyIcon />, name: 'Создать копию и открыть на редактирование', action: QuestionEditorStorage.deepQuestionCopyWithAnswers},
];

const AdditionalActions = observer(({...props}: IAdditionalActionsProps) =>{
    return(
        <div {...props}>
            <Backdrop
                open={QuestionEditorStorage.createDeepCopyInProgress}
            >
                <CircularProgress color="primary" />
            </Backdrop>
            <SpeedDial
                sx={{bgcolor: "secondary"}}
                icon={<MoreHorizIcon/>}
                direction={"right"}
                transitionDuration={1500}
                ariaLabel={"Дополнительные действия"}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        title={action.name}
                        onClick={action?.action}
                    />
                ))}
            </SpeedDial>
        </div>
    )
})

export default AdditionalActions