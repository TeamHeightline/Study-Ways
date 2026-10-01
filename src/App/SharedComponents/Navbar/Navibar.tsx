import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, IconButton } from '@mui/material';
import { AutoAwesomeOutlined, GridViewOutlined, LibraryBooksOutlined, QuizOutlined, BookmarkBorderOutlined, HistoryOutlined, BarChartOutlined, SchoolOutlined, Close, Menu as MenuIcon, EditOutlined } from '@mui/icons-material';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import haveStatus from '../../../Shared/Store/UserStore/utils/HaveStatus';
import PersonalMenu from './PersonalMenu';
import { LoginButton } from './LoginButton';

const links = [
  { to: '/courses', label: 'Каталог курсов', icon: <GridViewOutlined /> },
  { to: '/ai-course', label: 'AI-траектория', icon: <AutoAwesomeOutlined />, badge: 'AI' },
  { to: '/cards', label: 'Библиотека знаний', icon: <LibraryBooksOutlined /> },
  { to: '/all-questions', label: 'Практика и тесты', icon: <QuizOutlined /> },
];
const personal = [
  { to: '/recent-cards', label: 'История обучения', icon: <HistoryOutlined /> },
  { to: '/bookmarks', label: 'Сохранённое', icon: <BookmarkBorderOutlined /> },
  { to: '/selfstatistic', label: 'Мои результаты', icon: <BarChartOutlined /> },
];

export const Navibar = observer(() => {
  const { loginWithPopup, isLoading, isAuthenticated } = useAuth0();
  const [loginError, setLoginError] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const signIn = async () => {
    setLoginPending(true); setLoginError(false);
    try { await loginWithPopup(); setOpen(false); } catch { setLoginError(true); } finally { setLoginPending(false); }
  };
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = [...links, ...personal].find(item => location.pathname.startsWith(item.to))?.label || 'Пространство обучения';
  const renderLinks = (items: typeof personal) => items.map(item => (
    <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => `sw-nav-link ${isActive ? 'is-active' : ''}`}>
      {item.icon}<span>{item.label}</span>{'badge' in item && <small>AI</small>}
    </NavLink>
  ));
  return <>
    {open && <button className="sw-nav-backdrop" aria-label="Закрыть меню" onClick={() => setOpen(false)} />}
    <aside className={`sw-sidebar ${open ? 'is-open' : ''}`} aria-label="Основная навигация" onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>
      <Link to="/courses" className="sw-brand" onClick={() => setOpen(false)}><span className="sw-brand-icon"><SchoolOutlined /></span>study<span>ways</span><i /></Link>
      <IconButton className="sw-close-menu" aria-label="Закрыть меню" onClick={() => setOpen(false)}><Close /></IconButton>
      <div className="sw-nav-caption">ПРОСТРАНСТВО ЗНАНИЙ</div>
      <nav>{renderLinks(links)}</nav>
      <div className="sw-nav-caption">МОЁ ОБУЧЕНИЕ</div>
      {UserStorage.isLogin || isAuthenticated ? <nav>{renderLinks(personal)}{haveStatus(['ADMIN', 'TEACHER', 'CARD_EDITOR']) && renderLinks([{ to: '/editor', label: 'Редактор', icon: <EditOutlined /> }])}</nav> : <section className="sw-learning-signin" aria-label="Личное обучение после входа">
        <h2>Ваш прогресс — под рукой</h2>
        <p>Войдите, чтобы возвращаться к материалам и следить за результатами.</p>
        <ul><li><HistoryOutlined /><span>История просмотренного</span></li><li><BookmarkBorderOutlined /><span>Материалы в закладках</span></li><li><BarChartOutlined /><span>Результаты тестов</span></li></ul>
        <Button fullWidth variant="contained" disableElevation onClick={signIn} disabled={isLoading || loginPending}>{isLoading || loginPending ? 'Подождите…' : 'Войти в аккаунт'}</Button>
        {loginError && <div className="sw-learning-signin-error" role="status">Вход не завершён. Попробуйте ещё раз.</div>}
      </section>}
    </aside>
    <header className="sw-topbar"><div className="sw-topbar-title"><IconButton className="sw-open-menu" aria-label="Открыть меню" aria-expanded={open} onClick={() => setOpen(true)}><MenuIcon /></IconButton><span>Обучение</span><span className="sw-breadcrumb">/</span><strong>{title}</strong></div><div className="sw-account">{UserStorage.isLogin ? <PersonalMenu /> : <LoginButton />}</div></header>
  </>;
});

