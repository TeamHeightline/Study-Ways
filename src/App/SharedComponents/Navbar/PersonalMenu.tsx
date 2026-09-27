import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  MenuItem,
  Popover,
} from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import React from 'react';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth0 } from '@auth0/auth0-react';

type IPersonalMenuProps = BoxProps;

export default function PersonalMenu({ ...props }: IPersonalMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth0();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box {...props}>
      <Button
        startIcon={<AccountCircleIcon />}
        sx={{ color: 'white' }}
        onClick={handleMenu}
      >
        Аккаунт
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ py: 1 }}>
          <MenuItem
            disabled={!UserStorage.isLogin}
            onClick={() => {
              handleClose();
              navigate('/profile');
            }}
          >
            <ListItemIcon>
              <ManageAccountsIcon fontSize="small" />
            </ListItemIcon>
            Профиль
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleClose();
              if (isAuthenticated) {
                logout({ returnTo: window.location.origin });
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
}
