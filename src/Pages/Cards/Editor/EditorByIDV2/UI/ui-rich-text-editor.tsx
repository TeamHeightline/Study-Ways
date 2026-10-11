import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react';
import { Skeleton } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';

const RichTextEditor = lazy(
  () => import('../../../../../Shared/RichTextEditor/RichTextEditor'),
);

export const UiRichTextEditor = observer(() => {
  const text = CESObject.getField('text', '');
  return (
    <Suspense
      fallback={
        <Skeleton
          variant="rounded"
          height={340}
          aria-label="Загрузка редактора"
        />
      }
    >
      <RichTextEditor
        key={CESObject.getField('id', '')}
        value={text === 'Описание карточки' ? '' : String(text)}
        onChange={html => CESObject.changeFieldByValue('text', html)}
      />
    </Suspense>
  );
});
