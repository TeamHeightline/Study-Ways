import React, {useEffect, useState} from "react";
import {NodeModel} from "@minoru/react-dnd-treeview";
import {CreateTheme, GET_ALL_UNSTRUCTURED_THEME, UpdateSubTheme} from "./Struct";
import {useMutation, useQuery} from "@apollo/client";
import {CircularProgress, Collapse, Fab, Grid, TextField} from "@mui/material";
import {Mutation, Query} from "../../../SchemaTypes";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {ThemeTreeView} from "./#ThemeTreeView";
import {LoadingButton} from "@mui/lab";

enum editingModes {
    EditTheme = "EditTheme",
    CreateSubTheme = "CreateSubTheme",
    CreateThemeOnSameLevel = "CreateThemeOnSameLevel",
}

function ThemeEditor() {
    const [treeData, setTreeData] = useState<NodeModel[] | undefined>();
    const [activeEditMode, setActiveEditMode] = useState<editingModes>(editingModes.EditTheme)
    const [activeEditText, setActiveEditText] = useState<string>("")
    const [isOpenTextField, setIsOpenTextField] = useState<boolean>(false)
    const [selectedThemeID, setSelectedThemeID] = useState<string | undefined>()
    const [manualUpdate, setManualUpdate] = useState<boolean>(false)

    const [updateTheme, {loading: update_theme_loading}] =
        useMutation<Mutation>(UpdateSubTheme, {
            variables:{
                id: selectedThemeID,
                parent: getParentIDByTargetID(selectedThemeID),
                text: activeEditText
            }
        })

    const [createTheme,  {loading: create_theme_loading}] =
        useMutation<Mutation>(CreateTheme, {
            variables:{
                text: activeEditText,
                parent: activeEditMode === editingModes.CreateThemeOnSameLevel?
                    getParentIDByTargetID(selectedThemeID):
                    selectedThemeID
            }
        })

    function onButtonsClickHandler(buttonType: editingModes) {
        if (buttonType === activeEditMode) {
            //Если кликнул по той же вкладке, то закрываем поле ввода
            setIsOpenTextField(!isOpenTextField)
        } else {
            //Переключение на другую вкладку
            setActiveEditText("")
            setActiveEditMode(buttonType)
            setIsOpenTextField(true)
        }
        //Если мы редактируем тему, то в поле ввода будет текст из выбранной темы
        if (buttonType === editingModes.EditTheme && selectedThemeID) {
            setActiveEditText(treeData?.find(theme => theme?.id === selectedThemeID)?.text || "")
        }
    }

    function generateNewThemeID(): number {
        //ID новой темы = самый большой id + 1
        if (treeData) {
            return Math.max.apply(Math, treeData.map((theme: NodeModel) => {return Number(theme?.id) || 0})) + 1
        } else {
            return 0
        }
    }

    function getParentIDByTargetID(targetID = selectedThemeID): number {
        if (treeData) {
            //Находим тему, чье ID мы выбрали, у него находим родителя (parent), и возвращаем его ID
            return (Number(treeData?.find((theme) => theme?.id === targetID)?.parent || 0) || 0)
        } else {
            return 0
        }
    }

    function onSaveButtonClickHandler() {
        if (activeEditMode === editingModes.EditTheme && activeEditText) {
            const newTree: NodeModel[] | undefined = treeData?.map((node: NodeModel) => {
                if (node.id === selectedThemeID && activeEditText) {
                    updateTheme()
                    return {...node, text: activeEditText};
                } else {
                    return (node)
                }
            })
            setTreeData(newTree)
            setManualUpdate(!manualUpdate)
        } else if (activeEditMode === editingModes.CreateSubTheme && activeEditText) {
            const newTree: NodeModel[] | undefined = treeData
            newTree?.push({
                id: String(generateNewThemeID()),
                parent: selectedThemeID || 0,
                text: activeEditText,
                droppable: true
            })
            createTheme()
            setTreeData(newTree)
            setActiveEditText("")
            setManualUpdate(!manualUpdate)
        } else if (activeEditMode === editingModes.CreateThemeOnSameLevel && activeEditText) {
            const newTree: NodeModel[] | undefined = treeData
            newTree?.push({
                id: String(generateNewThemeID()),
                parent: String(getParentIDByTargetID()) || 0,
                text: activeEditText,
                droppable: true
            })
            createTheme()
            setTreeData(newTree)
            setActiveEditText("")
            setManualUpdate(!manualUpdate)
        }
    }

    useEffect(() => {
        if (activeEditMode === editingModes.EditTheme) {
            setActiveEditText(treeData?.find(theme => theme?.id === selectedThemeID)?.text || "")
        }
    }, [selectedThemeID])

    const {loading} = useQuery<Query>(GET_ALL_UNSTRUCTURED_THEME, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            const dataForDisplay: NodeModel[] = []
            data?.unstructuredTheme?.map((theme) => {
                dataForDisplay.push({
                    id: theme?.id || 0,
                    parent: theme?.parent?.id || 0,
                    text: theme?.text || "",
                    droppable: true,
                })
            })
            setTreeData(dataForDisplay)
        }
    })

    if (loading) {
        return (
            <Grid container justifyContent="center">
                <CircularProgress/>
            </Grid>
        )
    }
    return (
        <Grid item xs={12} md={4}>
            <ThemeTreeView {...{treeData, setTreeData, selectedThemeID, setSelectedThemeID, manualUpdate}}/>
            <Grid container justifyContent={"end"} spacing={2} style={{marginTop: 1}}>
                <Grid item>
                    <Fab color="primary" onClick={() => onButtonsClickHandler(editingModes.EditTheme)}
                         disabled={!selectedThemeID}>
                        <SettingsIcon/>
                    </Fab>
                </Grid>
                <Grid item>
                    <Fab color="primary" onClick={() => onButtonsClickHandler(editingModes.CreateThemeOnSameLevel)}
                         disabled={!selectedThemeID}>
                        <AddIcon/>
                    </Fab>
                </Grid>
                <Grid item>
                    <Fab color="primary" onClick={() => onButtonsClickHandler(editingModes.CreateSubTheme)}
                         disabled={!selectedThemeID}>
                        <SubdirectoryArrowRightIcon/>
                    </Fab>
                </Grid>
            </Grid>
            <Collapse in={isOpenTextField} style={{marginTop: 6}}>
                <TextField fullWidth
                           value={activeEditText}
                           label={
                               activeEditMode === editingModes.EditTheme ? "Обновленное название темы" :
                                   activeEditMode === editingModes.CreateSubTheme ? "Название новой под темы" : "Название новой темы"}
                           onChange={(e: any) => setActiveEditText(e.target.value)}/>
                <Grid container justifyContent="end" style={{marginTop: 6}}>
                    <LoadingButton
                        loading={update_theme_loading || create_theme_loading}
                        disabled={!activeEditText}
                        variant="contained"
                        onClick={() => onSaveButtonClickHandler()}
                    >
                        {
                            activeEditMode === editingModes.EditTheme ? "Сохранить название темы" :
                                activeEditMode === editingModes.CreateSubTheme ? "Создать под тему" : "Создать тему"}
                    </LoadingButton>
                </Grid>
            </Collapse>

        </Grid>
    );
}

export default ThemeEditor;
