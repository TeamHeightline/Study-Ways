import { observer } from 'mobx-react';
import React from 'react';
import { Button, Collapse } from '@mui/material';
import { DSSObjectType, rowType } from '../Store/DetailStatisticStoreByID';
import { WrongAnswerByID } from './WrongAnswerByID';

export const StepByStepStatistic = observer(({ row, statisticByIDStore }: { row: rowType; statisticByIDStore: DSSObjectType }) => (
  <section className="sw-attempts">
    <h3>Разбор попыток</h3>
    <p>Откройте попытку, чтобы посмотреть ответы, в которых была допущена ошибка.</p>
    {row.ArrayOfNumberOfWrongAnswers?.map((attempt, index) => {
      const mistakes = row.ArrayForShowWrongAnswers?.find(item => Number(item.numberOfPasses) === Number(attempt.numberOfPasses))?.numberOfWrongAnswers || [];
      const points = row.ArrayForShowAnswerPoints?.find(item => Number(item.numberOfPasses) === Number(attempt.numberOfPasses))?.answerPoints;
      const open = statisticByIDStore.openedSteps.has(index);
      return <article className="sw-attempt" key={attempt.numberOfPasses}>
        <div className="sw-attempt-summary">
          <strong>Попытка {attempt.numberOfPasses}</strong>
          <span className={mistakes.length ? 'sw-attempt-errors' : 'sw-attempt-success'}>{mistakes.length ? `Ошибок: ${mistakes.length}` : 'Без ошибок'}</span>
          <span>Баллы: <b>{points ?? '—'}</b></span>
          {mistakes.length > 0 && <Button aria-expanded={open} onClick={() => statisticByIDStore.addOrRemoveOpenedSteps(index)}>{open ? 'Скрыть разбор ↑' : 'Разобрать ошибки ↓'}</Button>}
        </div>
        <Collapse in={open} unmountOnExit>
          <div className="sw-mistakes-grid">
            {mistakes.map((id, i) => <WrongAnswerByID key={`${id}-${i}`} answer_id={id} />)}
          </div>
        </Collapse>
      </article>;
    })}
  </section>
));
