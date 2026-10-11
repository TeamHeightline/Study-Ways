import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';

const RichTextEditor = lazy(
  () => import('../../../../../Shared/RichTextEditor/RichTextEditor'),
);

export const UiRichTextEditor = () => {
  const editor = useCardEditor();
  const text = editor.draft.text ?? '';
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
        key={editor.draft.id ?? ''}
        value={text === 'Описание карточки' ? '' : String(text)}
        onChange={html => editor.changeFieldByValue('text', html)}
      />
    </Suspense>
  );
};
