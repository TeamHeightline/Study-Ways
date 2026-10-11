import React from 'react';
import CourseFragment from './CourseFragment';
import { CourseFragmentData, ICourseLine, hasMaterial } from './course-data';

interface Props {
  row: ICourseLine;
  openPageIndex: number;
  lIndex: number;
  updateCourseRow: (row: ICourseLine) => void;
  editCard: (id: string) => void;
}
export default function CourseRow({
  row,
  openPageIndex,
  lIndex,
  updateCourseRow,
  editCard,
}: Props) {
  const fragment = row.SameLine[openPageIndex - 1];
  if (!fragment) return null;
  const filled = fragment.CourseFragment.filter(item =>
    hasMaterial(item.CourseElement),
  ).length;
  const update = (next: CourseFragmentData) =>
    updateCourseRow({
      ...row,
      SameLine: row.SameLine.map((page, index) =>
        index === openPageIndex - 1 ? next : page,
      ),
    });
  return (
    <section className="sw-coedit-lane" aria-label={`Уровень ${lIndex + 1}`}>
      <header className="sw-coedit-lane-label">
        <span>{String(lIndex + 1).padStart(2, '0')}</span>
        <div>
          <h3>Уровень {lIndex + 1}</h3>
          <p>
            {filled} из {fragment.CourseFragment.length} позиций
          </p>
        </div>
      </header>
      <CourseFragment
        key={`${lIndex}-${openPageIndex}`}
        fragment={fragment}
        level={lIndex + 1}
        editCard={editCard}
        updateFragment={update}
      />
    </section>
  );
}
