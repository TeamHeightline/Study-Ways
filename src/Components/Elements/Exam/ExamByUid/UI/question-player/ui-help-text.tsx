import {Alert} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIHelpTextProps extends PaperProps {

}

export default function UIHelpText({...props}: IUIHelpTextProps) {
    const helpText = useSelector((state: RootState) => state?.examPlayer?.help_text)
    if (!helpText) {
        return <div/>
    }
    return (
        <Alert severity="error" variant="filled" sx={{mt: 2}}>
            {helpText}
        </Alert>
    )
}
