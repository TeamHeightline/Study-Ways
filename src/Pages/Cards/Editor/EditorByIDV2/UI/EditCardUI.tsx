import React from 'react';
import { observer } from 'mobx-react';
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
import { CESObject } from '../Store/CardEditorStorage';
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
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <header className="sw-cedit-section-heading">
      <span>{icon}</span>
      <div>
        <Typography component="h2">{title}</Typography>
        <Typography component="p">{text}</Typography>
      </div>
    </header>
  );
}

const EditCardUI = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  const store = CESObject;
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
            href={`/card/${store.getField('id', '')}`}
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
            Карточка №{store.getField('id', '')}
          </Typography>
          <Typography component="p" className="sw-cedit-description">
            Подготовьте материал, настройте вопросы и свяжите карточку с темами.
            Изменения сохраняются автоматически.
          </Typography>
        </div>
        <SaveNotification />
      </header>
      <div className="sw-cedit-grid">
        <Paper component="section" elevation={0} className="sw-cedit-panel">
          <SectionHeading
            icon={<NotesRoundedIcon />}
            title="Содержание карточки"
            text="Название и основной материал для ученика"
          />
          <div className="sw-cedit-fields">
            <UiTitle />
            <UiCMenu />
            {store.getField('card_content_type', 0) === 0 ? (
              <UiVideo />
            ) : (
              <UiUploadImage />
            )}
          </div>
        </Paper>
        <div className="sw-cedit-sidebar">
          <Paper
            component="aside"
            elevation={0}
            className="sw-cedit-panel sw-cedit-settings"
          >
            <SectionHeading
              icon={<TuneRoundedIcon />}
              title="Параметры карточки"
              text="Для кого и к каким темам относится материал"
            />
            <div className="sw-cedit-fields">
              <HardLevel />
              <UiConnectedThemeSelector />
            </div>
            <div className="sw-cedit-setting-block">
              <FormControlLabel
                control={
                  <Switch
                    checked={!!store.getField('is_card_use_copyright', false)}
                    onChange={store.changeField(
                      'is_card_use_copyright',
                      'checked',
                    )}
                  />
                }
                label="Указать авторские права"
              />
              <p>Укажите автора или источник материала.</p>
              <UiCopyRight />
            </div>
          </Paper>
          <Paper component="section" elevation={0} className="sw-cedit-panel">
            <SectionHeading
              icon={<QuizOutlinedIcon />}
              title="Вопросы к карточке"
              text="Проверьте знания до и после изучения материала"
            />
            <div className="sw-cedit-questions">
              <div className="sw-cedit-question-block">
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        !!store.getField('is_card_use_test_before_card', false)
                      }
                      onChange={store.changeField(
                        'is_card_use_test_before_card',
                        'checked',
                      )}
                    />
                  }
                  label="Вопрос перед ресурсом"
                />
                <p>Поможет оценить знания перед изучением материала.</p>
                <Collapse
                  in={!!store.getField('is_card_use_test_before_card', false)}
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
                        !!store.getField('is_card_use_test_in_card', false)
                      }
                      onChange={store.changeField(
                        'is_card_use_test_in_card',
                        'checked',
                      )}
                    />
                  }
                  label="Вопрос после ресурса"
                />
                <p>Поможет закрепить знания после изучения материала.</p>
                <Collapse
                  in={!!store.getField('is_card_use_test_in_card', false)}
                  unmountOnExit
                >
                  <UiTestInCard />
                </Collapse>
              </div>
            </div>
          </Paper>
        </div>
      </div>
      <Paper
        component="section"
        elevation={0}
        className="sw-cedit-panel sw-cedit-bottom-panel"
      >
        <SectionHeading
          icon={<NotesRoundedIcon />}
          title="Описание и пояснения"
          text="Добавьте текст, примеры и необходимые пояснения"
        />
        <UiRichTextEditor />
      </Paper>
    </div>
  );
});
export default EditCardUI;
