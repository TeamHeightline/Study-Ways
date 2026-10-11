import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Button, Paper, Typography } from '@mui/material';
import { CardByIDStore } from '../store/CardByIDStore';
import { useNavigate } from 'react-router-dom';
interface ITestAfterCardProps extends PaperProps {
  card_store: CardByIDStore;
}
const TestAfterCard = ({ card_store, ...props }: ITestAfterCardProps) => {
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
      <div className="sw-material-test-icon">
        <TaskAltRoundedIcon />
      </div>
      <div className="sw-material-test-copy">
        <Typography component="h2">Закрепите материал</Typography>
        <Typography>
          Пройдите короткий тест, чтобы проверить, что удалось запомнить.
        </Typography>
      </div>
      <div className="sw-material-test-actions">
        <Button variant="contained" disableElevation onClick={onGoToTest}>
          Пройти тест
        </Button>
      </div>
    </Paper>
  );
};
export default TestAfterCard;
