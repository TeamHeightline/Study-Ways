import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Skeleton } from '@mui/material';
import { ArrowForward, AutoAwesomeOutlined, Search, SchoolOutlined, AccountTreeOutlined, TuneOutlined, Close, Check } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAppDispatch, useAppSelector } from '../../../../App/ReduxStore/RootStore';
import { loadCourseDataThunk } from '../redux-store/async-functions';
import CourseByData from './CourseByData';

export const DEFAULT_COURSE_TITLE = 'Название курса по умолчанию';

export default function CoursePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courses_data: courses, is_loading_course_data: loading, is_loading_error_course_data: error } = useAppSelector(state => state.coursePage);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  useEffect(() => { dispatch(loadCourseDataThunk()); }, [dispatch]);
  const available = courses.filter(course => course.name !== DEFAULT_COURSE_TITLE);
  const visible = useMemo(() => {
    const result = available.filter(course => {
      const author = course.users_customuser?.users_userprofile;
      const matches = `${course.name} ${author?.firstname || ''} ${author?.lastname || ''}`.toLocaleLowerCase('ru').includes(search.toLocaleLowerCase('ru').trim());
      return matches && (filter === 'all' || (filter === 'multi' ? course.course_data.length > 1 : course.course_data.length === 1));
    });
    return sort === 'name' ? result.sort((a, b) => a.name.localeCompare(b.name, 'ru')) : result;
  }, [available, search, filter, sort]);

  return <div className="sw-catalog">
    <Helmet><title>Каталог курсов — Study Ways</title></Helmet>
    <div className="sw-page-heading"><div><div className="sw-eyebrow">ЗНАНИЯ, КОТОРЫЕ ВЕДУТ ВПЕРЁД</div><h1>Ваш следующий шаг<span>.</span></h1><p>Выберите направление. Найдите свой уровень. Двигайтесь в своём темпе.</p></div><span className="sw-heading-symbol"><SchoolOutlined /></span></div>
    <section className="sw-hero" aria-labelledby="learning-heading">
      <div className="sw-hero-copy"><span className="sw-pill"><span /> ОСМЫСЛЕННОЕ ОБУЧЕНИЕ</span><h2 id="learning-heading">От первого открытия<br />к глубокому пониманию.</h2><p>Многоуровневые курсы, в которых знания складываются в систему. Начните с основ и выбирайте, насколько глубоко хотите погрузиться.</p><a className="sw-primary-link" href="#course-catalog">Найти свой курс <ArrowForward fontSize="small" /></a><span className="sw-hero-footnote">Ваш темп. Ваша глубина. Ваш путь.</span></div>
      <div className="sw-path-art" aria-label="Путь обучения: основы, практика, углубление">
        <span className="sw-art-label">ВАША ТРАЕКТОРИЯ РОСТА</span>
        <svg className="sw-path-lines" viewBox="0 0 440 270" aria-hidden="true"><path d="M60 208 C140 208 100 138 213 138 S280 55 378 55" /><path d="M213 138 C300 138 305 210 389 210" className="sw-path-branch" /></svg>
        <div className="sw-path-node sw-node-one"><span className="sw-node-icon"><Check /></span><div><small>УРОВЕНЬ 01</small><strong>Основы</strong><span>Понять главное</span></div></div>
        <div className="sw-path-node sw-node-two"><span className="sw-node-icon"><AccountTreeOutlined /></span><div><small>УРОВЕНЬ 02</small><strong>Практика</strong><span>Применить знания</span></div></div>
        <div className="sw-path-node sw-node-three"><span className="sw-node-icon"><AutoAwesomeOutlined /></span><div><small>УРОВЕНЬ 03</small><strong>Углубление</strong><span>Увидеть больше</span></div></div>
        <span className="sw-art-star">✳</span><span className="sw-art-caption">Больше, чем линейный курс</span>
      </div>
    </section>
    <div className="sw-benefits"><div><span>01</span><p><strong>От простого к сложному</strong>Несколько уровней в одном курсе</p></div><div><span>02</span><p><strong>Знания через практику</strong>Материалы, задания и проверка себя</p></div><div><span>03</span><p><strong>Индивидуальный маршрут</strong>Выбирайте подходящую глубину</p></div></div>
    <section id="course-catalog" className="sw-course-section" aria-labelledby="catalog-title">
      <div className="sw-section-heading"><div><h2 id="catalog-title">Исследуйте курсы <span>{loading ? '…' : available.length}</span></h2><p>Большие идеи начинаются с любопытства.</p></div><label className="sw-sort"><TuneOutlined fontSize="small" /><select aria-label="Сортировка курсов" value={sort} onChange={event => setSort(event.target.value)}><option value="default">По умолчанию</option><option value="name">По названию</option></select></label></div>
      <div className="sw-catalog-controls"><div className="sw-filter-tabs" role="group" aria-label="Уровни курсов">{[{ id: 'all', label: 'Все курсы' }, { id: 'multi', label: 'Многоуровневые' }, { id: 'single', label: 'Один уровень' }].map(tab => <button key={tab.id} aria-pressed={filter === tab.id} className={filter === tab.id ? 'active' : ''} onClick={() => setFilter(tab.id)}>{tab.label}</button>)}</div><div className="sw-search"><Search fontSize="small" /><input aria-label="Поиск по названию курса или автору" placeholder="Название курса или автор" value={search} onChange={event => setSearch(event.target.value)} />{search && <button onClick={() => setSearch('')} aria-label="Очистить поиск"><Close fontSize="small" /></button>}</div></div>
      {error ? <Alert severity="warning" action={<Button onClick={() => dispatch(loadCourseDataThunk())}>Повторить</Button>}>Не удалось загрузить курсы. Попробуйте ещё раз.</Alert> : loading ? <div className="sw-course-grid" aria-label="Загрузка курсов">{[1, 2, 3, 4, 5, 6].map(id => <Skeleton key={id} variant="rounded" height={290} />)}</div> : visible.length ? <div className="sw-course-grid">{visible.map(course => <CourseByData key={course.id} courseData={course} onChangePosition={position => navigate(`/course?id=${course.id}&activePage=${position.activePage}&selectedPage=${position.selectedPage}&selectedRow=${position.selectedRow}&selectedIndex=${position.selectedIndex}`)} />)}</div> : <div className="sw-empty" role="status"><Search /><h3>{available.length ? 'Пока ничего не нашлось' : 'Курсы появятся здесь'}</h3><p>{available.length ? 'Попробуйте другое название или выберите все курсы.' : 'Каталог готовится к новым открытиям. Загляните чуть позже.'}</p>{available.length > 0 && <Button onClick={() => { setSearch(''); setFilter('all'); }}>Сбросить фильтры</Button>}</div>}
    </section>
    <section className="sw-ai-banner"><span className="sw-ai-icon"><AutoAwesomeOutlined /></span><div><h3>Любопытство есть. С чего начать?</h3><p>Расскажите AI, что хотите изучить, и соберите свою траекторию.</p></div><Link to="/ai-course">Подобрать путь <ArrowForward fontSize="small" /></Link></section>
    <footer className="sw-page-footer"><span>studyways <span>·</span> Пространство осмысленного обучения</span><span>Каждый шаг имеет значение.</span></footer>
  </div>;
}
