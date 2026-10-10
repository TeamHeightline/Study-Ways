import React, { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { StatisticQuestion } from '../../../Store/statistic-api';

interface ISpecificQuestionProps {
  questions: StatisticQuestion[];
  value: number | null;
  loading: boolean;
  onChange: (id: number | null) => void;
}
export const SpecificQuestion = ({
  questions,
  value: selectedId,
  loading,
  onChange,
}: ISpecificQuestionProps) => {
  const options = useMemo(
    () => [
      { id: '-1', text: 'Все вопросы' },
      ...questions.map(question => ({
        id: String(question.id),
        text: question.text || 'Без названия',
      })),
    ],
    [questions],
  );
  const value =
    options.find(question => question.id === String(selectedId)) || options[0];
  return (
    <div>
      <Autocomplete
        size="small"
        fullWidth
        options={options}
        loading={loading}
        loadingText="Загрузка вопросов…"
        value={value}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        getOptionLabel={option =>
          option.id === '-1'
            ? option.text
            : '№ ' + option.id + ' · ' + option.text
        }
        onChange={(_, question) =>
          onChange(
            question && question.id !== '-1' ? Number(question.id) : null,
          )
        }
        noOptionsText="Вопросы не найдены"
        openText="Выбрать вопрос"
        closeText="Закрыть список"
        clearText="Все вопросы"
        ListboxProps={{ style: { maxHeight: 340, padding: 6 } }}
        componentsProps={{
          paper: {
            sx: {
              borderRadius: 2,
              border: '1px solid var(--sw-border)',
              boxShadow: '0 10px 28px rgb(var(--sw-shadow-rgb) / 0.13)',
              mt: 0.75,
            },
          },
        }}
        renderOption={(optionProps, option) => (
          <li
            {...optionProps}
            key={option.id}
            style={{
              alignItems: 'flex-start',
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
              padding: '10px 12px',
              gap: 10,
              borderRadius: 6,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {option.id !== '-1' && (
              <span
                style={{
                  flexShrink: 0,
                  color: 'var(--sw-accent-600)',
                  fontSize: 11,
                  padding: '2px 5px',
                  background: 'var(--sw-accent-100)',
                  borderRadius: 5,
                }}
              >
                № {option.id}
              </span>
            )}
            <span>{option.text}</span>
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="Вопрос"
            placeholder="Номер или текст вопроса"
          />
        )}
      />
    </div>
  );
};
