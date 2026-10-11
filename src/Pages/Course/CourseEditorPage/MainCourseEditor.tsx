import React, { useRef, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EditCourseByID from '../EditCourseByID/EditCourseByID';
import {
  CourseLines,
  courseStats,
  normalizeCourseData,
} from '../EditCourseByID/course-data';
import { useAppDispatch } from '../../../App/ReduxStore/RootStore';
import {
  courseApi,
  useGetOwnCoursesQuery,
  OwnCourseSummary,
} from '../course-api';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { observer } from 'mobx-react';
import { FILE_URL } from '../../../settings';
import './course-editor-page.css';

export const CREATE_COURSE_WITH_DEFAULT_VALUE = gql`
  mutation CREATE_COURSE_WITH_DEFAULT_VALUE($default_data: GenericScalar) {
    createCardCourse(input: { courseData: $default_data }) {
      course {
        courseData
        id
        name
      }
    }
  }
`;
const MainCourseEditor = observer(function MainCourseEditor() {
  const userId = UserStorage.user_data?.id;
  const [selectedCourseID, setSelectedCourseID] = useState<string>();
  const [search, setSearch] = useState('');
  const [createError, setCreateError] = useState(false);
  const createLock = useRef(false);
  const dispatch = useAppDispatch();
  const {
    currentData: data,
    isFetching: loading,
    error,
    refetch,
  } = useGetOwnCoursesQuery(userId, { skip: !userId });
  const [createCourse, { loading: creating }] = useMutation(
    CREATE_COURSE_WITH_DEFAULT_VALUE,
  );

  const create = async () => {
    if (createLock.current) return;
    createLock.current = true;
    setCreateError(false);
    try {
      const result = await createCourse({
        variables: { default_data: normalizeCourseData(CourseLines) },
      });
      const id = result.data?.createCardCourse?.course?.id;
      if (!id) throw new Error('No course ID returned');
      const course = result.data?.createCardCourse?.course;
      if (course) {
        const summary: OwnCourseSummary = {
          id: String(id),
          name: course.name ?? null,
          courseData: course.courseData,
          cards_cardcourseimage: null,
        };
        dispatch(
          courseApi.util.updateQueryData('getOwnCourses', userId, draft => {
            if (!draft.some(item => item.id === String(id)))
              draft.unshift(summary);
          }),
        );
      }
      dispatch(courseApi.util.invalidateTags(['OwnCourses']));
      setSearch('');
      setSelectedCourseID(String(id));
    } catch {
      setCreateError(true);
    } finally {
      createLock.current = false;
    }
  };
  const refresh = () => {
    void refetch().catch(() => void 0);
  };
  if (selectedCourseID)
    return (
      <EditCourseByID
        course_id={selectedCourseID}
        onChange={action => {
          if (action === 'goBack') {
            setSelectedCourseID(undefined);
            refresh();
          }
        }}
      />
    );

  const courses = (data || []).map(course => ({
    ...course,
    stats: courseStats(normalizeCourseData(course.courseData)),
    cover: course.cards_cardcourseimage?.image,
  }));
  const query = search.trim().toLocaleLowerCase('ru');
  const visible = courses.filter(course =>
    `${(course.name || '').replace(/\[.*?\]/g, '')} ${course.id}`
      .toLocaleLowerCase('ru')
      .includes(query),
  );
  const filled = courses.filter(
    course => course.stats.cards || course.stats.links,
  ).length;
  const initialLoading = loading && !data;
  const createButton = (label: string) => (
    <Button
      variant="contained"
      disableElevation
      disabled={creating || initialLoading}
      startIcon={
        creating ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <AddRoundedIcon />
        )
      }
      onClick={create}
    >
      {creating ? 'Создаём курс…' : label}
    </Button>
  );
  return (
    <div className="sw-courselist">
      <header className="sw-courselist-heading">
        <div className="sw-card-library-heading">
          <h1 className="sw-card-library-title">Мои курсы</h1>
          <p>
            Собирайте материалы в многоуровневые курсы и создавайте путь
            обучения.
          </p>
        </div>
        {createButton('Создать курс')}
      </header>
      {createError && (
        <Alert
          severity="error"
          onClose={() => setCreateError(false)}
          className="sw-courselist-alert"
        >
          Не удалось создать курс. Попробуйте ещё раз.
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={refresh}>
              Повторить
            </Button>
          }
          className="sw-courselist-alert"
        >
          Не удалось {data ? 'обновить список курсов' : 'загрузить курсы'}.
        </Alert>
      )}
      <div className="sw-courselist-summary">
        <span>
          <strong>{courses.length}</strong>Всего курсов
        </span>
        <span>
          <strong>{filled}</strong>С материалами
        </span>
        <span>
          <strong>{courses.length - filled}</strong>Пока пустых
        </span>
      </div>
      <div className="sw-courselist-search">
        <TextField
          fullWidth
          size="small"
          label="Поиск по названию или номеру"
          value={search}
          onChange={event => setSearch(event.target.value)}
          disabled={initialLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Очистить поиск курсов"
                  size="small"
                  onClick={() => setSearch('')}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />
        <span>
          {query
            ? `Найдено: ${visible.length}`
            : 'Выберите курс для редактирования'}
        </span>
      </div>
      {initialLoading ? (
        <div
          className="sw-courselist-grid"
          aria-busy="true"
          aria-label="Загрузка курсов"
        >
          {[0, 1, 2].map(key => (
            <Skeleton key={key} variant="rounded" height={305} />
          ))}
        </div>
      ) : visible.length ? (
        <div className="sw-courselist-grid">
          {visible.map(course => {
            const title =
              (course.name || '').replace(/\[.*?\]/g, '').trim() ||
              'Без названия';
            const cover = course.cover
              ? `${FILE_URL}/${course.cover}`
              : undefined;
            return (
              <Card
                key={course.id}
                elevation={0}
                className={`sw-courselist-card sw-courselist-palette-${Number(course.id) % 4 || 0}`}
              >
                <CardActionArea
                  aria-label={`Редактировать курс «${title}»`}
                  onClick={() => setSelectedCourseID(String(course.id))}
                >
                  <div className="sw-courselist-card-cover">
                    <span className="sw-courselist-type">
                      <AccountTreeOutlinedIcon />
                      {course.stats.levels > 1 ? 'Многоуровневый курс' : 'Курс'}
                    </span>
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        onError={event => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="sw-courselist-geometry"
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                        <i />
                        <AccountTreeOutlinedIcon />
                      </div>
                    )}
                    <span className="sw-courselist-number">№{course.id}</span>
                  </div>
                  <div className="sw-courselist-card-body">
                    <h2>{title}</h2>
                    <div className="sw-courselist-card-meta">
                      <span>
                        <LayersOutlinedIcon />
                        Уровней: {course.stats.levels}
                      </span>
                      <span>
                        <LibraryBooksOutlinedIcon />
                        Карточек: {course.stats.cards}
                      </span>
                    </div>
                    <footer>
                      <span>
                        {course.stats.cards || course.stats.links
                          ? `Страниц: ${course.stats.pages}`
                          : 'Добавьте первые материалы'}
                      </span>
                      <span>
                        Редактировать
                        <ArrowForwardRoundedIcon />
                      </span>
                    </footer>
                  </div>
                </CardActionArea>
              </Card>
            );
          })}
        </div>
      ) : (
        !error && (
          <div className="sw-courselist-empty">
            <span>
              <AccountTreeOutlinedIcon />
            </span>
            <h2>{query ? 'Курсы не найдены' : 'Здесь появятся ваши курсы'}</h2>
            <p>
              {query
                ? 'Попробуйте другое название или номер курса.'
                : 'Создайте курс, добавьте уровни и наполните их учебными материалами.'}
            </p>
            {query ? (
              <Button variant="outlined" onClick={() => setSearch('')}>
                Сбросить поиск
              </Button>
            ) : (
              createButton('Создать первый курс')
            )}
          </div>
        )
      )}
    </div>
  );
});
export default MainCourseEditor;
