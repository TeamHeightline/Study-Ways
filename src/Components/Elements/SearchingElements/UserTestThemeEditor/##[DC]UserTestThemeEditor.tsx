import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import {Row, Spinner} from "react-bootstrap";
import {Button, Fab} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";

export default function DCUserTestThemeEditor({...props}: any){
    if(!props.rowsHasBeenCalculated){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
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
                <Row className="col-md-3 offset-md-9 col-12 mt-2">
                    <Fab color="primary"
                         onClick={() =>{
                             if(props.isCreatingNowUserTestTheme){
                                 props.setIsCreatingNowUserTestTheme(false)
                             }
                             props.setIsEditNowUserTestTheme(!props.isEditNowUserTestTheme)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(props.isEditNowUserTestTheme){
                                 props.setIsEditNowUserTestTheme(false)
                             }
                             props.setIsCreatingNowUserTestTheme(!props.isCreatingNowUserTestTheme)
                         }}>
                        <AddIcon/>

                    </Fab>
                </Row>
                {props.isEditNowUserTestTheme && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={props.activeEditUserTestThemeName}
                        onChange={(e) =>{
                            props.setActiveEditUserTestThemeName(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            props.update_theme()}}>
                            Сохранить
                        </Button>
                        {props.update_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {props.isCreatingNowUserTestTheme && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название новой темы"
                        fullWidth
                        value={props.nameOfNewUserTestTheme}
                        onChange={(e) =>{
                            props.setNameOfNewUserTestTheme(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            props.create_theme()}}>
                            Сохранить
                        </Button>
                        {props.create_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
            </div>
        </div>
    )

}