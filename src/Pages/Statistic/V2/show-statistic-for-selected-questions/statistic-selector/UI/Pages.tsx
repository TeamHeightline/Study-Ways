import { observer } from "mobx-react";
import React from "react";
import { Pagination, Stack } from "@mui/material";
import { SASObject } from "../Store/SelectAttemptStore";

type IPagesProps = React.HTMLAttributes<HTMLDivElement>;
export const Pages = observer(({ ...props }: IPagesProps) => (
  <div {...props}>
    <Stack alignItems={"center"}>
      <Pagination
        page={SASObject.page}
        count={SASObject.totalPages}
        onChange={SASObject.changePage}
      />
    </Stack>
  </div>
));
