import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import UIMiniSelectedQuestion from "./ui-mini-selected-question";
import {IQuestionStatus} from "../../redux-store/InitialState";
import UIMiniPassedQuestionButton from "./ui-mini-passed-question-button";
import UIMiniUnselectedQuestion from "./ui-mini-unselected-question";
import {RootState} from "../../../../../App/ReduxStore/RootStore";

interface IUIQuestionButtonFactoryProps extends PaperProps {
    questionIndex: number,
    questionStatus: IQuestionStatus
}

export default function UIQuestionButtonFactory({
                                                    questionIndex,
                                                    questionStatus,
                                                    ...props
                                                }: IUIQuestionButtonFactoryProps) {
    const selectedQuestionID = useSelector((state: RootState) => state?.examPlayer?.selected_question_id)
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
