import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useSelector} from "react-redux";
import UIMiniSelectedQuestion from "./ui-mini-selected-question";
import {IQuestionStatus} from "../../redux-store/initial-state";
import UIMiniPassedQuestionButton from "./ui-mini-passed-question-button";
import UIMiniUnselectedQuestion from "./ui-mini-unselected-question";

interface IUIQuestionButtonFactoryProps extends PaperProps {
    questionIndex: number,
    questionStatus: IQuestionStatus
}

export default function UIQuestionButtonFactory({
                                                    questionIndex,
                                                    questionStatus,
                                                    ...props
                                                }: IUIQuestionButtonFactoryProps) {
    const selectedQuestionID = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_id)
    const isSelected = selectedQuestionID === questionStatus.question_id
    const isPassed = !!questionStatus.statistic_id

    if (isSelected) {
        return <UIMiniSelectedQuestion questionIndex={questionIndex}
                                       questionID={questionStatus.question_id} {...props}/>
    } else if (isPassed) {
        return <UIMiniPassedQuestionButton questionIndex={questionIndex}
                                           questionID={questionStatus.question_id} {...props}/>
    } else {
        return (
            <UIMiniUnselectedQuestion questionIndex={questionIndex} questionID={questionStatus.question_id} {...props}/>
        )
    }
}
