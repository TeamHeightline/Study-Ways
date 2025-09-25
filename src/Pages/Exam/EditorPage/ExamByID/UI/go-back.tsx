import { observer } from "mobx-react";
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ButtonProps } from "@mui/material/Button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../App/ReduxStore/RootStore";

type IGoBackButtonProps = ButtonProps;

const GoBackButton = observer(({ ...props }: IGoBackButtonProps) => {
  const updateExamLoading = useSelector(
    (state: RootState) => state?.examEditor?.update_exam_loading,
  );
  const navigate = useNavigate();
  const isMobile = isMobileHook();
  return (
    <Button
      {...props}
      sx={{ minWidth: isMobile ? "" : 300 }}
      fullWidth={isMobile}
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      color="primary"
      disabled={updateExamLoading}
      onClick={() => {
        navigate(-1);
      }}
    >
      Назад
    </Button>
  );
});

export default GoBackButton;
