import React, { createContext, useContext, useState } from 'react';
import { sequenceDataI } from '../../../../../Shared/ServerLayer/Types/question-sequence.type';
import { useSaveSequenceMutation } from '../../../../../Shared/ServerLayer/QueryLayer/write-api';
import { useAutosavedDraft } from '../../../../../Shared/CustomHooks/use-autosaved-draft';
import { useGetSequenceQuestionSummariesQuery } from '../../../question-sequences-api';

function useEditor(initial: sequenceDataI) {
  const [saveSequence] = useSaveSequenceMutation();
  const {
    draft: qsData,
    updateDraft,
    state,
    saveNow,
  } = useAutosavedDraft(
    {
      ...initial,
      name: initial.name ?? '',
      description: initial.description ?? '',
      sequence_data: {
        ...initial.sequence_data,
        sequence: Array.isArray(initial.sequence_data?.sequence)
          ? initial.sequence_data.sequence
              .map(Number)
              .filter(id => Number.isSafeInteger(id) && id > 0)
          : [],
      },
    },
    data =>
      saveSequence({
        id: Number(data.id),
        name: data.name,
        description: data.description ?? '',
        sequence_data: data.sequence_data,
      }).unwrap(),
  );
  const questions = useGetSequenceQuestionSummariesQuery();
  const [selectedAuthorID, setAuthor] = useState('-1');
  const [searchThemeString, setTheme] = useState('');
  const [checkQuestionID, setCheckQuestionID] = useState<string | null>(null);
  const allQuestions = questions.currentData ?? [];
  const byAuthor =
    selectedAuthorID === '-1'
      ? allQuestions
      : allQuestions.filter(
          question => String(question.questionAuthor?.id) === selectedAuthorID,
        );
  return {
    qsData,
    QuestionSequenceID: String(initial.id),
    qsDataLoaded: true,
    saveStatus: state === 'saved',
    saveState: state,
    saveNow,
    allQuestions,
    questionsError: questions.isError,
    refetchQuestions: questions.refetch,
    selectedAuthorID,
    searchThemeString,
    checkQuestionID,
    setCheckQuestionID,
    QuestionThemes: [
      ...new Set(byAuthor.map(question => question.themeString)),
    ].sort(),
    QuestionsForSelect: byAuthor.filter(
      question =>
        !searchThemeString || question.themeString.includes(searchThemeString),
    ),
    changeQSName: (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      updateDraft(data => ({ ...data, name }));
    },
    changeQSDescription: (event: React.ChangeEvent<HTMLInputElement>) => {
      const description = event.target.value;
      updateDraft(data => ({ ...data, description }));
    },
    changeSelectedAuthorID: (event: { target: { value: string } }) =>
      setAuthor(event.target.value),
    changeSearchThemeString: (_event: unknown, value: string | null) =>
      setTheme(value ?? ''),
    addSelectedQuestion: (id: number) =>
      updateDraft(data =>
        data.sequence_data.sequence.includes(id)
          ? data
          : {
              ...data,
              sequence_data: {
                ...data.sequence_data,
                sequence: [...data.sequence_data.sequence, id],
              },
            },
      ),
    removeSelectedQuestion: (index: number) =>
      updateDraft(data => ({
        ...data,
        sequence_data: {
          ...data.sequence_data,
          sequence: data.sequence_data.sequence.filter((_, i) => i !== index),
        },
      })),
  };
}
const Context = createContext<ReturnType<typeof useEditor> | null>(null);
export function SequenceEditorProvider({
  initial,
  children,
}: {
  initial: sequenceDataI;
  children: React.ReactNode;
}) {
  return (
    <Context.Provider value={useEditor(initial)}>{children}</Context.Provider>
  );
}
export function useSequenceEditor() {
  const context = useContext(Context);
  if (!context) throw new Error('Sequence editor context is missing');
  return context;
}
