import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import { observer } from 'mobx-react';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

interface IUISingleAnswerByDataProps extends BoxProps {
  text?: string;
  isSelected?: boolean;
  onAnswerClick?: () => void;
  imageURL: string;
  isImageDeleted?: boolean;
}

const UISingleAnswerByData = observer(
  ({
    text,
    imageURL,
    isImageDeleted,
    onAnswerClick,
    isSelected,
    ...props
  }: IUISingleAnswerByDataProps) => (
    <Box {...props}>
      <Card className={`sw-answer-card ${isSelected ? 'is-selected' : 'is-unselected'}`} variant="outlined" onClick={onAnswerClick}>
        <CardActionArea className="sw-answer-card-action">
          <div className="sw-answer-choice-indicator">{isSelected ? <CheckCircleRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}<span>{isSelected ? 'Выбрано' : 'Не выбрано'}</span></div>
          {!isImageDeleted && imageURL && (
            <CardMedia
              component="img"
              alt="Изображение к варианту ответа"
              className="sw-answer-media"
              image={imageURL}
            />
          )}
          {text && (
            <CardContent className="sw-answer-content">
              <Typography className="sw-answer-text" variant="body1" component="p">{text}</Typography>
            </CardContent>
          )}
        </CardActionArea>
      </Card>
    </Box>
  ),
);

export default UISingleAnswerByData;
