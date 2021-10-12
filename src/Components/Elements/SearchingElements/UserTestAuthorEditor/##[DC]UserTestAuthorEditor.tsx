import React from 'react'
import {DataGrid} from "@material-ui/data-grid";
import {Row, Spinner} from "react-bootstrap";
import {Button, Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

export default function DCUserTestAuthorEditor({...props}: any){
    if(!props.rowsHasBeenCalculated){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div style={{maxWidth: 600, height: 400}}>
                <DataGrid rows={props.rows} columns={props.columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              props.setSelectedAuthorRow(e.row)
                              props.setActiveEditUserTestAuthorName(e.row.name)
                          }}
                />
                <Row className="col-md-3 offset-md-9  col-12 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                             if(props.isCreatingNowTestAuthor){
                                 props.setIsCreatingNowTestAuthor(false)
                             }
                             props.setIsEditNowTestAuthor(!props.isEditNowTestAuthor)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(props.isEditNowTestAuthor){
                                 props.setIsEditNowTestAuthor(false)
                             }
                             props.setIsCreatingNowTestAuthor(!props.isCreatingNowTestAuthor)
                         }}>
                        <AddIcon/>
                    </Fab>
                </Row>
                {props.isEditNowTestAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={props.activeEditUserTestAuthorName}
                        onChange={(e) =>{
                            props.setActiveEditUserTestAuthorName(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            if(props.activeEditUserTestAuthorName){
                                props.update_author()
                            }
                        }}>
                            Сохранить
                        </Button>
                        {props.update_author_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {props.isCreatingNowTestAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя нового автора"
                        fullWidth
                        value={props.newUserTestAuthorName}
                        onChange={(e) =>{
                            props.setNewUserTestAuthorName(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            if(props.newUserTestAuthorName){
                                props.create_author()
                            }
                        }}>
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