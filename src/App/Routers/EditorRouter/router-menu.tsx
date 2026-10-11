import { useUserSession } from '../../../Shared/Store/UserStore/user-session';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { privateRoutes } from './routes';

const labels: Record<string, string> = {
  course: 'Курсы',
  card2: 'Карточки',
  se: 'Темы',
  question: 'Вопросы',
  qse: 'Серии вопросов',
  statistic2: 'Статистика',
  exam: 'Экзамены',
  checkquestion: 'Проверка вопросов',
  'status-editor': 'Уровни доступа',
};

const RouterMenu = () => {
  const session = useUserSession();
  const haveStatus = (roles: string[]) => roles.includes(session.role);
  return (
    <section className="sw-editor-menu">
      <header>
        <span>РАБОЧЕЕ ПРОСТРАНСТВО</span>
        <h1>Редактор</h1>
        <p>Создавайте материалы и управляйте обучением.</p>
      </header>
      <nav aria-label="Разделы редактора">
        {privateRoutes
          .filter(route => route.title && haveStatus(route.status))
          .map(route => (
            <NavLink
              key={route.navigate}
              to={`/editor/${route.navigate}`}
              title={route.title}
              className={({ isActive }) =>
                `sw-editor-link${isActive ? ' is-active' : ''}`
              }
            >
              {route.icon}
              <span>{labels[route.navigate!] || route.title}</span>
            </NavLink>
          ))}
      </nav>
    </section>
  );
};

export default RouterMenu;
