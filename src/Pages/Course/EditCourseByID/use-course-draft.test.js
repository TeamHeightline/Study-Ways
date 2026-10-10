import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { useCourseDraft } from './use-course-draft';

const act = React.act || legacyAct;
let container, root, editor, save;
function Harness() {
  editor = useCourseDraft({ name: 'Курс', lines: [] }, 12, save);
  return <span>{editor.saveState}</span>;
}
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  save = jest.fn().mockResolvedValue({});
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<Harness />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('loading the draft does not save; an edit saves the latest document after debounce', async () => {
  await act(async () => jest.advanceTimersByTime(3000));
  expect(save).not.toHaveBeenCalled();
  act(() =>
    editor.updateDraft(current => ({ ...current, name: 'Новый курс' })),
  );
  await act(async () => jest.advanceTimersByTime(2000));
  expect(save).toHaveBeenCalledWith({
    variables: { course_id: 12, name: 'Новый курс', new_data: [] },
  });
  expect(container.textContent).toBe('saved');
});

test('changes during an outstanding save are serialized and cannot be overwritten by an older response', async () => {
  let finishFirst;
  save.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finishFirst = resolve;
      }),
  );
  act(() =>
    editor.updateDraft(current => ({ ...current, name: 'Первая версия' })),
  );
  await act(async () => jest.advanceTimersByTime(2000));
  act(() =>
    editor.updateDraft(current => ({ ...current, name: 'Последняя версия' })),
  );
  await act(async () => jest.advanceTimersByTime(2000));
  expect(save).toHaveBeenCalledTimes(1);
  expect(container.textContent).not.toBe('saved');
  await act(async () => finishFirst({}));
  expect(save).toHaveBeenCalledTimes(2);
  expect(save.mock.calls[1][0].variables.name).toBe('Последняя версия');
  expect(container.textContent).toBe('saved');
});

test('failed saves keep the draft and can be retried before leaving the editor', async () => {
  save.mockRejectedValueOnce(new Error('Unavailable'));
  act(() =>
    editor.updateDraft(current => ({ ...current, name: 'Не потерять' })),
  );
  let result;
  await act(async () => {
    result = await editor.saveNow();
  });
  expect(result).toBe(false);
  expect(container.textContent).toBe('error');
  expect(editor.draft.name).toBe('Не потерять');
  await act(async () => {
    result = await editor.saveNow();
  });
  expect(result).toBe(true);
  expect(container.textContent).toBe('saved');
});
