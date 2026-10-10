import {
  Button,
  Card,
  CardActionArea,
  IconButton,
  Tooltip,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Link } from 'react-router-dom';
import { IExamDataWithQSData } from '../../../../../Shared/ServerLayer/Types/exam.types';
import { accessLabel, examTitle, sequenceTitle } from '../exam-list-utils';

export default function UIExamCard({
  exam,
  onFeedback,
}: {
  exam: IExamDataWithQSData;
  onFeedback: (message: string, severity: 'success' | 'error') => void;
}) {
  const url = `${window.location.origin}/exam/${exam.uid}`;
  const editUrl = `/editor/exam/select/${exam.id}`;
  const questions = exam.question_sequence?.sequence_data?.sequence;
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      onFeedback('Ссылка на экзамен скопирована', 'success');
    } catch {
      onFeedback('Не удалось скопировать ссылку', 'error');
    }
  }
  return (
    <Card variant="outlined" className="sw-examlist-card">
      <CardActionArea
        component={Link}
        to={editUrl}
        aria-label={`Редактировать экзамен «${examTitle(exam)}»`}
      >
        <div className="sw-examlist-card-top">
          <span className="sw-examlist-card-icon">
            <AssignmentOutlinedIcon />
          </span>
          <span
            className={`sw-examlist-access${exam.access_mode === 'closed' ? ' is-closed' : ''}`}
          >
            {exam.access_mode === 'closed' ? (
              <LockOutlinedIcon />
            ) : (
              <PublicOutlinedIcon />
            )}
            {accessLabel(exam.access_mode)}
          </span>
        </div>
        <div className="sw-examlist-card-body">
          <small>Экзамен №{exam.id}</small>
          <h2>{examTitle(exam)}</h2>
          <div className="sw-examlist-sequence">
            <span>
              Серия вопросов
              {exam.question_sequence_id
                ? ` · №${exam.question_sequence_id}`
                : ''}
            </span>
            <strong>{sequenceTitle(exam)}</strong>
          </div>
          <div className="sw-examlist-meta">
            <span>
              <AccessTimeRoundedIcon />
              {Number(exam.minutes) > 0
                ? `${exam.minutes} мин`
                : 'Время не задано'}
            </span>
            {Array.isArray(questions) && (
              <span>
                <QuizOutlinedIcon />
                Вопросов: {questions.length}
              </span>
            )}
          </div>
        </div>
      </CardActionArea>
      <footer>
        <Button
          component={Link}
          to={editUrl}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Редактировать
        </Button>
        <div>
          <Tooltip title="Скопировать ссылку для участников">
            <span>
              <IconButton
                disabled={!exam.uid}
                aria-label={`Скопировать ссылку на экзамен №${exam.id}`}
                onClick={copy}
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Открыть экзамен">
            <span>
              <IconButton
                component="a"
                href={exam.uid ? url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!exam.uid}
                aria-label={`Открыть экзамен №${exam.id}`}
              >
                <OpenInNewRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </footer>
    </Card>
  );
}
