import { observer } from "mobx-react";
import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { toJS } from "mobx";
import { Collapse, Stack, TableBody } from "@mui/material";
import { DSSObjectType, rowType } from "../Store/DetailStatisticStoreByID";
import { WrongAnswerByID } from "./WrongAnswerByID";

type props = {
  row: rowType;
  statisticByIDStore: DSSObjectType;
};

export const StepByStepStatistic = observer(
  ({ row, statisticByIDStore }: props) => (
    <TableBody>
      {row.ArrayOfNumberOfWrongAnswers?.map((attempt, aIndex) => (
        <React.Fragment
          key={`${attempt.numberOfPasses}attempt${row.attemptID}DetailStatisticKey`}
        >
          <TableRow>
            <TableCell>
              <IconButton
                size="small"
                onClick={() =>
                  statisticByIDStore.addOrRemoveOpenedSteps(aIndex)
                }
              >
                {statisticByIDStore.openedSteps.has(aIndex) ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </TableCell>
            <TableCell>{toJS(attempt.numberOfPasses)}</TableCell>
            <TableCell>
              {
                toJS(
                  row.ArrayForShowWrongAnswers[
                    Number(attempt.numberOfPasses) - 1
                  ],
                ).numberOfWrongAnswers.length
              }
            </TableCell>
            <TableCell>
              {toJS(
                row.ArrayForShowAnswerPoints[Number(attempt.numberOfPasses) - 1]
                  ?.answerPoints,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={4}
              style={{
                paddingBottom: 0,
                paddingTop: 0,
                maxWidth: window.innerWidth - 100,
              }}
            >
              <Collapse in={statisticByIDStore.openedSteps.has(aIndex)}>
                <Stack direction={"row"} overflow={"auto"}>
                  {toJS(
                    row.ArrayForShowWrongAnswers[
                      Number(attempt.numberOfPasses) - 1
                    ],
                  )?.numberOfWrongAnswers?.map((wrongAnswerID) => (
                    <WrongAnswerByID
                      key={`answer${wrongAnswerID}`}
                      answer_id={wrongAnswerID}
                    />
                  ))}
                </Stack>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  ),
);
