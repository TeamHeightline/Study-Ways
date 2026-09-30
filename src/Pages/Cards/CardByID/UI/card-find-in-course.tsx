import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { Alert, AlertTitle } from '@mui/lab';
import { CardByIDStore } from '../Store/CardByIDStore';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

interface ICardFindInCourseProps extends PaperProps {
  card_store: CardByIDStore;
}

const CardFindInCourse = observer(
  ({ card_store, ...props }: ICardFindInCourseProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const cardNOTFindInCourses = card_store.findInCourseArrayForUI?.length == 0;

    if (cardNOTFindInCourses) {
      return <div />;
    }

    return (
      <Paper elevation={0} {...props}>
        <Alert className="sw-course-reference" severity="info" variant="outlined" sx={{ maxWidth: 550 }}>
          <AlertTitle>
            {card_store.findInCourseArrayForUI?.length == 1
              ? 'Материал входит в курс'
              : 'Материал входит в курсы'}
          </AlertTitle>
          {card_store.findInCourseArrayForUI?.map((course) => (
            <Button
              key={course.course_id}
              title={'Открыть курс'}
              className="sw-course-reference-button"
              endIcon={<ArrowForwardRoundedIcon />}
              color={'info'}
              onClick={() => {
                if (pathname == '/course') {
                  navigate(
                    '/course?' +
                      `id=${course.course_id}&activePage=${
                        course.position.activePage
                      }&selectedPage=${
                        course.position.selectedPage
                      }&selectedRow=${
                        course.position.selectedRow
                      }&selectedIndex=${course.position.selectedIndex}`,
                  );
                } else {
                  navigate(
                    '/course?' +
                      `id=${course.course_id}&activePage=${
                        course.position.activePage
                      }&selectedPage=${
                        course.position.selectedPage
                      }&selectedRow=${
                        course.position.selectedRow
                      }&selectedIndex=${course.position.selectedIndex}`,
                  );
                }
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
