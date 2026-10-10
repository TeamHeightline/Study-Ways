import {
  addLevel,
  appendPage,
  createFragment,
  normalizeCourseData,
} from './course-data';

test('new pages and levels keep every empty position independent', () => {
  const original = [{ SameLine: [createFragment()] }];
  const expanded = addLevel(appendPage(original), true);
  expanded[0].SameLine[0].CourseFragment[0].CourseElement.id = '123';
  expect(expanded[0].SameLine[0].CourseFragment[1].CourseElement.id).toBeNull();
  expect(expanded[0].SameLine[1].CourseFragment[0].CourseElement.id).toBeNull();
  expect(expanded[1].SameLine[0].CourseFragment[0].CourseElement.id).toBeNull();
  expect(original[0].SameLine).toHaveLength(1);
});

test('normalizing an existing course preserves coordinates, series, links and metadata', () => {
  const source = [
    {
      SameLine: [
        {
          CourseFragment: [
            { CourseElement: { id: 812, extra: 'keep' } },
            { CourseElement: { id: null } },
            { CourseElement: { id: '813,814' } },
            {
              CourseElement: {
                id: null,
                type: 'course-link',
                course_link: '/course?id=7',
              },
            },
          ],
        },
      ],
    },
  ];
  const normalized = normalizeCourseData(source);
  expect(normalized[0].SameLine[0].CourseFragment.slice(0, 4)).toEqual([
    { CourseElement: { id: '812', extra: 'keep' } },
    { CourseElement: { id: null } },
    { CourseElement: { id: '813,814' } },
    {
      CourseElement: {
        id: null,
        type: 'course-link',
        course_link: '/course?id=7',
      },
    },
  ]);
  expect(normalized[0].SameLine[0].CourseFragment).toHaveLength(10);
  expect(source[0].SameLine[0].CourseFragment[0].CourseElement.id).toBe(812);
});
