import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {
  IBasicUserInformation,
  user_access_level,
} from '../../Shared/ServerLayer/Types/user.types';

export const ACCESS_LEVELS = [
  {
    value: 'STUDENT',
    label: 'Студент',
    plural: 'Студенты',
    description: 'Обучение и прохождение учебных материалов.',
    Icon: SchoolOutlinedIcon,
  },
  {
    value: 'CARD_EDITOR',
    label: 'Автор карточек',
    plural: 'Авторы карточек',
    description: 'Возможности студента, создание карточек и курсов.',
    Icon: AutoStoriesOutlinedIcon,
  },
  {
    value: 'TEACHER',
    label: 'Преподаватель',
    plural: 'Преподаватели',
    description: 'Работа с учебными материалами, экзаменами и статистикой.',
    Icon: CastForEducationOutlinedIcon,
  },
  {
    value: 'ADMIN',
    label: 'Администратор',
    plural: 'Администраторы',
    description: 'Полный доступ к управлению приложением.',
    Icon: AdminPanelSettingsOutlinedIcon,
  },
] as const;

export function getAccessLevel(value: user_access_level) {
  return ACCESS_LEVELS.find(level => level.value === value);
}

export function getUserName(user: IBasicUserInformation) {
  return (
    [user.users_userprofile?.firstname, user.users_userprofile?.lastname]
      .map(part => part?.trim())
      .filter(Boolean)
      .join(' ') || 'Имя не указано'
  );
}

export function getUserInitials(user: IBasicUserInformation) {
  const parts = [
    user.users_userprofile?.firstname,
    user.users_userprofile?.lastname,
  ]
    .map(part => part?.trim())
    .filter(Boolean);
  return parts.length
    ? parts
        .map(part => part?.[0])
        .join('')
        .slice(0, 2)
        .toLocaleUpperCase('ru')
    : (user.username?.[0] || '?').toLocaleUpperCase('ru');
}

const normalize = (text: string) =>
  text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();

export function matchesUser(user: IBasicUserInformation, query: string) {
  const profile = user.users_userprofile;
  const text = normalize(
    [
      user.id,
      user.username,
      profile?.firstname,
      profile?.lastname,
      profile?.users_educationorganization?.organization_name,
      profile?.group,
    ]
      .filter(value => value != null)
      .join(' '),
  );
  return normalize(query)
    .split(/\s+/)
    .every(term => text.includes(term));
}
