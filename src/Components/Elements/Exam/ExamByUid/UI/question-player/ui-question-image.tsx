import {Grid} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import CardMedia from "@mui/material/CardMedia";
import React from "react";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useSelector} from "react-redux";
import {FILE_URL} from "../../../../../../settings";

interface IUIQuestionImageProps extends PaperProps {
}

export default function UIQuestionImage({...props}: IUIQuestionImageProps) {
    const isMobile = isMobileHook()
    const questionImageURL = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_data?.usertests_questionimage?.image)

    if (!questionImageURL) {
        return <div/>
    }

    return (
        <Grid item xs={12} md={6}>
            <CardMedia
                style={{
                    height: isMobile ? window.innerWidth - 100 : 500,
                    backgroundSize: "contain",
                    maxHeight: isMobile ? window.innerWidth : 500,
                    overflowY: "auto",
                    width: "100%"
                }}
                image={FILE_URL + "/" + questionImageURL}
            />
        </Grid>
    )
}