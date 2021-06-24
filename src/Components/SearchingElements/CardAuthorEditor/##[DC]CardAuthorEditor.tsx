import React from 'react'
import {Row, Spinner} from "react-bootstrap";
import {DataGrid} from "@material-ui/data-grid";
import {Button, Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
export default function DCCardAuthorEditor({...props}: any){
    if(!props.rowsHasBeenCalculated){
        return(
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <DataGrid rows={props.rows} columns={props.columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              props.setSelectedAuthorRow(e.row)
                              props.setActiveEditCardAuthorName(e.row.name)
                          }}
                />
                <Row className="col-3 offset-9 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                             if(props.isCreatingNowCardAuthor){
                                 props.setIsCreatingNowCardAuthor(false)
                             }
                             props.setIsEditNowCardAuthor(!props.isEditNowCardAuthor)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(props.isEditNowCardAuthor){
                                 props.setIsEditNowCardAuthor(false)
                             }
                             props.setIsCreatingNowCardAuthor(!props.isCreatingNowCardAuthor)
                         }}>
                        <AddIcon/>
                    </Fab>
                </Row>
                {props.isEditNowCardAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={props.activeEditCardAuthorName}
                        onChange={(e) =>{
                            props.setActiveEditCardAuthorName(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            props.update_author()}}>
                            Сохранить
                        </Button>
                        {props.update_author_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {props.isCreatingNowCardAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя нового автора"
                        fullWidth
                        value={props.nameOfNewAuthor}
                        onChange={(e) =>{
                            props.setNameOfNewAuthor(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            props.create_author()}}>
                            Сохранить
                        </Button>
                        {props.create_author_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
            </div>
        </div>
    )
}