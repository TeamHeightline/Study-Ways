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
    const [selected, setSelected] = React.useState(['']);
    const handleToggle = (event, nodeIds) => {
        // console.log(nodeIds)
        props.setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        console.log(selected)
        setSelected(nodeIds);
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
                    selected={selected}
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
                {props.isEditNowCardTheme  && Number(selected) < 1000 && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Название подтемы"
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
            </div>
        </div>
    )
}