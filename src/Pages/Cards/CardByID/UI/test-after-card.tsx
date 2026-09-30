import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import {
  Alert,
  AlertTitle,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { CardByIDStore } from '../Store/CardByIDStore';
import { useNavigate } from 'react-router-dom';

interface ITestAfterCardProps extends PaperProps {
  card_store: CardByIDStore;
}

const TestAfterCard = observer(
  ({ card_store, ...props }: ITestAfterCardProps) => {
    const testAfterCardID = card_store.card_data?.test_in_card_id;
    const navigate = useNavigate();
    const onGoToTest = () => {
      navigate(`/iq/${testAfterCardID}`);
    };

    const isCardHaveTestAfterCard =
      testAfterCardID && card_store.card_data?.test_in_card_id;

    if (!isCardHaveTestAfterCard) {
      return null;
    }

    return (
      <Paper elevation={0} {...props} className="sw-material-test-prompt">
        <div className="sw-material-test-icon"><TaskAltRoundedIcon /></div>
        <div className="sw-material-test-copy"><Typography component="h2">Закрепите материал</Typography><Typography>Пройдите короткий тест, чтобы проверить, что удалось запомнить.</Typography></div>
        <div className="sw-material-test-actions"><Button variant="contained" disableElevation onClick={onGoToTest}>Пройти тест</Button></div>
      </Paper>
    );
  },
);

export default TestAfterCard;
