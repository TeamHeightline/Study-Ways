import { ThemeManulNote } from '../../../../shared/theme/ThemeManulNote';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useQueryParams from '../../../../shared/custom-hooks/useQueryParams';
import { positionDataI } from '../../course-micro-view/v2/store/CourseMicroStoreByID';
import CardByID from '../../../cards/card-by-id/ui/card-by-id';
import { Box, Stack } from '@mui/material';
import CourseMacroView from '../../course-macro-view';
import { isMobileHook } from '../../../../shared/custom-hooks/isMobileHook';
import MobileCourseView from './MobileCourseView';
type ICourseByURLProps = React.HTMLAttributes<HTMLDivElement>;
const CourseByURL = ({ ...props }: ICourseByURLProps) => {
  const [activeCardID, setActiveCardID] = useState<undefined | string>();
  const queryParams = useQueryParams();
  const isMobile = isMobileHook();
  const courseID = Number(queryParams.get('id'));
  const changeSelectedCardID = useCallback(
    (new_card_id?: string) => setActiveCardID(new_card_id),
    [],
  );
  useEffect(() => setActiveCardID(undefined), [courseID]);
  const position_data: positionDataI = useMemo(
    () => ({
      activePage: Number(queryParams.get('activePage')),
      selectedPage: Number(queryParams.get('selectedPage')),
      selectedIndex: Number(queryParams.get('selectedIndex')),
      selectedRow: Number(queryParams.get('selectedRow')),
    }),
    [queryParams.toString()],
  );
  // эти все сплиты ID по "," нужны только для того, что у нас в одной ячейки может быть много
  // значений, разделенных той самой запятой.
  return (
    <Box className="sw-course-reader">
      <Box sx={{ ml: isMobile ? 0 : 2 }}>
        {!isMobile ? (
          <CourseMacroView
            key={courseID}
            courseID={Number(queryParams.get('id'))}
            positionData={position_data}
            onCardSelect={changeSelectedCardID}
          />
        ) : (
          <MobileCourseView
            key={courseID}
            courseID={courseID}
            position={position_data}
            explicitPosition={queryParams.has('selectedRow')}
            onCardSelect={changeSelectedCardID}
          />
        )}
      </Box>
      <Stack direction={'column'} {...props}>
        {activeCardID
          ?.split(',')
          .map(id => id.trim())
          .filter(id => /^\d+$/.test(id))
          .map((card_id, index) => (
            <CardByID
              is_hidden_navigation
              is_hidden_go_back_button
              is_hidden_similar_cards
              card_id={Number(card_id)}
              key={`${card_id}___${index}`}
            />
          ))}
      </Stack>
      <ThemeManulNote context="course" />
    </Box>
  );
};
export default CourseByURL;
