import { IconButton, InputAdornment, TextField } from '@mui/material';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { changeSearchString } from '../redux-store/StatusEditorSlice';

export default function UIUserSearch() {
  const dispatch = useAppDispatch();
  const search = useAppSelector(
    (state: RootState) => state.statusEditor.searchString,
  );
  return (
    <div className="sw-access-search">
      <TextField
        fullWidth
        size="small"
        label="Поиск пользователей"
        placeholder="Имя, фамилия, email или ID"
        value={search}
        onChange={event => dispatch(changeSearchString(event.target.value))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Очистить поиск пользователей"
                onClick={() => dispatch(changeSearchString(''))}
              >
                <CloseRoundedIcon />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
      <span>Поиск по имени, email, номеру и учебному заведению</span>
    </div>
  );
}
