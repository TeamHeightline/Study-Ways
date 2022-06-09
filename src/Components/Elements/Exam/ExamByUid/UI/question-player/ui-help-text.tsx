import {Alert} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import React from "react";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useSelector} from "react-redux";

interface IUIHelpTextProps extends PaperProps {

}

export default function UIHelpText({...props}: IUIHelpTextProps) {
    const helpText = useSelector((state: RootState) => state?.ExamByUIDReducer?.help_text)
    if (!helpText) {
        return <div/>
    }
    return (
        <Alert severity="error" variant="filled" sx={{mt: 2}}>
            {helpText}
        </Alert>
    )
}
