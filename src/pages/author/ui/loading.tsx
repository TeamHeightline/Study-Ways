import React from 'react';
import { Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <div
      className="sw-author-page"
      aria-busy="true"
      aria-label="Загрузка страницы автора"
    >
      <span className="sw-author-loading-label" role="status">
        Загружаем страницу автора…
      </span>
      <Skeleton variant="rounded" height={300} />
      <Skeleton width="35%" height={60} />
      <div className="sw-author-course-grid">
        {[1, 2, 3].map(id => (
          <Skeleton key={id} variant="rounded" height={300} />
        ))}
      </div>
    </div>
  );
}
