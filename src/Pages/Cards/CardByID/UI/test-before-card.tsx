import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import {
  Alert,
  Paper,
  AlertTitle,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import { useNavigate } from 'react-router-dom';

interface ITestBeforeCardProps extends PaperProps {
  card_store: CardByIDStore;
}

const TestBeforeCard = observer(
  ({ card_store, ...props }: ITestBeforeCardProps) => {
    const navigate = useNavigate();

    function closeAlert() {
      card_store.is_test_in_card_closed = true;
    }

    const onGoToTest = () => {
      navigate(`/iq/${card_store.card_data?.test_before_card_id}`);
    };

    const isCardHaveTestBeforeCard =
      card_store.card_data?.test_before_card_id &&
      card_store.card_data?.is_card_use_test_before_card;

    const is_test_in_card_closed = card_store.is_test_in_card_closed;

    const is_hide_this_alert = !(
      !is_test_in_card_closed && isCardHaveTestBeforeCard
    );

    if (is_hide_this_alert) {
      return null;
    }

    return (
      <Paper elevation={0} {...props} className="sw-material-test-prompt">
        <div className="sw-material-test-icon"><TaskAltRoundedIcon /></div>
        <div className="sw-material-test-copy"><Typography component="h2">Проверьте себя перед просмотром</Typography><Typography>Узнайте, насколько хорошо вы знакомы с темой.</Typography></div>
        <div className="sw-material-test-actions"><Button variant="contained" disableElevation onClick={onGoToTest}>Пройти тест</Button><Button onClick={closeAlert}>Скрыть</Button></div>
      </Paper>
    );
  },
);

export default TestBeforeCard;
