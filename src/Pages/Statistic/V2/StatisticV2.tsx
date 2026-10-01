import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Finder } from './question-finder/UI/Finder';
import { SASObject } from './show-statistic-for-selected-questions/statistic-selector/Store/SelectAttemptStore';
export const StatisticV2 = observer(() => {
  useEffect(() => {
    const polling = setInterval(() => SASObject.loadAttemptFromServer(), 7000);
    return () => clearInterval(polling);
  }, []);
  return <div className="sw-statistics-page">
    <div className="sw-statistics-heading"><h2>Статистика прохождения</h2><p>Найдите результаты по пользователю, вопросу и времени прохождения.</p></div>
    <Finder mode="all" />
  </div>;
});
