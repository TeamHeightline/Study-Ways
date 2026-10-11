export interface CourseElementData {
  id: string | number | null;
  type?: string;
  course_link?: string;
  [key: string]: unknown;
}
export interface CourseElement {
  CourseElement: CourseElementData;
}
export interface CourseFragmentData {
  CourseFragment: CourseElement[];
}
export interface ICourseLine {
  SameLine: CourseFragmentData[];
}
export type CourseData = ICourseLine[];
export interface CourseDraft {
  name: string;
  lines: CourseData;
}

export const createFragment = (): CourseFragmentData => ({
  CourseFragment: Array.from({ length: 10 }, () => ({
    CourseElement: { id: null },
  })),
});
export const CourseLines: CourseData = Array.from({ length: 4 }, () => ({
  SameLine: [createFragment()],
}));
export const cardIDs = (value: CourseElementData['id']) =>
  String(value ?? '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);
export const hasMaterial = (item: CourseElementData) =>
  item.type === 'course-link'
    ? Boolean(item.course_link)
    : cardIDs(item.id).length > 0;

export function normalizeCourseData(value: unknown): CourseData {
  if (!Array.isArray(value)) return [];
  const pages = Math.max(1, ...value.map(row => row?.SameLine?.length || 0));
  return value.map(row => ({
    ...row,
    SameLine: Array.from({ length: pages }, (_, page) => {
      const fragment = row?.SameLine?.[page];
      return {
        ...fragment,
        CourseFragment: Array.from(
          { length: Math.max(10, fragment?.CourseFragment?.length || 0) },
          (_, index) => ({
            ...fragment?.CourseFragment?.[index],
            CourseElement: {
              ...fragment?.CourseFragment?.[index]?.CourseElement,
              id:
                fragment?.CourseFragment?.[index]?.CourseElement?.id == null
                  ? null
                  : String(fragment.CourseFragment[index].CourseElement.id),
            },
          }),
        ),
      };
    }),
  }));
}

export function appendPage(lines: CourseData): CourseData {
  if (!lines.length) return [{ SameLine: [createFragment()] }];
  return lines.map(line => ({
    ...line,
    SameLine: [...line.SameLine, createFragment()],
  }));
}
export function addLevel(lines: CourseData, atTop: boolean): CourseData {
  const line = {
    SameLine: Array.from(
      { length: lines[0]?.SameLine.length || 1 },
      createFragment,
    ),
  };
  return atTop ? [line, ...lines] : [...lines, line];
}
export function courseStats(lines: CourseData) {
  const ids = new Set<string>();
  let links = 0;
  lines.forEach(line =>
    line.SameLine.forEach(page =>
      page.CourseFragment.forEach(({ CourseElement: item }) => {
        if (item.type === 'course-link') {
          if (item.course_link) links++;
        } else cardIDs(item.id).forEach(id => ids.add(id));
      }),
    ),
  );
  return {
    cards: ids.size,
    links,
    levels: lines.length,
    pages: lines[0]?.SameLine.length || 1,
  };
}
export function previewLink(id: string | number, lines: CourseData) {
  for (let row = 0; row < lines.length; row++) {
    for (let page = 0; page < lines[row].SameLine.length; page++) {
      const index = lines[row].SameLine[page].CourseFragment.findIndex(
        item =>
          cardIDs(item.CourseElement.id).length &&
          item.CourseElement.type !== 'course-link',
      );
      if (index >= 0)
        return `/course?id=${id}&activePage=${page + 1}&selectedPage=${page + 1}&selectedRow=${row}&selectedIndex=${index}`;
    }
  }
  return undefined;
}
