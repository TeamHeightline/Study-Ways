import { CoursePageCard } from '../../course-materials-api';
import { BoxProps } from '@mui/material/Box/Box';
import CardItem from './card-element/card-element';
import React from 'react';
import { positionDataI } from '../../CourseMicroView/V2/Store/CourseMicroStoreByID';
import LinkElement from './link-element';
interface Props extends BoxProps {
  materials: Record<string, CoursePageCard>;
  materialsLoading: boolean;
  courseData: any;
  activePage: number;
  index: number;
  CARD_WIDTH: number;
  course_main_line_index: number;
  positionData: positionDataI;
  courseID: number;
  viewedCardIDs: any;
}
const present = item =>
  item?.type === 'course-link' ? Boolean(item.course_link) : Boolean(item?.id);
export default function CardRow({
  courseData,
  activePage,
  index,
  course_main_line_index,
  positionData,
  courseID,
  viewedCardIDs,
  materials,
  materialsLoading,
}: Props) {
  const rows = courseData?.course_data || [];
  // Trim only trailing empty columns across all levels; preserve interior coordinates.
  const columns = Math.max(
    1,
    ...rows.map(line =>
      (line.SameLine?.[activePage - 1]?.CourseFragment || []).reduce(
        (last, fragment, column) =>
          present(fragment?.CourseElement) ? column + 1 : last,
        0,
      ),
    ),
  );
  const trackWidth = columns * 240 - 24;
  const items = (rows[index]?.SameLine?.[activePage - 1]?.CourseFragment || [])
    .map((fragment, itemIndex) => ({
      item: fragment?.CourseElement,
      itemIndex,
    }))
    .filter(({ item }) => present(item));
  const below =
    rows[index + 1]?.SameLine?.[activePage - 1]?.CourseFragment || [];
  return (
    <div
      className={
        'sw-course-lane' + (index === course_main_line_index ? ' is-main' : '')
      }
    >
      <div className="sw-course-lane-label">
        <span>УРОВЕНЬ {index + 1}</span>
        {index === course_main_line_index && <small>Основной маршрут</small>}
      </div>
      <div className="sw-course-lane-track" style={{ width: trackWidth }}>
        <svg
          className="sw-course-paths"
          width={trackWidth}
          height={270}
          aria-hidden="true"
        >
          {items.slice(1).map(({ itemIndex }, i) => (
            <path
              key={'h' + itemIndex}
              d={
                'M ' +
                (items[i].itemIndex * 240 + 204) +
                ' 98 H ' +
                (itemIndex * 240 + 12)
              }
              className="sw-course-path-forward"
            />
          ))}
          {items
            .filter(({ itemIndex }) => present(below[itemIndex]?.CourseElement))
            .map(({ itemIndex }) => (
              <path
                key={'v' + itemIndex}
                d={'M ' + (itemIndex * 240 + 108) + ' 205 V 270'}
                className="sw-course-path-alternative"
              />
            ))}
        </svg>
        {items.map(({ item, itemIndex }) => (
          <div
            key={itemIndex}
            className="sw-course-level-cell sw-course-map-node"
            style={{ left: itemIndex * 240 + 12 }}
          >
            {item.type === 'course-link' ? (
              <LinkElement
                courseLink={item.course_link}
                size={{ width: '100%', height: 200 }}
              />
            ) : (
              <CardItem
                card_id={item.id}
                size={{ width: 192, height: 108 }}
                rowIndex={index}
                itemIndex={itemIndex}
                positionData={positionData}
                activePage={activePage}
                courseID={courseID}
                viewedCardIDs={viewedCardIDs}
                cardData={materials[String(item.id).trim()]}
                loading={materialsLoading}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
