import { useUserSession } from '../../../Shared/Store/UserStore/user-session';
import { Stack } from '@mui/material';
import PagesMenu from './PagesMenu';
import React from 'react';
import PersonalMenu from './PersonalMenu';
import { LoginButton } from './LoginButton';

const Menu = () => {
  const session = useUserSession();
  return (
    <Stack direction={'row'} sx={{ backdropFilter: 'none' }}>
      <Stack direction={'row'} spacing={2}>
        <PagesMenu />
        {session.isLogin ? <PersonalMenu /> : <LoginButton />}
      </Stack>
    </Stack>
  );
};

export default Menu;
