import React from 'react'
import {DataGrid} from "@material-ui/data-grid";
import {Row, Spinner} from "react-bootstrap";
import {Button, Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

export default function DCUserTestThemeEditor({...props}: any){
    if(!props.rowsHasBeenCalculated){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <DataGrid rows={props.rows} columns={props.columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              props.setSelectedThemeRow(e.row)
                              props.setActiveEditUserTestThemeName(e.row.name)
                          }}
                />
                <Row className="col-3 offset-9 mt-2">
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
                        label="Имя нового автора"
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