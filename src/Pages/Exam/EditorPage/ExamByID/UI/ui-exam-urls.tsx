import { Paper, Button } from '@mui/material';
import { PaperProps } from '@mui/material/Paper/Paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../App/ReduxStore/RootStore';

export default function UIExamUrls(props: PaperProps) {
  const selectedQSID = useSelector((state: RootState) => state.examEditor.exam_data?.question_sequence_id);
  const examUid = useSelector((state: RootState) => state.examEditor.exam_data?.uid);
  const [feedback, setFeedback] = useState('');
  async function copyLink(url: string) {
    try { await navigator.clipboard.writeText(url); setFeedback('Ссылка скопирована'); }
    catch { setFeedback('Не удалось скопировать. Выделите и скопируйте ссылку вручную.'); }
  }
  const links = [
    ...(examUid ? [{ title: 'Экзамен', text: 'Ссылка для прохождения экзамена', url: 'https://www.sw-university.com/exam/' + examUid }] : []),
    ...(selectedQSID ? [{ title: 'Тренировка', text: 'Серия вопросов в режиме обучения', url: 'https://www.sw-university.com/qs/' + selectedQSID }] : []),
  ];
  return <Paper elevation={0} {...props} className="sw-exam-links">
    {links.map(link => <div className="sw-exam-link" key={link.url}>
      <strong>{link.title}</strong><small>{link.text}</small>
      <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
      <div><Button size="small" variant="outlined" onClick={() => copyLink(link.url)}>Скопировать ссылку</Button><Button size="small" href={link.url} target="_blank" rel="noreferrer">Открыть ↗</Button></div>
    </div>)}
    <div className="sw-exam-copy-status" role="status">{feedback}</div>
  </Paper>;
}
