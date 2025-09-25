import { observer } from "mobx-react";
import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { ICourseData, ICoursePosition } from "./types";

interface IArrowNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  coursePosition: ICoursePosition;
  courseData: ICourseData;
  onChangePosition?: (elementPosition: ICoursePosition) => void;
}

const ArrowNavigation = observer(
  ({
    courseData,
    coursePosition,
    onChangePosition,
    ...props
  }: IArrowNavigationProps) => {
    const goToCardByArrow = (card_arrow: "Back" | "Down" | "Up" | "Next") => {
      const new_position = coursePosition;
      if (card_arrow === "Back") {
        new_position.selectedIndex = Number(new_position.selectedIndex) - 1;
      }
      if (card_arrow === "Down") {
        new_position.selectedRow = Number(new_position.selectedRow) + 1;
      }
      if (card_arrow === "Up") {
        new_position.selectedRow = Number(new_position.selectedRow) - 1;
      }
      if (card_arrow === "Next") {
        new_position.selectedIndex = Number(new_position.selectedIndex) + 1;
      }
      if (onChangePosition) {
        onChangePosition(new_position);
      }
    };
    return (
      <div {...props}>
        <ButtonGroup
          id={"course-btn-group"}
          size="large"
          color="primary"
          aria-label="group"
          className="mt-2"
        >
          <Button
            onClick={() => goToCardByArrow("Back")}
            disabled={Number(coursePosition.selectedIndex) <= 0}
          >
            <KeyboardArrowLeftOutlinedIcon />
          </Button>
          <Button
            onClick={() => goToCardByArrow("Down")}
            disabled={Number(coursePosition.selectedRow) >= 3}
          >
            <KeyboardArrowDownOutlinedIcon />
          </Button>
          <Button
            onClick={() => goToCardByArrow("Up")}
            disabled={Number(coursePosition.selectedRow) <= 0}
          >
            <KeyboardArrowUpOutlinedIcon />
          </Button>
          <Button
            onClick={() => goToCardByArrow("Next")}
            disabled={Number(coursePosition.selectedIndex) >= 9}
          >
            <KeyboardArrowRightOutlinedIcon />
          </Button>
        </ButtonGroup>
      </div>
    );
  },
);

export default ArrowNavigation;
