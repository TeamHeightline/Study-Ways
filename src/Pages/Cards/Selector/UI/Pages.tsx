import { observer } from "mobx-react";
import React from "react";
import { Pagination, Stack } from "@mui/material";
import { CSSObject } from "../Store/CardSelectorStore";

type IPagesProps = React.HTMLAttributes<HTMLDivElement>;

export const Pages = observer(({ ...props }: IPagesProps) => (
  <div {...props}>
    <Stack alignItems={"center"}>
      <Pagination
        page={CSSObject.activePage_for_selector}
        count={CSSObject.maxPages_for_selector}
        onChange={CSSObject.changeActivePage}
      />
    </Stack>
  </div>
));
