import { observer } from 'mobx-react';
import React from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { CardByIDStore } from '../Store/CardByIDStore';

interface IDefaultCardNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  card_store: CardByIDStore;
}

const DefaultCardNavigation = observer(
  ({ card_store, ...props }: IDefaultCardNavigationProps) => {
    const navigate = useNavigate();
    const card_id = Number(card_store?.card_data?.id);
    const isAdmin = UserStorage.userAccessLevel == 'ADMIN';

    const openCardForEdit = () => {
      navigate(`/editor/card2/card/${card_id}`);
    };
    if (!isAdmin) return null;
    return (
      <div {...props}>
        <Stack
          direction={'row'}
          justifyContent="space-between"
          alignItems={'center'}
        >

          {isAdmin && (
            <IconButton size="large" onClick={openCardForEdit}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          )}
        </Stack>
      </div>
    );
  },
);

export default DefaultCardNavigation;
