import { observer } from 'mobx-react';
import React from 'react';

import {
  Alert,
  Button,
  Skeleton,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useGetQuestionSequencesQuery } from '../../question-sequences-api';

interface ISequencesProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectQS: (qs_id: number) => void;
}
export const Sequences = observer(
  ({ onSelectQS, ...props }: ISequencesProps) => {
    const { data, isFetching, isError, refetch } =
      useGetQuestionSequencesQuery();
    return (
      <div {...props}>
        {isError && (
          <Alert
            severity="error"
            action={<Button onClick={() => refetch()}>Повторить</Button>}
          >
            Не удалось загрузить серии вопросов.
          </Alert>
        )}
        {isFetching && !data && <Skeleton height={180} />}
        <Grid
          container
          item
          xs={12}
          sx={{ pt: 2, pl: 6, pr: 2 }}
          rowSpacing={3}
          justifyContent={'space-evenly'}
          columnSpacing={8}
        >
          {data?.map(sequence => (
            <Grid item xs={12} md={4} key={sequence.id}>
              <Card variant="outlined" key={`${sequence?.id}SequenceKey`}>
                <CardActionArea
                  onClick={() => {
                    onSelectQS(Number(sequence.id));
                  }}
                >
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    sx={{ pl: 2, pt: 1 }}
                  >
                    <strong>{`ID: ${sequence?.id}`}</strong>
                  </Typography>
                  <Typography sx={{ pl: 2 }}>
                    {`Название: ${sequence?.name}`}
                  </Typography>

                  <Typography sx={{ pl: 2 }}>
                    {sequence?.description
                      ? `Описание: ${sequence?.description}`
                      : 'Описание отсутствует'}
                  </Typography>

                  <Stack
                    sx={{ pl: 2, pr: 2, mb: 2, pt: 1, overflowY: 'auto' }}
                    spacing={2}
                    direction={'row'}
                  >
                    {sequence?.sequenceData?.sequence?.map(
                      (question_id, qIndex) => (
                        <Card
                          sx={{ pl: 1, pr: 1 }}
                          style={{ borderColor: 'var(--sw-accent)' }}
                          variant="outlined"
                          key={`${sequence?.id}SequenceKey${qIndex}QuestionKey`}
                        >
                          {question_id}
                        </Card>
                      ),
                    )}
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  },
);
