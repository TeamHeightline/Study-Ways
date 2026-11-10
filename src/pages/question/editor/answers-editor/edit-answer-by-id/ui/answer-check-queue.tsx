import React, {useEffect, useState} from 'react';
import {TextField} from '@mui/material';
import type {AnswerEditorController} from '../model/use-answer-editor';

export default function AnswerCheckQueue({
                                             answer_object: store,
                                         }: {
    answer_object: AnswerEditorController;
}) {
    const savedValue = String(store.draft.checkQueue ?? 1);
    const [value, setValue] = useState(savedValue);
    useEffect(() => setValue(savedValue), [savedValue]);
    const valid = /^\d+$/.test(value) && Number(value) <= 1000000;
    return (
        <TextField
            id={`answer-check-queue-${store.answer_id}`}
            fullWidth
            size="small"
            label="Очередность проверки"
            type="number"
            value={value}
            error={value !== '' && !valid}
            helperText={
                value !== '' && !valid
                    ? 'Введите целое число от 0 до 1000000.'
                    : ''
            }
            slotProps={{htmlInput: {min: 0, max: 1000000, step: 1}}}
            onChange={event => {
                const next = event.target.value;
                setValue(next);
                if (/^\d+$/.test(next) && Number(next) <= 1000000) {
                    store.changeValue('checkQueue', Number(next));
                }
            }}
            onBlur={() => setValue(savedValue)}
        />
    );
}
