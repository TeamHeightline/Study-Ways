import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import { AnswerNode } from '../../../../../SchemaTypes';
import { SERVER_BASE_URL } from '../../../../../settings';

export default function ReviewAnswerContent({
  answer,
}: {
  answer: AnswerNode;
}) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setImageUrl('');
    if (!answer.isImageDeleted) {
      axios
        .get(`${SERVER_BASE_URL}/files/answer?id=${answer.id}`, {
          signal: controller.signal,
        })
        .then(response => {
          if (!controller.signal.aborted)
            setImageUrl(response.data?.[0]?.image || '');
        })
        .catch(() => {
          /* Answers may have no image. */
        });
    }
    return () => controller.abort();
  }, [answer.id, answer.isImageDeleted]);

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
