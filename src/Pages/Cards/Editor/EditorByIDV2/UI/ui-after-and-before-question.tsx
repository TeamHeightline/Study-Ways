import { observer } from "mobx-react";
import React from "react";

type IAfterAndBeforeQuestionProps = React.HTMLAttributes<HTMLDivElement>;

export const AfterAndBeforeQuestion = observer(
  ({ ...props }: IAfterAndBeforeQuestionProps) => <div {...props}></div>,
);
