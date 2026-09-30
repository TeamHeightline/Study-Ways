import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Button, Paper } from '@mui/material';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { CardByIDStore } from '../Store/CardByIDStore';
import { useNavigate } from 'react-router-dom';

interface IGoToTestButtonProps extends PaperProps {
  card_store: CardByIDStore;
}

const GoToTestButton = observer(
  ({ card_store, ...props }: IGoToTestButtonProps) => {
    const navigate = useNavigate();

    const card = card_store.card_data;
    const showTestButton = Boolean(card?.test_in_card_id) &&
      (card?.card_content_type === 0 || card?.is_card_use_test_in_card);

    if (!showTestButton) return null;

    const onGoToTestButtonClick = () => {
      navigate(`/iq/${card_store.card_data?.test_in_card_id}`);
    };

    return (
      <Paper elevation={0} {...props}>
        
            <Button
              className="sw-material-test-link"
              disableElevation
              color={'primary'}
              fullWidth
              variant={'contained'}
              onClick={onGoToTestButtonClick}
            >
              <span className="sw-material-test-link-icon"><FactCheckOutlinedIcon /></span>
              <span className="sw-material-test-link-copy"><strong>Перейти к тесту</strong><span>Проверьте свои знания по теме</span></span>
              <ArrowForwardRoundedIcon className="sw-material-test-link-arrow" />
            </Button>

      </Paper>
    );
  },
);

export default GoToTestButton;
