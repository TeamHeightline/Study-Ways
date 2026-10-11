import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { ReviewAnswer } from '../../../../Question/question-read-api';
import { FILE_URL } from '../../../../../settings';

export default function ReviewAnswerContent({
  answer,
}: {
  answer: ReviewAnswer;
}) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(
      answer.image && !answer.isImageDeleted
        ? `${FILE_URL}/${answer.image}`
        : '',
    );
  }, [answer.id, answer.image, answer.isImageDeleted]);

  return (
    <div className="sw-review-answer-content">
      <Typography component="h3">Вариант ответа</Typography>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Иллюстрация к ответу"
          loading="lazy"
          onError={() => setImageUrl('')}
        />
      )}
      <Typography component="p">
        {answer.text || (imageUrl ? '' : 'Текст ответа не добавлен.')}
      </Typography>
    </div>
  );
}
