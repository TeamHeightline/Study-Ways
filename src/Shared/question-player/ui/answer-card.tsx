import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
interface AnswerCardProps extends BoxProps {
  fullWidth?: boolean;
  text?: string;
  isSelected?: boolean;
  onAnswerClick?: () => void;
  imageURL: string;
  isImageDeleted?: boolean;
}
const AnswerCard = ({
  text,
  fullWidth = false,
  className = '',
  imageURL,
  isImageDeleted,
  onAnswerClick,
  isSelected,
  ...props
}: AnswerCardProps) => {
  const hasText = !!text?.trim();
  const hasImage = !isImageDeleted && !!imageURL;
  return (
    <Box
      {...props}
      className={`sw-answer-option${fullWidth ? ' is-full-width' : ''} ${className}`}
    >
      <Card
        className={`sw-answer-card ${isSelected ? 'is-selected' : 'is-unselected'}${hasImage && !hasText ? ' is-image-only' : ''}`}
        variant="outlined"
      >
        <CardActionArea
          className="sw-answer-card-action"
          onClick={onAnswerClick}
          aria-pressed={!!isSelected}
        >
          <div className="sw-answer-choice-indicator">
            {isSelected ? (
              <CheckCircleRoundedIcon />
            ) : (
              <RadioButtonUncheckedRoundedIcon />
            )}
            <span>{isSelected ? 'Выбрано' : 'Не выбрано'}</span>
          </div>
          {hasImage && (
            <div className="sw-answer-image-area">
              <CardMedia
                component="img"
                alt="Изображение к варианту ответа"
                className="sw-answer-media"
                image={imageURL}
              />
            </div>
          )}
          {hasText && (
            <CardContent className="sw-answer-content">
              <Typography
                className="sw-answer-text"
                variant="body1"
                component="p"
              >
                {text}
              </Typography>
            </CardContent>
          )}
        </CardActionArea>
      </Card>
    </Box>
  );
};
export default AnswerCard;
