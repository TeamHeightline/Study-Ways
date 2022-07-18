import {observer} from "mobx-react";
import React from 'react';
import {Button} from "@mui/material";
import {useHistory} from "react-router-dom";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {ButtonProps} from "@mui/material/Button/Button";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../root-redux-store/RootStore";


interface IGoBackButtonProps extends ButtonProps {

}

const GoBackButton = observer(({...props}: IGoBackButtonProps) => {
    const updateExamLoading = useSelector((state: RootState) => state?.examEditorReducer?.update_exam_loading)
    const history = useHistory()
    const isMobile = isMobileHook()
    return (
        <Button
            {...props}
            sx={{minWidth: isMobile ? "" : 300}}
            fullWidth={isMobile}
            startIcon={<ArrowBackIcon/>}
            variant="outlined"
            color="primary"
            disabled={updateExamLoading}
            onClick={() => {
                history.goBack()
            }}>
            Назад
        </Button>
    )
})

export default GoBackButton
