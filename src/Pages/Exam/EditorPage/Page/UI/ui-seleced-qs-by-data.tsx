import {Card, Chip, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import React from "react";
import {useSelector} from "react-redux";
import {sequenceDataI} from "../../../../../ServerLayer/Types/question-sequence.type";
import {RootState} from "../../../../../root-redux-store/RootStore";

interface ISelectedQSByDataProps extends PaperProps {

}

export default function SelectedQSByData({...props}: ISelectedQSByDataProps) {
    const sequenceData: sequenceDataI | null | undefined = useSelector((state: RootState) => state?.examEditorPageReducer?.selected_qs_data)
    const selectedQSID = useSelector((state: RootState) => state?.examEditorPageReducer?.exam_qs_id_for_create)
    if (sequenceData?.id != selectedQSID || selectedQSID == undefined) {
        return <div/>
    }
    return (
        <Card variant="outlined" sx={{backgroundColor: "transparent", mt: 1}}>
            <Typography variant="h6" color="textSecondary" sx={{pl: 2, pt: 1}}>
                <strong>
                    {"ID: " + sequenceData?.id}
                </strong>
            </Typography>
            <Typography sx={{pl: 2}}>
                {"Название: " + sequenceData?.name}
            </Typography>

            <Typography sx={{pl: 2}}>
                {sequenceData?.description ?
                    "Описание: " + sequenceData?.description :
                    "Описание отсутствует"}
            </Typography>

            <Stack sx={{pl: 2, pr: 2, mb: 2, pt: 1, overflowY: "auto"}} spacing={2} direction={"row"}>
                {sequenceData?.sequence_data?.sequence?.map((question_id, qIndex) => {
                    return (
                        <Chip label={question_id || ""} variant="outlined" key={qIndex + "QuestionKey"}/>
                    )
                })}
            </Stack>
        </Card>
    )
}
