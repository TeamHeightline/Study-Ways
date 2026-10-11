import { useUserSession } from '../../../../shared/store/user-store/user-session';
import React from 'react';
import { Stack } from '@mui/material';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { CardByIDStore } from '../store/CardByIDStore';
interface IDefaultCardNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  card_store: CardByIDStore;
}
const DefaultCardNavigation = ({
  card_store,
  ...props
}: IDefaultCardNavigationProps) => {
  const session = useUserSession();
  const navigate = useNavigate();
  const card_id = Number(card_store?.card_data?.id);
  const isAdmin = session.role == 'ADMIN';
  const openCardForEdit = () => {
    navigate(`/editor/card2/card/${card_id}`);
  };
  if (!isAdmin) return null;
  return (
    <div {...props}>
      <Stack
        direction={'row'}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {isAdmin && (
          <IconButton size="large" onClick={openCardForEdit}>
            <EditIcon fontSize="inherit" />
          </IconButton>
        )}
      </Stack>
    </div>
  );
};
export default DefaultCardNavigation;
