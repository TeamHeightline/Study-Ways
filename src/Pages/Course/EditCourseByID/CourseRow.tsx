import React, { useEffect, useState } from "react";
import CourseFragment from "./CourseFragment";
import { Box } from "@mui/material";

export default function CourseRow({ row, openPageIndex, ...props }: any) {
  const [RowState, setRow] = useState(row.SameLine);
  useEffect(() => {
    setRow(row.SameLine);
  }, [row.SameLine]);
  // console.log(data)
  return (
    <Box>
      <Box sx={{ mt: 1 }}>
        <CourseFragment
          key={`${openPageIndex}row${props.lIndex}course${props.cIndex}`}
          fragment={RowState[openPageIndex - 1]}
          fIndex={openPageIndex - 1}
          lIndex={props.lIndex}
          cIndex={props.cIndex}
          editCard={(item_id) => props.editCard(item_id)}
          updateFragment={(new_data) => {
            const update_fragment = {
              CourseFragment: new_data,
            };
            const newRow = RowState.slice();
            newRow[openPageIndex - 1] = update_fragment;
            // console.log(newRow)
            setRow(newRow);
            props.updateCourseRow(newRow);
          }}
        />
      </Box>
    </Box>
  );
}
