import React from 'react';
import {
  Button,
  Collapse,
  FormControlLabel,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useCardEditor } from '../model/use-card-editor';
import { UiCloseButton } from './ui-close-button';
import { UiCMenu } from './ui-c-menu';
import { UiTitle } from './ui-title';
import { HardLevel } from './ui-hard-level';
import { UiConnectedThemeSelector } from './ui-connected-theme-selector';
import { UiCopyRight } from './ui-copy-right';
import { UiVideo } from './ui-video';
import { UiUploadImage } from './ui-upload-image';
import { UiRichTextEditor } from './ui-rich-text-editor';
import { UiTestInCard } from './ui-test-in-card';
import { UiTestBeforeCard } from './ui-test-before-card';
import UICreateButton from './ui-create-copy-button';
import UICreateCopyDialog from './ui-create-copy-dialog';
import { SaveNotification } from './save-notification';

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <header className="sw-cedit-section-heading">
      <span>{icon}</span>
      <div>
        <Typography component="h2">{title}</Typography>
      </div>
    </header>
  );
}

const EditCardUI = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const editor = useCardEditor();
  return (
    <div
      {...props}
      className={`sw-cedit sw-cedit-workspace ${props.className || ''}`}
    >
      <UICreateCopyDialog />
      <nav className="sw-cedit-navigation" aria-label="Действия с карточкой">
        <UiCloseButton />
        <div>
          <Button
            component="a"
            href={`/card/${editor.draft.id}`}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<OpenInNewRoundedIcon />}
          >
            Открыть карточку
          </Button>
          <UICreateButton />
        </div>
      </nav>
      <header className="sw-cedit-heading">
        <div className="sw-card-library-heading">
          <Typography component="h1" className="sw-card-library-title">
            Карточка №{editor.draft.id}
          </Typography>
        </div>
        <SaveNotification />
      </header>
      <Paper
        component="section"
        elevation={0}
        className="sw-cedit-panel sw-cedit-summary"
      >
        <UiTitle />
        <div className="sw-cedit-metadata">
          <UiConnectedThemeSelector />
          <HardLevel />
        </div>
      </Paper>
      <div className="sw-cedit-grid">
        <div className="sw-cedit-main">
          <Paper
            component="section"
            elevation={0}
            className="sw-cedit-panel sw-cedit-media-panel"
            aria-label="Материал карточки"
          >
            <div className="sw-cedit-fields">
              {(editor.draft.card_content_type ?? 0) === 0 ? (
                <UiVideo />
              ) : (
                <>
                  <UiCMenu />
                  <UiUploadImage />
                </>
              )}
            </div>
          </Paper>
          <Paper
            component="aside"
            elevation={0}
            className="sw-cedit-panel sw-cedit-copyright-panel"
          >
            <SectionHeading
              icon={<TuneRoundedIcon />}
              title="Авторские права"
            />
            <div className="sw-cedit-setting-block">
              <FormControlLabel
                control={
                  <Switch
                    checked={!!(editor.draft.is_card_use_copyright ?? false)}
                    onChange={editor.changeField(
                      'is_card_use_copyright',
                      'checked',
                    )}
                  />
                }
                label="Указать авторские права"
              />
              <UiCopyRight />
            </div>
          </Paper>
        </div>
        <div className="sw-cedit-sidebar">
          <Paper
            component="section"
            elevation={0}
            className="sw-cedit-panel sw-cedit-description-panel"
          >
            <SectionHeading
              icon={<NotesRoundedIcon />}
              title="Описание и пояснения"
            />
            <UiRichTextEditor />
          </Paper>
          <Paper
            component="section"
            elevation={0}
            className="sw-cedit-panel sw-cedit-question-panel"
          >
            <SectionHeading
              icon={<QuizOutlinedIcon />}
              title="Вопросы к карточке"
            />
            <div className="sw-cedit-questions">
              <div className="sw-cedit-question-block">
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        !!(editor.draft.is_card_use_test_before_card ?? false)
                      }
                      onChange={editor.changeField(
                        'is_card_use_test_before_card',
                        'checked',
                      )}
                    />
                  }
                  label="Вопрос перед ресурсом"
                />
                <Collapse
                  in={!!(editor.draft.is_card_use_test_before_card ?? false)}
                  unmountOnExit
                >
                  <UiTestBeforeCard />
                </Collapse>
              </div>
              <div className="sw-cedit-question-block">
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        !!(editor.draft.is_card_use_test_in_card ?? false)
                      }
                      onChange={editor.changeField(
                        'is_card_use_test_in_card',
                        'checked',
                      )}
                    />
                  }
                  label="Вопрос после ресурса"
                />
                <Collapse
                  in={!!(editor.draft.is_card_use_test_in_card ?? false)}
                  unmountOnExit
                >
                  <UiTestInCard />
                </Collapse>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};
export default EditCardUI;
