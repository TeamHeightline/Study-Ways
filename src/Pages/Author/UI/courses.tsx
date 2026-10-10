import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICourseData } from '../../Course/Page/redux-store/types';
import CourseByData from '../../Course/Page/UI/CourseByData';

export function Courses({ courses }: { courses: ICourseData[] }) {
  const navigate = useNavigate();
  return (
    <div className="sw-author-course-grid">
      {courses.map(course => (
        <CourseByData
          key={course.id}
          courseData={course}
          onChangePosition={position => {
            window.scrollTo(0, 0);
            navigate(
              `/course?id=${course.id}&activePage=${position.activePage}&selectedPage=${position.selectedPage}&selectedRow=${position.selectedRow}&selectedIndex=${position.selectedIndex}`,
            );
          }}
        />
      ))}
    </div>
  );
}
