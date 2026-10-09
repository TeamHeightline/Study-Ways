import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Button } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
export const UiCloseButton = observer(() => {
  const navigate = useNavigate();
  return (
    <Button
      className="sw-cedit-back"
      startIcon={<ArrowBackRoundedIcon />}
      disabled={!CESObject.stateOfSave}
      onClick={() => navigate(-1)}
    >
      Назад
    </Button>
  );
});
