import React, { useEffect } from 'react';
import {
  useCourseNavigation,
  positionDataI,
} from '../store/CourseMicroStoreByID';
import { Alert, Button, Skeleton, Card } from '@mui/material';
import CourseNavigation from './CourseNavigation';
import { useNavigate } from 'react-router-dom';
import { useGetCourseQuery } from '../../../course-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { isMobileHook } from '../../../../../shared/custom-hooks/isMobileHook';
interface ICourseMicroViewProps extends React.HTMLAttributes<HTMLDivElement> {
  course_id: number;
  position_data?: positionDataI;
  onPosition?: (selected_position: positionDataI) => void;
  onCardSelect?: (selected_card_id: string | undefined) => void;
  onCourseImageClick?: (clicked: string) => void;
  showArrowNavigation?: boolean;
  ignoreURLRedirectOnSelectCard?: boolean;
}
const CourseMicroView = ({
  course_id,
  position_data,
  onPosition,
  showArrowNavigation,
  onCardSelect,
  ignoreURLRedirectOnSelectCard,
  ...props
}: ICourseMicroViewProps) => {
  const navigate = useNavigate();
  const isMobile = isMobileHook();
  const query = useGetCourseQuery(
    Number.isInteger(course_id) && course_id > 0 ? course_id : skipToken,
  );
  const courseStore = useCourseNavigation(
    course_id,
    query.currentData,
    ignoreURLRedirectOnSelectCard,
  );
  useEffect(() => {
    if (onPosition && courseStore.position && courseStore.isPositionChanged) {
      onPosition(courseStore.position);
      courseStore.acknowledge();
    }
  }, [courseStore.position]);
  useEffect(() => {
    const selectedId = courseStore.get_card_id_by_position(
      courseStore.position,
    );
    const new_selected_card_id =
      selectedId == null ? undefined : String(selectedId);
    if (onCardSelect && new_selected_card_id) {
      onCardSelect(new_selected_card_id);
    }
    if (new_selected_card_id) {
      courseStore.markViewed(new_selected_card_id);
    }
  }, [Number(courseStore.get_card_id_by_position(courseStore.position))]);
  useEffect(() => {
    if (position_data) {
      courseStore.setPosition(position_data, false);
    }
  }, [position_data]);
  if (query.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить курс.
      </Alert>
    );
  if (query.currentData === null)
    return <Alert severity="info">Курс не найден.</Alert>;
  if (!query.currentData || courseStore.id !== course_id)
    return <Skeleton height={200} />;
  return (
    <div
      {...props}
      style={{
        padding: 0,
        overflowX: isMobile ? 'auto' : undefined,
        maxWidth: isMobile ? window.innerWidth - 40 : '',
      }}
    >
      <Card style={{ padding: 0, width: 500 }} variant="outlined">
        <CourseNavigation courseStore={courseStore} />
      </Card>
      {/* {showArrowNavigation && <ArrowNavigation courseStore={courseStore}/>}*/}
    </div>
  );
};
export default CourseMicroView;
