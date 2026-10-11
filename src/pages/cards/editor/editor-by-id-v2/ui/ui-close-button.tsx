import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Button } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';
export const UiCloseButton = () => {
  const editor = useCardEditor();
  const navigate = useNavigate();
  return (
    <Button
      className="sw-cedit-back"
      startIcon={<ArrowBackRoundedIcon />}
      disabled={!editor.isSaved}
      onClick={() => navigate(-1)}
    >
      Назад
    </Button>
  );
};
