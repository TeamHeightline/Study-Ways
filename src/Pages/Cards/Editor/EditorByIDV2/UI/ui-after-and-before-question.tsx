import React from 'react';

type IAfterAndBeforeQuestionProps = React.HTMLAttributes<HTMLDivElement>;

export const AfterAndBeforeQuestion = ({
  ...props
}: IAfterAndBeforeQuestionProps) => <div {...props}></div>;
