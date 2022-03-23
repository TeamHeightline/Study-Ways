import React from 'react'
import {DataGrid} from '@mui/x-data-grid';
import {Button, CircularProgress, Fab, Paper, Stack} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";

export default function DCUserTestThemeEditor({...props}: any) {
    if (!props.rowsHasBeenCalculated) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <div>
            <div style={{maxWidth: 600, height: 470}}>
                <div style={{height: 400}}>
                    <DataGrid rows={props.rows} columns={props.columnsForAuthorsDataGrid}
                              onRowClick={(e) => {
                                  props.setSelectedThemeRow(e.row)
                                  props.setActiveEditUserTestThemeName(e.row.name)
                              }}
                    />
                </div>
                <Stack justifyContent={"end"} direction={"row"} sx={{pt: 1}} spacing={1}>
                    <Fab color="primary"
                         onClick={() => {
                             if (props.isCreatingNowUserTestTheme) {
                                 props.setIsCreatingNowUserTestTheme(false)
                             }
                             props.setIsEditNowUserTestTheme(!props.isEditNowUserTestTheme)
                         }}>
                        <SettingsIcon/>
                    </Fab>
                    <Fab color="primary"
                         onClick={() => {
                             if (props.isEditNowUserTestTheme) {
                                 props.setIsEditNowUserTestTheme(false)
                             }
                             props.setIsCreatingNowUserTestTheme(!props.isCreatingNowUserTestTheme)
                         }}>
                        <AddIcon/>

                    </Fab>
                </Stack>
                {props.isEditNowUserTestTheme &&
                    <Paper elevation={0} sx={{mt: 1}}>
                        <TextField
                            label="Название темы"
                            fullWidth
                            value={props.activeEditUserTestThemeName}
                            onChange={(e) => {
                                props.setActiveEditUserTestThemeName(e.target.value)
                            }
                            }
                        />
                        <Stack direction={"row"} sx={{mt: 1}}>
                            <Button variant="contained" color="primary" onClick={() => {
                                props.update_theme()
                            }}>
                                Сохранить
                            </Button>
                            {props.update_theme_loading &&
                                <CircularProgress/>}
                        </Stack>
                    </Paper>}
                {props.isCreatingNowUserTestTheme &&
                    <Paper elevation={0} sx={{mt: 1}}>
                        <TextField
                            label="Название новой темы"
                            fullWidth
                            value={props.nameOfNewUserTestTheme}
                            onChange={(e) => {
                                props.setNameOfNewUserTestTheme(e.target.value)
                            }
                            }
                        />
                        <Stack direction={"row"} sx={{mt: 1}}>
                            <Button variant="contained" color="primary" onClick={() => {
                                props.create_theme()
                            }}>
                                Сохранить
                            </Button>
                            {props.create_theme_loading &&
                                <CircularProgress/>}
                        </Stack>
                    </Paper>}
            </div>
        </div>
    )

}