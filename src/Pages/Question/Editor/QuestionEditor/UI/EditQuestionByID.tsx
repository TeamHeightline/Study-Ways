import { useUserSession } from '../../../../../Shared/Store/UserStore/user-session';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Alert, Button, Paper, Skeleton, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useNavigate } from 'react-router-dom';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';
import { QuestionText } from './ui-text';
import { UiNumberOfShowingAnswers } from './ui-number-of-showing-answers';
import { ImageForQuestion } from './ui-image-for-question';
import { QuestionSrc } from './ui-question-src';
import { SavingNotification } from './ui-saving-notification';
import { UiQuestionPreview } from './ui-question-preview';
import { AnswersEditor } from '../../answers-editor/edit-answer-by-id/ui/AnswersEditor';
import UiAdditionalActions from './ui-additional-actions';
import ConnectedThemeSelector from './ui-connected-theme-selector';
import UIQuestionStatistic from './ui-statistic';
import '../../question-editor.css';
import {
  useLazyGetQuestionEditorDataQuery,
  questionReadApi,
} from '../../../question-read-api';
import { useAppDispatch } from '../../../../../App/ReduxStore/RootStore';

export const EditQuestionByID = observer(
  ({ questionID }: { questionID?: string }) => {
    const session = useUserSession();
    const store = QuestionEditorStorage;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loadQuestion] = useLazyGetQuestionEditorDataQuery();
    const userId = session.user?.id;
    useEffect(() => {
      store.fetchQuestionData = id => loadQuestion({ id, userId }).unwrap();
      store.invalidateQuestionData = id =>
        dispatch(
          questionReadApi.util.invalidateTags([
            { type: 'Question', id },
            { type: 'QuestionAnswers', id },
            { type: 'QuestionEditor', id },
          ]),
        );
      return () => {
        store.fetchQuestionData = undefined;
        store.invalidateQuestionData = undefined;
      };
    }, [store, loadQuestion, userId, dispatch]);
    useEffect(() => {
      if (questionID) store.selectQuestionClickHandler(Number(questionID));
    }, [questionID, store, userId, session.role]);
    const ready =
      store.questionHasBeenSelected &&
      !store.loadingQuestionData &&
      !store.questionLoadError;

    return (
      <div className="sw-qedit sw-qedit-detail">
        <nav className="sw-qedit-navigation" aria-label="Действия с вопросом">
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            disabled={store.unsavedFlag}
            onClick={() => {
              navigate(-1);
              store.clearAllStatisticData();
            }}
            className="sw-qedit-back"
          >
            Назад
          </Button>
          {ready && <UiAdditionalActions />}
        </nav>
        <header className="sw-qedit-heading">
          <div className="sw-card-library-heading">
            <Typography component="h1" className="sw-card-library-title">
              Вопрос №
              {store.selectedQuestionID && ready
                ? store.selectedQuestionID
                : questionID}
            </Typography>
            <Typography component="p" className="sw-qedit-description">
              Настройте содержание и варианты ответа. Изменения сохраняются
              автоматически.
            </Typography>
          </div>
          {ready && <SavingNotification />}
        </header>
        {store.questionLoadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() =>
                  store.selectQuestionClickHandler(Number(questionID))
                }
              >
                Повторить
              </Button>
            }
          >
            Не удалось загрузить вопрос.
          </Alert>
        ) : !ready ? (
          <div
            className="sw-qedit-form-grid"
            aria-busy="true"
            aria-label="Загрузка редактора"
          >
            <Skeleton variant="rounded" height={370} />
            <Skeleton variant="rounded" height={370} />
          </div>
        ) : (
          <>
            <div className="sw-qedit-form-grid">
              <Paper
                elevation={0}
                component="section"
                className="sw-qedit-panel"
              >
                <header className="sw-qedit-panel-heading">
                  <span>
                    <NotesRoundedIcon />
                  </span>
                  <div>
                    <Typography component="h2">Содержание вопроса</Typography>
                    <Typography component="p">
                      Формулировка и материалы для ученика
                    </Typography>
                  </div>
                </header>
                <div className="sw-qedit-fields">
                  <QuestionText />
                  <ImageForQuestion />
                </div>
              </Paper>
              <Paper
                elevation={0}
                component="section"
                className="sw-qedit-panel"
              >
                <header className="sw-qedit-panel-heading">
                  <span>
                    <TuneRoundedIcon />
                  </span>
                  <div>
                    <Typography component="h2">Параметры показа</Typography>
                    <Typography component="p">
                      Как вопрос появится при прохождении
                    </Typography>
                  </div>
                </header>
                <div className="sw-qedit-fields">
                  <UiNumberOfShowingAnswers />
                  <ConnectedThemeSelector />
                  <QuestionSrc />
                  <UIQuestionStatistic />
                </div>
              </Paper>
            </div>
            <UiQuestionPreview />
            <AnswersEditor
              key={`${userId}:${store.selectedQuestionID}`}
              questionId={store.selectedQuestionID}
              numberOfShowingAnswers={Number(
                store.selectedQuestionNumberOfShowingAnswers,
              )}
            />
          </>
        )}
      </div>
    );
  },
);
