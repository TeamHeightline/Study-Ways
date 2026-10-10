import {
  CourseData,
  CourseElementData,
  hasMaterial,
} from '../../EditCourseByID/course-data';
import { positionDataI } from '../../CourseMicroView/V2/Store/CourseMicroStoreByID';
export interface MobileCourseNode {
  row: number;
  page: number;
  index: number;
  item: CourseElementData;
}
export function courseNodes(
  lines: CourseData,
  row?: number,
): MobileCourseNode[] {
  return lines.flatMap((line, rowIndex) =>
    row !== undefined && row !== rowIndex
      ? []
      : line.SameLine.flatMap((page, pageIndex) =>
          page.CourseFragment.flatMap(({ CourseElement: item }, index) =>
            hasMaterial(item)
              ? [{ row: rowIndex, page: pageIndex + 1, index, item }]
              : [],
          ),
        ),
  );
}
export function mobilePosition(
  lines: CourseData,
  position: positionDataI,
  explicit = true,
): Required<positionDataI> {
  if (!explicit) {
    const first = courseNodes(lines)[0];
    if (first)
      return {
        activePage: first.page,
        selectedPage: first.page,
        selectedRow: first.row,
        selectedIndex: first.index,
      };
  }
  const requestedRow = Number(position.selectedRow);
  const row =
    Number.isInteger(requestedRow) &&
    requestedRow >= 0 &&
    requestedRow < lines.length
      ? requestedRow
      : 0;
  const pages = lines[row]?.SameLine.length || 1;
  const page =
    Number.isInteger(position.activePage) &&
    position.activePage > 0 &&
    position.activePage <= pages
      ? position.activePage
      : 1;
  const nodes = courseNodes(lines, row).filter(node => node.page === page);
  const chosen =
    nodes.find(
      node =>
        position.selectedPage === page && node.index === position.selectedIndex,
    ) || nodes[0];
  return {
    activePage: page,
    selectedPage: page,
    selectedRow: row,
    selectedIndex: chosen?.index ?? -1,
  };
}
export function mobileCourseUrl(
  courseID: number,
  node: Pick<MobileCourseNode, 'page' | 'row' | 'index'>,
) {
  return `/course?id=${courseID}&activePage=${node.page}&selectedPage=${node.page}&selectedRow=${node.row}&selectedIndex=${node.index}`;
}
