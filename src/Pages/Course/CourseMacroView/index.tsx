import { useCoursePageMaterials } from '../course-materials-api';
import { Alert } from '@mui/material';
import { Box, Card, Divider, Grid, Stack, Chip, Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import { positionDataI } from '../CourseMicroView/V2/Store/CourseMicroStoreByID';
import Image from './image';
import Stepper from './stepper';
import CardRow from './card-row';
import Title from './title';
import Author from './author';
import {
  AutoAwesomeOutlined,
  ArrowBack,
  ArrowForward,
  AccountTreeOutlined,
} from '@mui/icons-material';

interface ICourseMacroViewProps extends BoxProps {
  courseID: number;
  onCardSelect?: (card_id: string) => void;
  positionData: positionDataI;
}

const CARD_WIDTH = 108;
const CARD_PADDING = 11.5;
const NUMBER_OF_CARD = 10;
const ADDITIONAL_SPACE = 20;

export default function CourseMacroView({
  courseID,
  positionData,
  onCardSelect,
  ...props
}: ICourseMacroViewProps) {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<null | any>(null);
  const [showAllLevels, setShowAllLevels] = useState(false);
  useEffect(() => setShowAllLevels(false), [courseID]);
  const [activePage, setActivePage] = useState(
    positionData.activePage > 0 ? positionData.activePage : 1,
  );
  const [viewedCardIDs, setViewedCardIds] = useState(new Set());

  useEffect(() => {
    if (courseID) {
      axiosClient
        .get(`/page/course-by-id/get-course-by-id/${courseID}`)
        .then(res => setCourseData(res.data));
    }
  }, [courseID]);

  useEffect(() => {
    if (onCardSelect) {
      const cardID =
        courseData?.course_data?.[Number(positionData?.selectedRow)]
          ?.SameLine?.[Number(positionData.selectedPage) - 1]?.CourseFragment?.[
          Number(positionData?.selectedIndex)
        ]?.CourseElement?.id;

      if (!cardID) {
        return;
      }
      onCardSelect(cardID);
      setViewedCardIds(previous => new Set(previous).add(cardID));
    }
  }, [positionData, onCardSelect, courseData]);

  useEffect(() => {
    setActivePage(positionData.activePage > 0 ? positionData.activePage : 1);
  }, [positionData.activePage]);

  const pageMaterials = useCoursePageMaterials(
    courseID,
    activePage,
    courseData?.id === courseID,
  );

  if (!courseData) {
    return <Box {...props} />;
  }
  const course_main_line_index =
    Number((courseData?.name || '').match(/\[(.*?)\]/)?.[1]) - 1;
  const levels = courseData.course_data || [];
  const populatedLevelIndices = levels.reduce(
    (indices: number[], line, index) => {
      const hasMaterial = line.SameLine?.[activePage - 1]?.CourseFragment?.some(
        fragment => {
          const item = fragment?.CourseElement;
          return item?.type === 'course-link'
            ? Boolean(item.course_link)
            : Boolean(item?.id);
        },
      );
      if (hasMaterial) indices.push(index);
      return indices;
    },
    [],
  );
  const firstVisibleLevel = populatedLevelIndices[0] ?? -1;
  const lastVisibleLevel =
    populatedLevelIndices[populatedLevelIndices.length - 1] ?? -1;
  const filledLevels = levels.map((line, index) => ({
    index,
    title:
      index === course_main_line_index
        ? 'Основной маршрут'
        : `Уровень ${String(index + 1).padStart(2, '0')}`,
    count:
      line.SameLine?.reduce(
        (total, page) =>
          total +
          page.CourseFragment.filter(fragment => fragment?.CourseElement?.id)
            .length,
        0,
      ) || 0,
  }));

  return (
    <Box {...props}>
      <Box className="sw-course-header">
        <Box className="sw-course-header-copy">
          <Box className="sw-course-kicker">
            <AccountTreeOutlined fontSize="small" /> ПУТЬ ОБУЧЕНИЯ{' '}
            <Chip label={`${filledLevels.length} уровней`} size="small" />
          </Box>
          <Stack direction={'row'} spacing={1} alignItems="center">
            <Image
              courseData={courseData}
              courseID={courseID}
              HEIGHT_OF_COURSE_MACRO_VIEW={200}
            />
            <Box>
              <Title courseData={courseData} />
              <Author courseData={courseData} />
            </Box>
          </Stack>
          <Box className="sw-course-header-actions">
            <button type="button" onClick={() => navigate('/courses')}>
              <ArrowBack fontSize="small" /> К каталогу
            </button>
            <span>
              <AutoAwesomeOutlined fontSize="small" /> Собирайте знания в
              систему
            </span>
          </Box>
        </Box>
        <Box className="sw-course-progress" aria-label="Прогресс по уровням">
          {(showAllLevels ? filledLevels : filledLevels.slice(0, 5)).map(
            level => (
              <div
                className={`sw-progress-level ${level.index === positionData.selectedRow ? 'is-current' : ''} ${level.count ? 'has-content' : ''}`}
                key={level.index}
              >
                <span className="sw-progress-dot">{level.index + 1}</span>
                <div>
                  <small>{level.title}</small>
                  <strong>
                    {level.count
                      ? `${level.count} ${level.count === 1 ? 'материал' : 'материалов'}`
                      : 'В разработке'}
                  </strong>
                </div>
              </div>
            ),
          )}
          {filledLevels.length > 5 && (
            <Button
              className="sw-course-levels-toggle"
              size="small"
              aria-expanded={showAllLevels}
              onClick={() => setShowAllLevels(value => !value)}
            >
              {showAllLevels
                ? 'Свернуть'
                : 'Показать ещё · ' + (filledLevels.length - 5)}
            </Button>
          )}
        </Box>
      </Box>

      <Box className="sw-course-level-map">
        {pageMaterials.isError && (
          <Alert
            severity="error"
            action={
              <Button onClick={() => pageMaterials.refetch()}>Повторить</Button>
            }
          >
            Не удалось загрузить материалы страницы курса.
          </Alert>
        )}
        <div className="sw-course-level-intro">
          <h2>Карта курса</h2>
          <p>
            Вправо — дальше по теме. Между уровнями — другое изложение
            материала.
          </p>
        </div>
        <div
          className="sw-course-map-viewport"
          tabIndex={0}
          role="region"
          aria-label="Двумерная карта курса. Прокрутите вправо для следующих материалов."
        >
          {levels.map((line, index) =>
            index >= firstVisibleLevel && index <= lastVisibleLevel ? (
              <CardRow
                key={index}
                index={index}
                activePage={activePage}
                courseData={courseData}
                CARD_WIDTH={200}
                course_main_line_index={course_main_line_index}
                positionData={positionData}
                courseID={courseID}
                viewedCardIDs={viewedCardIDs}
                materials={pageMaterials.materials}
                materialsLoading={pageMaterials.isFetching}
              />
            ) : null,
          )}
        </div>
        <div className="sw-course-map-legend">
          <span>― Продвижение по теме</span>
          <span>┆ Смена уровня изложения</span>
          <span>Прокрутите карту вправо →</span>
        </div>
        {!levels.some(line =>
          line.SameLine?.[activePage - 1]?.CourseFragment?.some(
            fragment =>
              fragment?.CourseElement?.id ||
              fragment?.CourseElement?.course_link,
          ),
        ) && (
          <p className="sw-course-level-empty">
            На этой странице пока нет материалов.
          </p>
        )}
      </Box>
      <Stepper
        activePage={activePage}
        setActivePage={setActivePage}
        courseData={courseData}
      />
    </Box>
  );
}
