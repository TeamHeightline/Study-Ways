import { observer } from 'mobx-react';
import React from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Alert, AlertTitle, Button, Paper } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import { useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useGetCardCourseLinksQuery } from '../../../Course/Page/Store/course-catalog-api';

interface ICardFindInCourseProps extends PaperProps {
  card_store: CardByIDStore;
}

const CardFindInCourse = observer(
  ({ card_store, ...props }: ICardFindInCourseProps) => {
    const navigate = useNavigate();
    const cardId = card_store.id;
    const {
      currentData: courses = [],
      isError,
      refetch,
    } = useGetCardCourseLinksQuery(
      cardId && Number.isSafeInteger(cardId) && cardId > 0 ? cardId : skipToken,
    );
    if (isError)
      return (
        <Alert
          severity="warning"
          action={<Button onClick={() => refetch()}>Повторить</Button>}
        >
          Не удалось проверить, в какие курсы входит материал.
        </Alert>
      );
    if (!courses.length) return null;

    return (
      <Paper elevation={0} {...props}>
        <Alert
          className="sw-course-reference"
          severity="info"
          variant="outlined"
          sx={{ maxWidth: 550 }}
        >
          <AlertTitle>
            {courses.length === 1
              ? 'Материал входит в курс'
              : 'Материал входит в курсы'}
          </AlertTitle>
          {courses.map(course => (
            <Button
              key={`${course.course_id}:${course.position.selectedRow}:${course.position.selectedPage}:${course.position.selectedIndex}`}
              title="Открыть курс"
              className="sw-course-reference-button"
              endIcon={<ArrowForwardRoundedIcon />}
              color="info"
              onClick={() => {
                navigate(
                  `/course?id=${course.course_id}&activePage=${course.position.activePage}&selectedPage=${course.position.selectedPage}&selectedRow=${course.position.selectedRow}&selectedIndex=${course.position.selectedIndex}`,
                );
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>{course.course_name}</span>
            </Button>
          ))}
        </Alert>
      </Paper>
    );
  },
);

export default CardFindInCourse;
