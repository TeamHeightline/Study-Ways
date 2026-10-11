import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isMobileHook } from '../../../../../shared/custom-hooks/isMobileHook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonProps } from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/redux-store/RootStore';
type IGoBackButtonProps = ButtonProps;
const GoBackButton = ({ ...props }: IGoBackButtonProps) => {
  const updateExamLoading = useSelector(
    (state: RootState) => state?.examEditor?.update_exam_loading,
  );
  const navigate = useNavigate();
  const isMobile = isMobileHook();
  return (
    <Button
      {...props}
      sx={{ flexShrink: 0 }}
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
};
export default GoBackButton;
