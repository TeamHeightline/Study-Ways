import { Card, Chip, Paper, Stack, Typography } from '@mui/material';
import { PaperProps } from '@mui/material/Paper/Paper';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { sequenceDataI } from '../../../../../Shared/ServerLayer/Types/question-sequence.type';
import {
  RootState,
  useAppDispatch,
} from '../../../../../App/ReduxStore/RootStore';
import { loadQSDataThunk } from '../redux-store/async-actions';

type ISelectedQSByDataProps = PaperProps;

export default function SelectedQSByData({ ...props }: ISelectedQSByDataProps) {
  const sequenceData: sequenceDataI | null | undefined = useSelector(
    (state: RootState) => state?.examEditor?.selected_qs_data,
  );
  const selectedQSID = useSelector(
    (state: RootState) => state?.examEditor?.exam_data?.question_sequence_id,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedQSID) {
      dispatch(loadQSDataThunk(String(selectedQSID)));
    }
  }, [selectedQSID]);

  if (!sequenceData || Number(sequenceData.id) !== Number(selectedQSID) || selectedQSID == undefined) {
    return <div />;
  }
  return (
    <Paper elevation={0} {...props}>
      <Card variant="outlined" className="sw-exam-sequence">
        <Typography variant="caption" className="sw-exam-eyebrow">Серия вопросов · № {sequenceData.id}</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{sequenceData.name}</Typography>
        {sequenceData.description && <Typography variant="body2" color="text.secondary">{sequenceData.description}</Typography>}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>Вопросов в серии: {sequenceData.sequence_data?.sequence?.length || 0}</Typography>
        <div className="sw-exam-question-chips">
          {sequenceData.sequence_data?.sequence?.map((question_id, qIndex) => <Chip size="small" label={'№ ' + question_id} variant="outlined" key={qIndex} />)}
        </div>
      </Card>
    </Paper>
  );
}
