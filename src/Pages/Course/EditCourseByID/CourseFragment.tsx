import React from 'react';
import EditCourseItem from './EditCourseItem';
import { CourseElementData, CourseFragmentData } from './course-data';

interface Props {
  fragment: CourseFragmentData;
  level: number;
  updateFragment: (fragment: CourseFragmentData) => void;
  editCard: (id: string) => void;
}
export default function CourseFragment({
  fragment,
  level,
  updateFragment,
  editCard,
}: Props) {
  const update = (index: number, value: CourseElementData) =>
    updateFragment({
      ...fragment,
      CourseFragment: fragment.CourseFragment.map((item, position) =>
        position === index ? { ...item, CourseElement: value } : item,
      ),
    });
  return (
    <div className="sw-coedit-track">
      {fragment.CourseFragment.map(({ CourseElement: item }, index) => (
        <EditCourseItem
          key={index}
          item_data={item}
          item_position={index}
          level={level}
          editCard={editCard}
          updateItem={value => update(index, value)}
        />
      ))}
    </div>
  );
}
