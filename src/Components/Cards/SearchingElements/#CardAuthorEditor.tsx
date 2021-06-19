import React, {useState} from 'react'
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import {Row, Spinner} from "react-bootstrap";
import {DataGrid} from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from '@material-ui/icons/Settings';
import {Fab} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
const GET_CARD_AUTHOR= gql`
    query GET_CARD_AUTHOR{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }`
const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Автор карточки', width: 500},
]

export default  function CardAuthorEditor(){
    const [rows, setRows] = useState<any>()
    const [selectedAuthorRow, setSelectedAuthorRow] = useState<any>()
    const [activeEditCardAuthorName, setActiveEditCardAuthorName] = useState<string>()
    const [isEditNowCardAuthor, setIsEditNowCardAuthor] = useState(false)
    const [isCreatingNowCardAuthor, setIsCreatingNowCardAuthor] = useState(false)

    const {data: card_author_data} = useQuery(GET_CARD_AUTHOR, {
        onCompleted: data=>{
            const rows: any = []
            // console.log(data.me)
            data.me.cardauthorSet.map((sameAuthor) =>{
                rows.push({id: sameAuthor.id, name: sameAuthor.name})
            })
            setRows(rows)
        }
    })
    if(!card_author_data || !rows){
        return(
                <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <DataGrid rows={rows} columns={columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              setSelectedAuthorRow(e.row)
                              setActiveEditCardAuthorName(e.row.name)
                          }}
                />
                <Row className="col-3 offset-9 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                            setIsEditNowCardAuthor(!isEditNowCardAuthor)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             setIsCreatingNowCardAuthor(!isCreatingNowCardAuthor)
                         }}>
                        <AddIcon/>
                    </Fab>
                </Row>
                {isEditNowCardAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={activeEditCardAuthorName}
                        onChange={(e) =>{
                            setActiveEditCardAuthorName(e.target.value)}
                        }
                    />
                </div>}
            </div>
        </div>
    )
}