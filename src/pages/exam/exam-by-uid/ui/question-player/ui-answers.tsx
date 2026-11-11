import { Card, CardActionArea, Stack, Typography } from '@mui/material';
import { PaperProps } from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import { isMobileHook } from '../../../../../shared/custom-hooks/isMobileHook';
import { useDispatch, useSelector } from 'react-redux';
import { FILE_URL } from '../../../../../settings';
import { changeSelectedAnswersId } from '../../redux-store/ExamPlayerSlice';
import { RootState } from '../../../../../app/redux-store/RootStore';

type IUIAnswersProps = PaperProps;

export default function UIAnswers({ ...props }: IUIAnswersProps) {
  const isMobile = isMobileHook();
  const dispatch = useDispatch();
  const answersArray = useSelector(
    (state: RootState) =>
      state?.examPlayer?.selected_question_data?.usertests_answer,
  );
  const selectedAnswersID = useSelector(
    (state: RootState) => state?.examPlayer?.selected_answers_id,
  );

  const selectOrDeselectAnswer = (id: number) => {
    dispatch(changeSelectedAnswersId(id));
  };
  return (
    <div style={{ overflowX: 'auto', minWidth: 0, maxWidth: '100%' }}>
      {answersArray && (
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          sx={{
            width: isMobile ? '100%' : 'max-content',
            alignItems: 'stretch',
            pt: 2,
            pb: 4,
          }}
        >
          {answersArray.map(answer => (
            <Card
              key={answer.id}
              variant="outlined"
              sx={{
                backgroundColor: selectedAnswersID?.includes(answer?.id)
                  ? 'var(--sw-accent)'
                  : '',
                width: isMobile ? '100%' : 385,
                minWidth: 0,
                flexShrink: 0,
                display: 'flex',
              }}
            >
              <CardActionArea
                aria-pressed={selectedAnswersID?.includes(answer.id) ?? false}
                onClick={() => selectOrDeselectAnswer(answer.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  minWidth: 0,
                }}
              >
                {!answer.is_image_deleted &&
                  answer?.usertests_answerimage?.image && (
                    <CardMedia
                      sx={{
                        opacity: selectedAnswersID?.includes(answer?.id)
                          ? 0.5
                          : 1,
                        height: answer?.text ? 240 : 400,
                      }}
                      image={`${FILE_URL}/${answer?.usertests_answerimage?.image}`}
                    />
                  )}
                {answer?.text && (
                  <CardContent sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        wordBreak: 'normal',
                      }}
                    >
                      {answer?.text}
                    </Typography>
                  </CardContent>
                )}
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </div>
  );
}
