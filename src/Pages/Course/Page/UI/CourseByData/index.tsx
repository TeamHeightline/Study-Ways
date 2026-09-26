import React from 'react';
import { ArrowForward, LayersOutlined, MenuBookOutlined, AccountTreeOutlined } from '@mui/icons-material';
import ArrowNavigation from './ArrowNavigation';
import { FILE_URL } from '../../../../../settings';
import { ICourseData, ICoursePosition } from './types';

interface ICourseMicroViewProps extends React.HTMLAttributes<HTMLDivElement> {
  courseData: ICourseData;
  coursePosition?: ICoursePosition;
  onChangePosition?: (elementPosition: ICoursePosition) => void;
}
export default function CourseByData({ courseData, coursePosition, onChangePosition }: ICourseMicroViewProps) {
  const rows = courseData.course_data || [];
  let first: ICoursePosition | undefined;
  const cards = new Set<string>();
  rows.forEach((row, rowIndex) => row.SameLine.forEach((page, pageIndex) => page.CourseFragment.forEach((fragment, index) => {
    const id = fragment.CourseElement.id;
    if (id) {
      id.split(',').filter(Boolean).forEach(card => cards.add(card));
      if (!first) first = { activePage: pageIndex + 1, selectedPage: pageIndex + 1, selectedRow: rowIndex, selectedIndex: index };
    }
  })));
  const author = courseData.users_customuser?.users_userprofile;
  const authorName = [author?.firstname, author?.lastname].filter(Boolean).join(' ') || 'Study Ways';
  const palettes = ['sage', 'sand', 'lavender', 'blue'];
  const palette = palettes[courseData.id % palettes.length];
  return <div className={`sw-course-card sw-palette-${palette}`}>
    <button className="sw-course-open" disabled={!first || !onChangePosition} onClick={() => first && onChangePosition?.(first)}>
      <div className="sw-course-cover"><span className="sw-course-type"><AccountTreeOutlined />{rows.length > 1 ? 'Многоуровневый курс' : 'Образовательный курс'}</span>{courseData.cards_cardcourseimage?.image ? <img src={`${FILE_URL}/${courseData.cards_cardcourseimage.image}`} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} /> : <div className="sw-course-geometry" aria-hidden="true"><i /><i /><i /><span>{String(courseData.id).padStart(2, '0')}</span></div>}<div className="sw-cover-levels" aria-hidden="true">{Array.from({ length: Math.min(Math.max(rows.length, 1), 5) }, (_, index) => <i key={index} style={{ height: 7 + index * 4 }} />)}</div></div>
      <div className="sw-course-body"><h3>{courseData.name}</h3><div className="sw-course-meta"><span><LayersOutlined />Уровней: {rows.length}</span><span><MenuBookOutlined />Материалов: {cards.size}</span></div><div className="sw-course-bottom"><span className="sw-author-avatar">{authorName.charAt(0)}</span><span>{authorName}</span><ArrowForward className="sw-card-arrow" fontSize="small" /></div>{!first && <span className="sw-course-soon">Материалы готовятся</span>}</div>
    </button>
    {coursePosition && <ArrowNavigation coursePosition={coursePosition} courseData={courseData} onChangePosition={onChangePosition} />}
  </div>;
}
