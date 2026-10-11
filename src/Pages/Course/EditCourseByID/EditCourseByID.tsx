import React, { useEffect, useRef, useState } from 'react';
import {
  useSaveCourseMutation,
  useUploadMaterialImageMutation,
} from '../../../Shared/ServerLayer/QueryLayer/write-api';
import { FILE_URL } from '../../../settings';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import CourseRow from './CourseRow';
import {
  CourseData,
  CourseDraft,
  addLevel,
  appendPage,
  courseStats,
  normalizeCourseData,
  previewLink,
} from './course-data';
import { useCourseDraft } from './use-course-draft';
import { SERVER_BASE_URL } from '../../../settings';
import { EditCardByID } from '../../Cards/Editor/EditorByIDV2/UI/EditCardByID';
import { CardSelector } from '../../Cards/Selector/UI/CardSelector';
import './course-editor.css';
import { courseApi, useGetCourseQuery } from '../course-api';
import { useAppDispatch } from '../../../App/ReduxStore/RootStore';
import { skipToken } from '@reduxjs/toolkit/query';

export { CourseLines } from './course-data';
export type { CourseData, ICourseLine } from './course-data';

interface Props {
  course_id?: string | number;
  onChange?: (action: 'goBack') => void;
}
export default function EditCourseByID({ course_id, onChange }: Props) {
  const { id } = useParams();
  const courseId = course_id ?? id;
  const dispatch = useAppDispatch();
  const numericId = Number(courseId);
  const {
    currentData: data,
    isFetching: loading,
    error,
    refetch,
  } = useGetCourseQuery(
    Number.isInteger(numericId) && numericId > 0 ? numericId : skipToken,
  );
  const [saveCourse] = useSaveCourseMutation();
  const save: Parameters<typeof useCourseDraft>[2] = async ({ variables }) => {
    const course = await saveCourse({
      id: Number(variables.course_id),
      name: variables.name,
      course_data: variables.new_data,
    }).unwrap();
    return {
      data: { updateCardCourse: { course: { id: String(course.id) } } },
    };
  };
  if (loading && !data)
    return (
      <div
        className="sw-coedit"
        aria-busy="true"
        aria-label="Загрузка редактора курса"
      >
        <Skeleton height={55} width="55%" />
        <Skeleton variant="rounded" height={200} sx={{ mt: 3 }} />
        <Skeleton variant="rounded" height={420} sx={{ mt: 3 }} />
      </div>
    );
  if (error || !data || !courseId)
    return (
      <div className="sw-coedit">
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => refetch()}>
              Повторить
            </Button>
          }
        >
          Не удалось загрузить курс.
        </Alert>
      </div>
    );
  return (
    <CourseEditor
      key={courseId}
      id={courseId}
      initial={{
        name: data.name || '',
        lines: normalizeCourseData(data.course_data),
      }}
      save={save}
      onBack={onChange ? () => onChange('goBack') : undefined}
    />
  );
}

const CardEditorDialog = ({
  id,
  onClose,
}: {
  id?: string;
  onClose: () => void;
}) => {
  const [isSaved, setIsSaved] = useState(true);
  useEffect(() => setIsSaved(true), [id]);
  return (
    <Dialog
      open={!!id}
      onClose={() => {
        if (isSaved) onClose();
      }}
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: { className: 'sw-coedit-dialog sw-coedit-card-dialog' },
      }}
    >
      <DialogTitle>
        Редактор карточки
        <Tooltip
          title={
            isSaved ? 'Вернуться к курсу' : 'Дождитесь сохранения карточки'
          }
        >
          <span>
            <IconButton
              aria-label="Вернуться к курсу"
              disabled={!isSaved}
              onClick={onClose}
            >
              <CloseRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        {id && <EditCardByID id={id} onSaveStateChange={setIsSaved} />}
      </DialogContent>
    </Dialog>
  );
};

function CourseEditor({
  id,
  initial,
  save,
  onBack,
}: {
  id: string | number;
  initial: CourseDraft;
  save: Parameters<typeof useCourseDraft>[2];
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  const { draft, updateDraft, saveState, saveNow } = useCourseDraft(
    initial,
    id,
    save,
  );
  const [page, setPage] = useState(1);
  const [levelMenu, setLevelMenu] = useState<HTMLElement | null>(null);
  const [cardId, setCardId] = useState<string>();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [image, setImage] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [backBusy, setBackBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const stats = courseStats(draft.lines);
  const href = previewLink(id, draft.lines);
  const replaceLines = (change: (lines: CourseData) => CourseData) =>
    updateDraft(current => ({ ...current, lines: change(current.lines) }));
  const changePage = (next: number) => {
    setPage(next);
    if (board.current) board.current.scrollLeft = 0;
  };
  const leave = async () => {
    setBackBusy(true);
    if (await saveNow()) {
      if (onBack) onBack();
      else navigate('/editor/course');
    }
    setBackBusy(false);
  };
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${SERVER_BASE_URL}/cardfiles/course?id=${id}`, {
      signal: controller.signal,
    })
      .then(response => response.json())
      .then(result => setImage(result?.[0]?.image || ''))
      .catch(() => void 0);
    return () => controller.abort();
  }, [id]);
  const [uploadMaterialImage] = useUploadMaterialImageMutation();
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImageBusy(true);
    setImageError(false);
    try {
      const result = await uploadMaterialImage({
        kind: 'course',
        id: Number(id),
        file,
      }).unwrap();
      setImage(`${FILE_URL}/${result.image}`);
    } catch {
      setImageError(true);
    } finally {
      setImageBusy(false);
    }
  };
  const insertLevel = (atTop: boolean) => {
    replaceLines(lines => addLevel(lines, atTop));
    setLevelMenu(null);
  };
  return (
    <div className="sw-coedit">
      <nav className="sw-coedit-navigation" aria-label="Действия с курсом">
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={leave}
          disabled={backBusy}
        >
          К моим курсам
        </Button>
        <div>
          <Button
            variant="outlined"
            startIcon={<LibraryBooksOutlinedIcon />}
            onClick={() => setLibraryOpen(true)}
          >
            Библиотека карточек
          </Button>
          <Button
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!href}
            startIcon={<OpenInNewRoundedIcon />}
          >
            Открыть курс
          </Button>
        </div>
      </nav>
      <header className="sw-coedit-heading">
        <div className="sw-card-library-heading">
          <span className="sw-coedit-kicker">
            <LayersOutlinedIcon />
            МНОГОУРОВНЕВЫЙ КУРС · №{id}
          </span>
          <h1 className="sw-card-library-title">Редактор курса</h1>
          <p>
            Соберите путь обучения: от первых знаний до глубокого понимания.
          </p>
        </div>
        <div className={`sw-coedit-save-state is-${saveState}`} role="status">
          {saveState === 'saved' ? (
            <CheckCircleOutlineRoundedIcon />
          ) : saveState === 'saving' ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <SaveOutlinedIcon />
          )}
          <span>
            {
              {
                saved: 'Все изменения сохранены',
                pending: 'Есть изменения',
                saving: 'Сохраняем…',
                error: 'Не удалось сохранить',
              }[saveState]
            }
          </span>
          {saveState !== 'saved' && (
            <Button
              size="small"
              disabled={saveState === 'saving'}
              onClick={() => saveNow()}
            >
              {saveState === 'error' ? 'Повторить' : 'Сохранить'}
            </Button>
          )}
        </div>
      </header>
      <Paper component="section" elevation={0} className="sw-coedit-details">
        <div className="sw-coedit-details-copy">
          <TextField
            fullWidth
            label="Название курса"
            value={draft.name}
            onChange={event => {
              const name = event.target.value;
              updateDraft(current => ({ ...current, name }));
            }}
            multiline
            maxRows={3}
          />
          <div className="sw-coedit-stats">
            <span>
              <strong>{stats.levels}</strong>Уровней
            </span>
            <span>
              <strong>{stats.pages}</strong>Страниц
            </span>
            <span>
              <strong>{stats.cards}</strong>Карточек
            </span>
            <span>
              <strong>{stats.links}</strong>Переходов
            </span>
          </div>
        </div>
        <div className="sw-coedit-cover">
          <div className="sw-coedit-cover-image">
            {image ? (
              <img
                src={image}
                alt="Обложка курса"
                onError={() => setImage('')}
              />
            ) : (
              <ImageOutlinedIcon />
            )}
          </div>
          <div>
            <h2>Обложка курса</h2>
            <p>Изображение для каталога</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={uploadImage}
            />
            <Button
              variant="outlined"
              startIcon={
                imageBusy ? (
                  <CircularProgress size={14} />
                ) : (
                  <FileUploadOutlinedIcon />
                )
              }
              disabled={imageBusy}
              onClick={() => fileInput.current?.click()}
            >
              {image ? 'Заменить' : 'Загрузить'}
            </Button>
            {imageError && (
              <span role="alert" className="sw-coedit-upload-error">
                Не удалось загрузить обложку. Попробуйте ещё раз.
              </span>
            )}
          </div>
        </div>
      </Paper>
      <Paper component="section" elevation={0} className="sw-coedit-map">
        <header className="sw-coedit-map-heading">
          <div>
            <h2>Карта курса</h2>
            <p>
              По горизонтали — движение по теме, по вертикали — уровни
              изложения.
            </p>
          </div>
          <div className="sw-coedit-map-actions">
            <Button
              variant="outlined"
              startIcon={<AddRoundedIcon />}
              onClick={event => setLevelMenu(event.currentTarget)}
            >
              Добавить уровень
            </Button>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                const next = stats.pages + (draft.lines.length ? 1 : 0);
                replaceLines(appendPage);
                changePage(next);
              }}
            >
              Добавить страницу
            </Button>
          </div>
        </header>
        <Menu
          anchorEl={levelMenu}
          open={!!levelMenu}
          onClose={() => setLevelMenu(null)}
        >
          <MenuItem onClick={() => insertLevel(true)}>Уровень сверху</MenuItem>
          <MenuItem onClick={() => insertLevel(false)}>Уровень снизу</MenuItem>
        </Menu>
        <div className="sw-coedit-page-bar">
          <div>
            <span>Страница {page}</span>
            <small>
              {draft.lines[0]?.SameLine[page - 1]?.CourseFragment.length || 10}{' '}
              позиций на каждом уровне
            </small>
          </div>
          <Pagination
            page={page}
            count={stats.pages}
            onChange={(_, next) => changePage(next)}
            shape="rounded"
            color="primary"
            siblingCount={0}
          />
        </div>
        {draft.lines.length ? (
          <>
            <div
              className="sw-coedit-board"
              ref={board}
              role="region"
              tabIndex={0}
              aria-label="Карта уровней курса. Прокрутите вправо для следующих позиций."
            >
              {draft.lines.map((line, index) => (
                <CourseRow
                  key={index}
                  row={line}
                  lIndex={index}
                  openPageIndex={page}
                  editCard={setCardId}
                  updateCourseRow={next =>
                    replaceLines(lines =>
                      lines.map((row, rowIndex) =>
                        rowIndex === index ? next : row,
                      ),
                    )
                  }
                />
              ))}
            </div>
            <footer className="sw-coedit-map-footer">
              <span>
                <i />
                Заполненная позиция
              </span>
              <span>
                <i />
                Свободная позиция
              </span>
              <span>
                Следующие позиции
                <EastRoundedIcon />
              </span>
            </footer>
          </>
        ) : (
          <div className="sw-coedit-empty">
            <LayersOutlinedIcon />
            <h3>Начните с первого уровня</h3>
            <p>Добавьте уровень и разместите в нём материалы курса.</p>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddRoundedIcon />}
              onClick={() => insertLevel(false)}
            >
              Добавить первый уровень
            </Button>
          </div>
        )}
      </Paper>
      <Dialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: { className: 'sw-coedit-dialog' },
        }}
      >
        <DialogTitle>
          Библиотека карточек
          <IconButton
            aria-label="Закрыть библиотеку"
            onClick={() => setLibraryOpen(false)}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p className="sw-coedit-library-note">
            Откройте карточку для редактирования или создайте новый материал.
            Чтобы добавить её в курс, выберите нужную позицию на карте.
          </p>
          <CardSelector
            mode="onlyCreatedByMe"
            showCreateNewCard
            onCardSelect={value => {
              setLibraryOpen(false);
              setCardId(String(value));
            }}
          />
        </DialogContent>
      </Dialog>
      <CardEditorDialog id={cardId} onClose={() => setCardId(undefined)} />
    </div>
  );
}
