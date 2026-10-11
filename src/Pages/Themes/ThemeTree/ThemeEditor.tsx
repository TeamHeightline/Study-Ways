import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import { NodeModel } from '@minoru/react-dnd-treeview';
import {
  useCreateThemeMutation,
  useSaveThemeMutation,
  useSaveThemeOrderMutation,
} from '../../../Shared/ServerLayer/QueryLayer/write-api';
import {
  Alert,
  CircularProgress,
  Collapse,
  Fab,
  Grid,
  TextField,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { ThemeTreeView } from './ThemeTreeView';
import { useGetConnectedThemesQuery } from '../../../Shared/ConnectedThemes/api';
import { ThemeLoadError } from '../../../Shared/ConnectedThemes/ThemeLoadError';

enum editingModes {
  EditTheme = 'EditTheme',
  CreateSubTheme = 'CreateSubTheme',
  CreateThemeOnSameLevel = 'CreateThemeOnSameLevel',
}

function ThemeEditor() {
  const themes = useGetConnectedThemesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [treeData, setTreeData] = useState<NodeModel[] | undefined>();
  const [activeEditMode, setActiveEditMode] = useState<editingModes>(
    editingModes.EditTheme,
  );
  const [activeEditText, setActiveEditText] = useState<string>('');
  const [isOpenTextField, setIsOpenTextField] = useState<boolean>(false);
  const [selectedThemeID, setSelectedThemeID] = useState<string | undefined>();
  const [manualUpdate, setManualUpdate] = useState<boolean>(false);
  const sequenceDataForSave = treeData?.map(theme => theme.id).join(',');
  const [lastSavedSequenceData, setLSSD] = useState<string>();

  const [updateTheme, { isLoading: update_theme_loading }] =
    useSaveThemeMutation();
  const [createTheme, { isLoading: create_theme_loading }] =
    useCreateThemeMutation();
  const [saveThemeOrder] = useSaveThemeOrderMutation();
  const [saveError, setSaveError] = useState(false);
  const orderQueue = useRef(Promise.resolve());

  function onButtonsClickHandler(buttonType: editingModes) {
    if (buttonType === activeEditMode) {
      // Если кликнул по той же вкладке, то закрываем поле ввода
      setIsOpenTextField(!isOpenTextField);
    } else {
      // Переключение на другую вкладку
      setActiveEditText('');
      setActiveEditMode(buttonType);
      setIsOpenTextField(true);
    }
    // Если мы редактируем тему, то в поле ввода будет текст из выбранной темы
    if (buttonType === editingModes.EditTheme && selectedThemeID) {
      setActiveEditText(
        treeData?.find(theme => theme?.id === selectedThemeID)?.text || '',
      );
    }
  }

  function getParentIDByTargetID(targetID = selectedThemeID): number {
    if (treeData) {
      // Находим тему, чье ID мы выбрали, у него находим родителя (parent), и возвращаем его ID
      return (
        Number(treeData?.find(theme => theme?.id === targetID)?.parent || 0) ||
        0
      );
    } else {
      return 0;
    }
  }

  async function onSaveButtonClickHandler() {
    if (!activeEditText.trim() || !selectedThemeID) return;
    setSaveError(false);
    const parentId =
      activeEditMode === editingModes.CreateSubTheme
        ? Number(selectedThemeID)
        : getParentIDByTargetID();
    try {
      if (activeEditMode === editingModes.EditTheme) {
        await updateTheme({
          id: Number(selectedThemeID),
          text: activeEditText,
          parentId: parentId || null,
        }).unwrap();
        setTreeData(current =>
          current?.map(node =>
            String(node.id) === selectedThemeID
              ? { ...node, text: activeEditText }
              : node,
          ),
        );
      } else {
        const theme = await createTheme({
          text: activeEditText,
          parentId: parentId || null,
        }).unwrap();
        setTreeData(current => [
          ...(current ?? []),
          {
            id: String(theme.id),
            parent: parentId ? String(parentId) : 0,
            text: activeEditText,
            droppable: true,
          },
        ]);
        setActiveEditText('');
      }
    } catch {
      setSaveError(true);
    }
  }

  useEffect(() => {
    if (activeEditMode === editingModes.EditTheme) {
      setActiveEditText(
        treeData?.find(theme => theme?.id === selectedThemeID)?.text || '',
      );
    }
  }, [selectedThemeID]);

  // Refetches update the shared selectors without overwriting this editor's draft.
  useEffect(() => {
    if (treeData === undefined && themes.data) {
      const initialTree: NodeModel[] = themes.data.map(theme => ({
        id: String(theme.id),
        parent: theme.parentId === null ? 0 : String(theme.parentId),
        text: theme.text,
        droppable: true,
      }));
      setTreeData(initialTree);
      setLSSD(initialTree.map(theme => theme.id).join(','));
    }
  }, [themes.data, treeData]);
  useEffect(() => {
    if (
      sequenceDataForSave === undefined ||
      sequenceDataForSave === lastSavedSequenceData
    )
      return;
    const ids = sequenceDataForSave.split(',').filter(Boolean).map(Number);
    orderQueue.current = orderQueue.current
      .catch(() => {})
      .then(async () => {
        try {
          const saved = await saveThemeOrder(ids).unwrap();
          setLSSD(saved.sequence);
        } catch {
          setSaveError(true);
        }
      });
  }, [sequenceDataForSave]);

  if (treeData === undefined) {
    if (themes.isError)
      return <ThemeLoadError isError refetch={themes.refetch} />;
    return (
      <Grid
        container
        sx={{
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <Grid
      size={{
        xs: 12,
        md: 8,
      }}
    >
      {saveError && (
        <Alert severity="error" onClose={() => setSaveError(false)}>
          Не удалось сохранить темы. Проверьте права доступа и повторите
          действие.
        </Alert>
      )}
      <ThemeTreeView
        {...{
          treeData,
          setTreeData,
          selectedThemeID,
          setSelectedThemeID,
          manualUpdate,
        }}
      />
      <Grid
        container
        spacing={2}
        style={{ marginTop: 1 }}
        sx={{
          justifyContent: 'end',
        }}
      >
        <Grid>
          <Fab
            variant="extended"
            color="primary"
            onClick={() => onButtonsClickHandler(editingModes.EditTheme)}
            disabled={!selectedThemeID}
          >
            <SettingsIcon /> Переименовать
          </Fab>
        </Grid>
        <Grid>
          <Fab
            variant="extended"
            color="primary"
            onClick={() =>
              onButtonsClickHandler(editingModes.CreateThemeOnSameLevel)
            }
            disabled={!selectedThemeID}
          >
            <AddIcon /> Добавить тему рядом
          </Fab>
        </Grid>
        <Grid>
          <Fab
            variant="extended"
            color="primary"
            onClick={() => onButtonsClickHandler(editingModes.CreateSubTheme)}
            disabled={!selectedThemeID}
          >
            <SubdirectoryArrowRightIcon /> Добавить подтему
          </Fab>
        </Grid>
      </Grid>
      <Collapse in={isOpenTextField} style={{ marginTop: 6 }}>
        <TextField
          fullWidth
          value={activeEditText}
          label={
            activeEditMode === editingModes.EditTheme
              ? 'Обновленное название темы'
              : activeEditMode === editingModes.CreateSubTheme
                ? 'Название новой под темы'
                : 'Название новой темы'
          }
          onChange={(e: any) => setActiveEditText(e.target.value)}
        />
        <Grid
          container
          style={{ marginTop: 6 }}
          sx={{
            justifyContent: 'end',
          }}
        >
          <Button
            loading={update_theme_loading || create_theme_loading}
            disabled={!activeEditText}
            variant="contained"
            onClick={() => onSaveButtonClickHandler()}
          >
            {activeEditMode === editingModes.EditTheme
              ? 'Сохранить название темы'
              : activeEditMode === editingModes.CreateSubTheme
                ? 'Создать подтему'
                : 'Создать тему'}
          </Button>
        </Grid>
      </Collapse>
    </Grid>
  );
}

export default ThemeEditor;
