import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  CourseMicroStoreByID,
  positionDataI,
} from "../Store/CourseMicroStoreByID";
import { Card, CardActionArea, Stack, Tooltip } from "@mui/material";
import CourseNavigation from "./CourseNavigation";
import { useNavigate } from "react-router-dom";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";

interface ICourseMicroViewProps extends React.HTMLAttributes<HTMLDivElement> {
  course_id: number;
  position_data?: positionDataI;
  onPosition?: (selected_position: positionDataI) => void;
  onCardSelect?: (selected_card_id: string | undefined) => void;
  onCourseImageClick?: (clicked: string) => void;
  showArrowNavigation?: boolean;
  ignoreURLRedirectOnSelectCard?: boolean;
}

const CourseMicroView = observer(
  ({
    course_id,
    position_data,
    onPosition,
    showArrowNavigation,
    onCardSelect,
    ignoreURLRedirectOnSelectCard,
    ...props
  }: ICourseMicroViewProps) => {
    const [courseStore] = useState(new CourseMicroStoreByID(course_id));
    const navigate = useNavigate();
    const isMobile = isMobileHook();
    useEffect(() => courseStore.changeID(course_id), [course_id]);

    useEffect(
      () =>
        courseStore.changeIsIgnoreRouteAfterSelect(
          ignoreURLRedirectOnSelectCard,
        ),
      [ignoreURLRedirectOnSelectCard],
    );

    useEffect(() => {
      if (onPosition && courseStore.position && courseStore.isPositionChanged) {
        onPosition(courseStore.position);
        courseStore.isPositionChanged = false;
      }
    }, [courseStore.position]);

    useEffect(() => {
      const new_selected_card_id = String(
        courseStore.get_card_id_by_position(courseStore.position),
      );
      if (onCardSelect && new_selected_card_id) {
        onCardSelect(new_selected_card_id);
      }
      if (new_selected_card_id) {
        courseStore.viewedCardIDs.add(new_selected_card_id);
      }
    }, [Number(courseStore.get_card_id_by_position(courseStore.position))]);

    useEffect(() => {
      if (position_data) {
        courseStore.positionData = position_data;
      }
    }, [position_data]);

    return (
      <div
        {...props}
        style={{
          padding: 0,
          overflowX: isMobile ? "auto" : undefined,
          maxWidth: isMobile ? window.innerWidth - 40 : "",
        }}
      >
        <Card style={{ padding: 0, width: 500 }} variant="outlined">
          <CourseNavigation courseStore={courseStore} />
        </Card>
        {/* {showArrowNavigation && <ArrowNavigation courseStore={courseStore}/>}*/}
      </div>
    );
  },
);

export default CourseMicroView;
