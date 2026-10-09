import React from 'react';
import { Button, Paper, PaperProps } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';

export default function GoBackButton({ className = '', ...props }: PaperProps) {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-action-wrapper ${className}`}
    >
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        className="sw-review-back"
        onClick={() => navigate(-1)}
      >
        Назад
      </Button>
    </Paper>
  );
}
