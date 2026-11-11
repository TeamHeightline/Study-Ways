import React from 'react';
import { Box, BoxProps } from '@mui/material';
import AnswerCard from './answer-card';

export interface PlayerAnswer {
  id: number;
  text: string;
  imageUrl?: string;
  isImageDeleted?: boolean;
}
interface AnswerListProps extends BoxProps {
  answers: readonly PlayerAnswer[];
  selectedIds: ReadonlySet<number> | readonly number[];
  onSelectAnswer: (id: number) => void;
  renderFooter?: (answer: PlayerAnswer, index: number) => React.ReactNode;
}
export default function AnswerList({
  answers,
  selectedIds,
  onSelectAnswer,
  renderFooter,
  ...props
}: AnswerListProps) {
  const selected = new Set(selectedIds);
  if (!answers.length) return null;
  return (
    <Box {...props}>
      <div className="sw-player-answers">
        {answers.map((answer, index) => (
          <div key={answer.id} className="sw-player-answer">
            <AnswerCard
              fullWidth
              text={answer.text}
              imageURL={answer.imageUrl ?? ''}
              isImageDeleted={answer.isImageDeleted}
              isSelected={selected.has(answer.id)}
              onAnswerClick={() => onSelectAnswer(answer.id)}
            />
            {renderFooter?.(answer, index)}
          </div>
        ))}
      </div>
    </Box>
  );
}
