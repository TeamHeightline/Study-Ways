import React, { useMemo, useState } from 'react';
import { Alert, Button, Skeleton } from '@mui/material';
import {
  ArrowBack,
  ArrowDownward,
  AutoStoriesOutlined,
  Close,
  LibraryBooksOutlined,
  Search,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthorData, getAuthorName } from '../Store/types';
import {
  useGetCardPreviewsQuery,
  useGetCourseCatalogQuery,
} from '../Store/author-api';
import { DEFAULT_COURSE_TITLE } from '../../Course/Page/constants';
import { ThemeIllustration } from '../../../Shared/Theme/ThemeIllustration';
import { ThemeManulNote } from '../../../Shared/Theme/ThemeManulNote';
import { Author } from './author';
import { Courses } from './courses';
import { Cards } from './cards';

const PAGE_SIZE = 12;

export function AuthorPage({ author }: { author: AuthorData }) {
  const courseIDs = useMemo(
    () => [...new Set(author.cards_cardcourse?.map(item => item.id))],
    [author],
  );
  const cardIDs = useMemo(
    () => [...new Set(author.cards_card?.map(item => item.id))],
    [author],
  );
  const coursesQuery = useGetCourseCatalogQuery(undefined, {
    skip: !courseIDs.length,
  });
  const cardsQuery = useGetCardPreviewsQuery(undefined, {
    skip: !cardIDs.length,
  });
  const [section, setSection] = useState<'courses' | 'cards'>(
    courseIDs.length || !cardIDs.length ? 'courses' : 'cards',
  );
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const courses = useMemo(() => {
    const ids = new Set(courseIDs);
    return (coursesQuery.data || []).filter(
      course => ids.has(course.id) && course.name !== DEFAULT_COURSE_TITLE,
    );
  }, [courseIDs, coursesQuery.data]);
  const cards = useMemo(
    () =>
      cardIDs.flatMap(id =>
        cardsQuery.data?.[String(id)] ? [cardsQuery.data[String(id)]] : [],
      ),
    [cardIDs, cardsQuery.data],
  );
  const searchText = search.trim().toLocaleLowerCase('ru');
  const filteredCourses = courses.filter(course =>
    course.name.toLocaleLowerCase('ru').includes(searchText),
  );
  const filteredCards = cards.filter(card =>
    `${card.title} ${card.cards_card_connected_theme?.map(theme => theme.cards_unstructuredtheme?.text || '').join(' ') || ''}`
      .toLocaleLowerCase('ru')
      .includes(searchText),
  );
  const query = section === 'courses' ? coursesQuery : cardsQuery;
  const total = section === 'courses' ? courses.length : cards.length;
  const found =
    section === 'courses' ? filteredCourses.length : filteredCards.length;
  const loading = query.isFetching && !query.data;
  const courseCount = coursesQuery.data ? courses.length : courseIDs.length;
  const cardCount = cardsQuery.data ? cards.length : cardIDs.length;
  const resetSearch = () => {
    setSearch('');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="sw-author-page">
      <Helmet>
        <title>{getAuthorName(author)} — автор — Study Ways</title>
      </Helmet>
      <nav className="sw-author-breadcrumb" aria-label="Навигация по странице">
        <Link to="/courses">
          <ArrowBack /> Каталог курсов
        </Link>
        <span>/</span>
        <span>Страница автора</span>
      </nav>
      <Author author={author} courseCount={courseCount} cardCount={cardCount} />
      <section
        className="sw-author-materials"
        aria-labelledby="author-materials-title"
      >
        <div className="sw-author-section-heading">
          <div>
            <span className="sw-eyebrow">ОТКРЫВАЙТЕ И ИЗУЧАЙТЕ</span>
            <h2 id="author-materials-title">Материалы автора</h2>
            <p>
              Выберите курс для последовательного изучения или отдельную
              карточку.
            </p>
          </div>
          <span className="sw-author-section-icon" aria-hidden="true">
            <AutoStoriesOutlined />
          </span>
        </div>
        <div className="sw-author-controls">
          <div
            className="sw-author-filters"
            role="group"
            aria-label="Тип материалов автора"
          >
            {(
              [
                {
                  id: 'courses',
                  label: 'Курсы',
                  icon: <AutoStoriesOutlined />,
                  count: courseCount,
                },
                {
                  id: 'cards',
                  label: 'Карточки',
                  icon: <LibraryBooksOutlined />,
                  count: cardCount,
                },
              ] as const
            ).map(item => (
              <button
                type="button"
                key={item.id}
                aria-pressed={section === item.id}
                aria-controls="author-materials-list"
                onClick={() => {
                  setSection(item.id);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {item.icon}
                {item.label}
                <span>{item.count}</span>
              </button>
            ))}
          </div>
          <div className="sw-search sw-author-search">
            <Search fontSize="small" />
            <input
              type="search"
              aria-label="Поиск по материалам автора"
              placeholder="Найти материал автора"
              value={search}
              onChange={event => {
                setSearch(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
            {search && (
              <button
                type="button"
                onClick={resetSearch}
                aria-label="Очистить поиск"
              >
                <Close fontSize="small" />
              </button>
            )}
          </div>
        </div>
        <div id="author-materials-list" aria-busy={loading}>
          {query.isError && (
            <Alert
              severity="warning"
              action={
                <Button
                  color="inherit"
                  disabled={query.isFetching}
                  onClick={() => query.refetch()}
                >
                  Повторить
                </Button>
              }
            >
              Не удалось загрузить{' '}
              {section === 'courses' ? 'курсы' : 'карточки'} автора. Попробуйте
              ещё раз.
            </Alert>
          )}
          {loading ? (
            <div
              className="sw-author-course-grid"
              aria-label="Загрузка материалов автора"
            >
              {[1, 2, 3].map(id => (
                <Skeleton key={id} variant="rounded" height={310} />
              ))}
            </div>
          ) : query.isError && !total ? null : found ? (
            <>
              <p className="sw-author-results" role="status">
                {searchText ? `Найдено: ${found}` : `Всего: ${total}`} ·
                Показано: {Math.min(visibleCount, found)}
              </p>
              {section === 'courses' ? (
                <Courses courses={filteredCourses.slice(0, visibleCount)} />
              ) : (
                <Cards cards={filteredCards.slice(0, visibleCount)} />
              )}
              {found > visibleCount && (
                <div className="sw-author-show-more">
                  <Button
                    variant="outlined"
                    endIcon={<ArrowDownward />}
                    onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                  >
                    Показать ещё
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="sw-empty" role="status">
              <ThemeIllustration
                variant="sleeping"
                className="sw-empty-mascot"
                fallback={<Search />}
              />
              <h3>
                {searchText
                  ? 'Ничего не нашлось'
                  : section === 'courses'
                    ? 'Курсы ещё впереди'
                    : 'Карточки появятся здесь'}
              </h3>
              <p>
                {searchText
                  ? 'Попробуйте другое название или очистите поиск.'
                  : `У автора пока нет доступных ${section === 'courses' ? 'курсов' : 'карточек'}. Загляните в другой раздел.`}
              </p>
              {searchText && (
                <Button onClick={resetSearch}>Сбросить поиск</Button>
              )}
            </div>
          )}
        </div>
      </section>
      <ThemeManulNote context="library" />
      <footer className="sw-author-footer">
        <AutoStoriesOutlined /> Хорошие идеи становятся больше, когда ими
        делятся.
      </footer>
    </div>
  );
}
