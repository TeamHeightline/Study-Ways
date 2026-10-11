import { observer } from 'mobx-react';
import React from 'react';
import Switch from '@mui/material/Switch';
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import useQueryParams from '../../../Shared/CustomHooks/useQueryParams';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';

type IAIRoutesProps = React.HTMLAttributes<HTMLDivElement>;

export const AIRoutes = observer(({ ...props }: IAIRoutesProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryParams = useQueryParams();

  const handleOnChange = (e, value) => {
    if (!value) return;
    const params = new URLSearchParams(queryParams);
    params.set('searchType', value);
    navigate({ pathname, search: params.toString() });
  };
  const searchType = queryParams.get('searchType');

  const defaultParams = new URLSearchParams(queryParams);
  defaultParams.set('searchType', 'AISearch');
  if (!queryParams.get('searchType')) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <Navigate to={`${pathname}?${defaultParams.toString()}`} replace />
          }
        />
      </Routes>
    );
  }
  return (
    <div className="sw-search-mode-switch" {...props}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
        <ToggleButtonGroup
          color="primary"
          value={searchType}
          exclusive
          onChange={handleOnChange}
        >
          <ToggleButton value="AISearch">
            <AutoAwesomeIcon />
            AI поиск
          </ToggleButton>
          <ToggleButton value="DSearch">
            <SearchIcon />
            Обычный поиск
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </div>
  );
});
