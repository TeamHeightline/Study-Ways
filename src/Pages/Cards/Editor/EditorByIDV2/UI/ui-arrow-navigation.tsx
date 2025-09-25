import { observer } from "mobx-react";
import React from "react";
import { Button, ButtonGroup, Collapse, Stack } from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { CESObject } from "../Store/CardEditorStorage";
import { UiSelectCard } from "./ui-select-card";

type IArrowNavigationProps = React.HTMLAttributes<HTMLDivElement>;

export const UiArrowNavigation = observer(
  ({ ...props }: IArrowNavigationProps) => (
    <div {...props}>
      <Collapse in={CESObject.getField("is_card_use_arrow_navigation", false)}>
        <Stack spacing={1}>
          <Stack direction={"row"} spacing={1}>
            <ButtonGroup size="medium" color="primary">
              <Button>
                <KeyboardArrowLeftOutlinedIcon />
              </Button>
            </ButtonGroup>
            <UiSelectCard card_direction={"card_before_id"} />
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <ButtonGroup size="medium" color="primary">
              <Button>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </ButtonGroup>
            <UiSelectCard card_direction={"card_down_id"} />
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <ButtonGroup size="medium" color="primary">
              <Button>
                <KeyboardArrowUpOutlinedIcon />
              </Button>
            </ButtonGroup>
            <UiSelectCard card_direction={"card_up_id"} />
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <ButtonGroup size="medium" color="primary">
              <Button>
                <KeyboardArrowRightOutlinedIcon />
              </Button>
            </ButtonGroup>
            <UiSelectCard card_direction={"card_next_id"} />
          </Stack>
        </Stack>
      </Collapse>
    </div>
  ),
);
