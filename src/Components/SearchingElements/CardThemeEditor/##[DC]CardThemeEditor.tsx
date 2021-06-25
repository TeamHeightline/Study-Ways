import React from 'react'
import {Row, Spinner} from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {Button, Divider, Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
});


export default function DCCardThemeEditor({...props}: any){
    const classes = useStyles();

    const handleToggle = (event, nodeIds) => {
        // console.log(nodeIds)
        props.setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        console.log(nodeIds)
        //Редактирование подтем
        if(nodeIds < 999){
            props.setActiveEditData(props.all_sub_themes.find(obj => {return obj.id == nodeIds}).name)
            props.set_selected_sub_theme_ID(nodeIds)
            // console.log(props.all_sub_themes.find(obj => {return obj.id == nodeIds}).name)
        }
        //Редактирование тем
        if(nodeIds > 1000 && nodeIds < 999999){
            // console.log(props.all_themes.find(obj => {return obj.id * 1000 == nodeIds}).name)
            props.setActiveEditData(props.all_themes.find(obj => {return obj.id * 1000 == nodeIds}).name)
            props.set_selected_theme_ID(Number(nodeIds) /1000)
        }
        //Редактирование глобальных тем
        if( nodeIds > 999999){
            // console.log(props.all_global_themes.find(obj => {return obj.id * 1000000 == nodeIds}).name)
            props.setActiveEditData(props.all_global_themes.find(obj => {return obj.id * 1000000 == nodeIds}).name)
            props.set_selected_global_theme_ID(Number(nodeIds)/1000000)
        }
        props.set_selected_id(nodeIds);
    };
    if(!props.all_card_themes_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <TreeView
                    style={{width: "100%", height: 350, overflowY: "auto"}}
                    className={classes.root}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={props.expanded}
                    selected={props.selected_id}
                    onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    defaultExpanded={props.expanded}
                >
                    {props.all_card_themes_data?.cardGlobalTheme?.map((sameGlobalTheme) =>{
                        return(
                            <TreeItem nodeId={String(sameGlobalTheme.id * 1000000)}
                                      label={sameGlobalTheme.name}
                                      key={sameGlobalTheme.id *1000000} >
                                {
                                    sameGlobalTheme?.cardthemeSet.map((sameTheme) =>{
                                        return(
                                            <TreeItem nodeId={String(sameTheme.id * 1000)}
                                                      label={sameTheme.name}
                                                      key={sameTheme.id * 1000}>
                                                {sameTheme?.cardsubthemeSet.map((sameSubTheme) =>{
                                                    // setExpanded(__expanded)
                                                    return(<TreeItem nodeId={String(sameSubTheme.id)}
                                                                     label={sameSubTheme.name}
                                                                     key={sameSubTheme.id}/>)
                                                })}
                                            </TreeItem>
                                        )
                                    })
                                }
                            </TreeItem>
                        )
                    })}
                </TreeView>
                <Divider />
                <Row className="col-3 offset-9 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                             if(props.isCreatingNowCardTheme){
                                 props.setIsCreatingNowCardTheme(false)
                             }
                             props.setIsEditNowCardTheme(!props.isEditNowCardTheme)
                         }}
                    >
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(props.isEditNowCardTheme){
                                 props.setIsEditNowCardTheme(false)
                             }
                             props.setIsCreatingNowCardTheme(!props.isCreatingNowCardTheme)
                         }}
                    >
                        <AddIcon/>

                    </Fab>
                </Row>
                {props.isEditNowCardTheme  && Number(props.selected_id) < 999 && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название подтемы"
                        fullWidth
                        value={props.activeEditData}
                        onChange={(e) =>{
                            props.setActiveEditData(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary"
                                onClick={() =>{
                                    props.update_sub_theme()}}
                            >
                            Обновить подтему
                        </Button>
                        {props.update_sub_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {props.isEditNowCardTheme  && Number(props.selected_id) > 1000 && Number(props.selected_id) < 1000000 && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название темы"
                        fullWidth
                        value={props.activeEditData}
                        onChange={(e) =>{
                            props.setActiveEditData(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary"
                                // onClick={() =>{
                            // props.update_theme()}}
                                    >
                            Сохранить тему
                        </Button>
                        {props.update_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {props.isEditNowCardTheme   && Number(props.selected_id) > 999999 && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название глобальной темы"
                        fullWidth
                        value={props.activeEditData}
                        onChange={(e) =>{
                            props.setActiveEditData(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary"
                            // onClick={() =>{
                            // props.update_theme()}}
                        >
                            Сохранить глобальную тему
                        </Button>
                        {props.update_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
            </div>
        </div>
    )
}