import React from 'react';
import { Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { changeOrderingByCreatedAt } from '../redux-store/QuestionEditorPageSlice';

export default function UIOrderingByCreatedAt({ className = '' }: BoxProps) {
  const ordering = useAppSelector(
    state => state.questionEditorPage.ordering_by_created_at,
  );
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="outlined"
      startIcon={<SwapVertRoundedIcon />}
      onClick={() => dispatch(changeOrderingByCreatedAt())}
      className={`sw-qedit-order ${className}`}
      aria-label={`Порядок вопросов: ${ordering === 'desc' ? 'сначала новые' : 'сначала старые'}`}
    >
      {ordering === 'desc' ? 'Сначала новые' : 'Сначала старые'}
    </Button>
  );
}
