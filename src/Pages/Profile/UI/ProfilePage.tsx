import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  PaperProps,
  Select,
  Skeleton,
  TextField,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import { loadMyProfile, updateProfile } from '../redux-store/async-acrions';
import { changeProfileData, resetProfileChanges } from '../redux-store';
import { IProfile } from '../redux-store/types';
import './profile.css';
const schools: Record<string, string> = {
  '1': 'ФМЛ №30',
  '2': 'РГПУ им. А. И. Герцена',
  '3': 'СПбГЭТУ «ЛЭТИ»',
  '4': 'Университет ИТМО',
};
const editable = (profile: IProfile | null) =>
  JSON.stringify(
    ['firstname', 'lastname', 'avatar_src', 'study_in_id', 'group'].map(
      key => profile?.[key] ?? '',
    ),
  );
const ProfilePage = observer(({ className = '', ...props }: PaperProps) => {
  const dispatch = useAppDispatch();
  const {
    profileData: profile,
    savedProfileData,
    pending,
    pendingUpdate,
    loadError,
    saveError,
    saved,
  } = useAppSelector(state => state.profile);
  useEffect(() => {
    if (UserStorage.isLogin) dispatch(loadMyProfile());
  }, [dispatch, UserStorage.isLogin]);
  const changed = editable(profile) !== editable(savedProfileData);
  const field = (key: keyof IProfile, value: IProfile[keyof IProfile]) =>
    dispatch(changeProfileData({ key, value }));
  const name = [profile?.firstname, profile?.lastname]
    .filter(Boolean)
    .join(' ')
    .trim();
  const username = profile?.users_customuser?.username || 'Пользователь';
  const initials = [profile?.firstname, profile?.lastname]
    .map(value => value?.trim().charAt(0) || '')
    .join('');
  const study = String(profile?.study_in_id || '');
  const avatar = profile?.avatar_src?.trim() || '';
  let avatarValid = true;
  if (avatar) {
    try {
      avatarValid = ['http:', 'https:'].includes(new URL(avatar).protocol);
    } catch {
      avatarValid = false;
    }
  }
  return (
    <Paper elevation={0} className={`sw-profile ${className}`} {...props}>
      <header className="sw-profile-heading sw-card-library-heading">
        <h1 className="sw-card-library-title">Мой профиль</h1>
        <p>
          Расскажите о себе — так преподавателям будет проще узнать вас в
          результатах обучения.
        </p>
      </header>
      {pending && !profile && UserStorage.isLogin ? (
        <div className="sw-profile-loading" aria-label="Загрузка профиля">
          <Skeleton variant="rounded" height={300} />
          <Skeleton variant="rounded" height={450} />
        </div>
      ) : loadError && !profile ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => dispatch(loadMyProfile())}>
              Повторить
            </Button>
          }
        >
          Не удалось загрузить профиль.
        </Alert>
      ) : !profile ? (
        <Alert severity="info">
          Войдите в аккаунт, чтобы редактировать профиль.
        </Alert>
      ) : (
        <>
          <div className="sw-profile-layout">
            <aside className="sw-profile-summary">
              <Avatar
                src={avatarValid ? avatar : undefined}
                className="sw-profile-avatar"
              >
                {initials || <PersonOutlineRoundedIcon />}
              </Avatar>
              <h2>{name || 'Ваше имя'}</h2>
              <span className="sw-profile-username">{username}</span>
              <div className="sw-profile-summary-study">
                <SchoolOutlinedIcon />
                <span>
                  {schools[study] ||
                    (study
                      ? 'Учебное заведение №' + study
                      : 'Учебное заведение не указано')}
                  {profile.group && <small>Группа {profile.group}</small>}
                </span>
              </div>
              <p>
                Имя и фамилия отображаются в статистике и результатах экзаменов.
                Все поля можно оставить пустыми.
              </p>
            </aside>
            <form
              className="sw-profile-form"
              onSubmit={event => {
                event.preventDefault();
                if (changed && !pendingUpdate && avatarValid)
                  dispatch(updateProfile(profile));
              }}
            >
              <section className="sw-profile-section">
                <div className="sw-profile-section-heading">
                  <span>
                    <PersonOutlineRoundedIcon />
                  </span>
                  <div>
                    <h2>Личные данные</h2>
                    <p>Как к вам обращаться</p>
                  </div>
                </div>
                <div className="sw-profile-fields">
                  <TextField
                    fullWidth
                    label="Имя"
                    autoComplete="given-name"
                    value={profile.firstname || ''}
                    disabled={pendingUpdate}
                    onChange={e => field('firstname', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Фамилия"
                    autoComplete="family-name"
                    value={profile.lastname || ''}
                    disabled={pendingUpdate}
                    onChange={e => field('lastname', e.target.value)}
                  />
                </div>
              </section>
              <section className="sw-profile-section">
                <div className="sw-profile-section-heading">
                  <span>
                    <SchoolOutlinedIcon />
                  </span>
                  <div>
                    <h2>Обучение</h2>
                    <p>Учебное заведение и ваша группа</p>
                  </div>
                </div>
                <div className="sw-profile-fields">
                  <FormControl fullWidth disabled={pendingUpdate}>
                    <InputLabel id="sw-profile-school">
                      Учебное заведение
                    </InputLabel>
                    <Select
                      labelId="sw-profile-school"
                      label="Учебное заведение"
                      value={study}
                      onChange={e =>
                        field(
                          'study_in_id',
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    >
                      <MenuItem value="">Не указано</MenuItem>
                      {Object.entries(schools).map(([id, title]) => (
                        <MenuItem key={id} value={id}>
                          {title}
                        </MenuItem>
                      ))}
                      {study && !schools[study] && (
                        <MenuItem value={study}>
                          Учебное заведение №{study}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Группа"
                    value={profile.group || ''}
                    disabled={pendingUpdate}
                    onChange={e => field('group', e.target.value)}
                    placeholder="Например, 101"
                  />
                </div>
              </section>
              <section className="sw-profile-section">
                <div className="sw-profile-section-heading">
                  <span>
                    <ImageOutlinedIcon />
                  </span>
                  <div>
                    <h2>Фото профиля</h2>
                    <p>Изображение по ссылке</p>
                  </div>
                </div>
                <TextField
                  fullWidth
                  label="Ссылка на изображение"
                  value={profile.avatar_src || ''}
                  disabled={pendingUpdate}
                  onChange={e => field('avatar_src', e.target.value)}
                  error={!avatarValid}
                  placeholder="https://…"
                  helperText={
                    !avatarValid
                      ? 'Укажите ссылку, начинающуюся с https:// или http://.'
                      : 'Предпросмотр появится в карточке профиля. Можно оставить поле пустым.'
                  }
                />
              </section>
              {saveError && (
                <Alert severity="error">
                  Не удалось сохранить профиль. Ваши изменения сохранены в форме
                  — попробуйте ещё раз.
                </Alert>
              )}
              {loadError && (
                <Alert severity="warning">
                  Не удалось обновить данные профиля.
                </Alert>
              )}
              <footer className="sw-profile-save">
                <span role="status">
                  {pendingUpdate ? (
                    'Сохраняем изменения…'
                  ) : saved ? (
                    <>
                      <CheckCircleOutlineRoundedIcon />
                      Профиль сохранён
                    </>
                  ) : changed ? (
                    'Есть несохранённые изменения'
                  ) : (
                    'Все изменения сохранены'
                  )}
                </span>
                <div>
                  <Button
                    disabled={!changed || pendingUpdate}
                    onClick={() => dispatch(resetProfileChanges())}
                  >
                    Отменить
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={!changed || pendingUpdate || !avatarValid}
                    startIcon={
                      pendingUpdate ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SaveOutlinedIcon />
                      )
                    }
                  >
                    {pendingUpdate ? 'Сохраняем…' : 'Сохранить'}
                  </Button>
                </div>
              </footer>
            </form>
          </div>
        </>
      )}
    </Paper>
  );
});
export default ProfilePage;
