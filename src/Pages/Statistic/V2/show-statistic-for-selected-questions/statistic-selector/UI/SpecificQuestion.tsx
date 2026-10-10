import { observer } from 'mobx-react';
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { SASObject } from '../Store/SelectAttemptStore';

type ISpecificQuestionProps = React.HTMLAttributes<HTMLDivElement>;
export const SpecificQuestion = observer((props: ISpecificQuestionProps) => {
  const options = [
    { id: '-1', text: 'Все вопросы' },
    ...SASObject.arrayForQuestionSelector.map(question => ({
      id: String(question.id),
      text: question.text || 'Без названия',
    })),
  ];
  const value =
    options.find(question => question.id === SASObject.specificQuestion) ||
    options[0];
  return (
    <div {...props}>
      <Autocomplete
        size="small"
        fullWidth
        options={options}
        value={value}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        getOptionLabel={option =>
          option.id === '-1'
            ? option.text
            : '№ ' + option.id + ' · ' + option.text
        }
        onChange={(_, question) =>
          SASObject.changeSpecificQuestion({
            target: { value: question?.id || '-1' },
          })
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
});
