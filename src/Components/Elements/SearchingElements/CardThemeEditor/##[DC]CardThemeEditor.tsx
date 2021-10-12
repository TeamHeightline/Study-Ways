import React from 'react'
import {Row, Spinner} from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {Button, Fab, Paper} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import {sort} from "fast-sort";

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


    if(!props.all_card_themes_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div style={{maxWidth: 600, height: props.isEditNowCardTheme || props.isCreatingNowCardTheme ||
                props.isAddingNowSubInstance ? 600 :470}}>
            <div style={{height: 470}}>
                <Paper elevation={2} variant="outlined">
                    {
                        !props.all_card_themes_data ? <Spinner animation="border" variant="success" className=" offset-6 mt-5"/> :
                            <TreeView
                                style={{width: "100%", height: 400, overflowY: "auto"}}
                                className={classes.root}
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                expanded={props.expanded}
                                selected={props.selected_id}
                                onNodeToggle={handleToggle}
                                onNodeSelect={props.handleSelect}
                                defaultExpanded={props.expanded}
                            >
                                {sort(props.all_card_themes_data?.cardGlobalTheme).asc([
                                    (anyTheme: any) => anyTheme.name.replace(/\D/g,'').length != 0? Number(anyTheme.name.replace(/[^\d]/g, '')) : 10000000,
                                    (anyTheme: any) => anyTheme.name])
                                    ?.map((sameGlobalTheme: any) =>{
                                    return(
                                        <TreeItem nodeId={String(sameGlobalTheme.id * 1000000)}
                                                  label={sameGlobalTheme.name}
                                                  key={sameGlobalTheme.id *1000000} >
                                            {
                                                sort(sameGlobalTheme?.cardthemeSet)
                                                    .asc([
                                                        (anyTheme: any) => anyTheme.name.replace(/\D/g,'').length != 0? Number(anyTheme.name.replace(/[^\d]/g, '')) : 10000000,
                                                        (anyTheme: any) => anyTheme.name])
                                                    ?.map((sameTheme: any) =>{
                                                    return(
                                                        <TreeItem
                                                            nodeId={String(sameTheme.id * 1000)}
                                                                  label={sameTheme.name}
                                                                  key={sameTheme.id * 1000}>
                                                            {sort(sameTheme?.cardsubthemeSet)
                                                                .asc([
                                                                (anyTheme: any) => anyTheme.name.replace(/\D/g,'').length != 0? Number(anyTheme.name.replace(/[^\d]/g, '')) : 10000000,
                                                                (anyTheme: any) => anyTheme.name])
                                                                ?.map((sameSubTheme: any) =>{
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
                            </TreeView>}
                </Paper>
                {/*<Divider />*/}
                <Row className="col-md-6 offset-md-7 col-12 mt-2">
                         <Fab color="primary"
                              className=""
                              disabled={!props.canBeEdited}
                              onClick={() =>{
                                  props.setIsAddingNowSubInstance(false)
                                  props.setIsCreatingNowCardTheme(false)

                                  props.setIsEditNowCardTheme(!props.isEditNowCardTheme)
                              }}
                         >
                             <SettingsIcon />
                         </Fab>
                        <Fab color="primary"
                             className="ml-2"
                             onClick={() =>{
                                 props.setIsAddingNowSubInstance(false)
                                 props.setIsEditNowCardTheme(false)

                                 props.setIsCreatingNowCardTheme(!props.isCreatingNowCardTheme)
                             }}
                        >
                            <AddIcon/>

                        </Fab>
                        <Fab color="primary"
                             className="ml-2"
                             disabled={!props.canAddSubItem}
                             onClick={() =>{
                                 props.setIsEditNowCardTheme(false)
                                 props.setIsCreatingNowCardTheme(false)

                                 props.setIsAddingNowSubInstance(!props.isAddingNowSubInstance)
                             }}
                        >
                            <SubdirectoryArrowRightIcon/>

                        </Fab>
                </Row>
                {props.isEditNowCardTheme && props.canBeEdited  && Number(props.selected_id) < 999 && <div>
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
                {props.isEditNowCardTheme && props.canBeEdited && Number(props.selected_id) >= 1000 && Number(props.selected_id) < 1000000 && <div>
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
                                onClick={() =>{
                                    props.update_theme()}
                                }
                        >
                            Сохранить тему
                        </Button>
                        {props.update_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {props.isEditNowCardTheme && props.canBeEdited  && Number(props.selected_id) > 999999 && <div>
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
                            onClick={() =>{
                            props.update_global_theme()}}
                        >
                            Сохранить глобальную тему
                        </Button>
                        {props.update_global_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {((props.isCreatingNowCardTheme && Number(props.selected_id) < 1000) ||
                    (props.isAddingNowSubInstance && Number(props.selected_id) >= 1000 && Number(props.selected_id) < 1000000))
                && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название новой подтемы"
                        fullWidth
                        value={props.activeAddData}
                        onChange={(e) =>{
                        props.setActiveAddData(e.target.value)}
                    }
                        />
                        <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary"
                        onClick={() =>{
                        props.create_sub_theme()}}
                        >
                            Создать подтему
                        </Button>
                    {props.create_sub_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                        </Row>
                </div>
                }
                {((props.isCreatingNowCardTheme && Number(props.selected_id) >= 1000)  && (props.isCreatingNowCardTheme && Number(props.selected_id) < 1000000)||
                    props.isAddingNowSubInstance && Number(props.selected_id) >= 1000000)
                && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название новой темы"
                        fullWidth
                        value={props.activeAddData}
                        onChange={(e) =>{
                            props.setActiveAddData(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary"
                                onClick={() =>{
                                    props.create_theme()}}
                        >
                            Создать тему
                        </Button>
                        {props.create_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>
                }
                {((props.isCreatingNowCardTheme && Number(props.selected_id) >= 1000000))
                && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название новой глобальной темы"
                        fullWidth
                        value={props.activeAddData}
                        onChange={(e) =>{
                            props.setActiveAddData(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary"
                                onClick={() =>{
                                    props.create_global_theme()}}
                        >
                            Создать глобальную тему
                        </Button>
                        {props.create_global_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>
                }
            </div>
        </div>
    )
}