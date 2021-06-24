import React from 'react'
import {Spinner} from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
});


export default function DCCardThemeEditor({...props}: any){
    const classes = useStyles();
    const [selected, setSelected] = React.useState([]);
    const handleToggle = (event, nodeIds) => {
        props.setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };
    if(!props.all_card_themes_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <TreeView
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
                        <TreeItem nodeId={String(sameGlobalTheme.id * 1000000)} label={sameGlobalTheme.name} key={sameGlobalTheme.id *1000000} >
                            {
                                sameGlobalTheme?.cardthemeSet.map((sameTheme) =>{
                                    return(
                                        <TreeItem nodeId={String(sameTheme.id * 1000)} label={sameTheme.name} key={sameTheme.id * 1000}>
                                            {sameTheme?.cardsubthemeSet.map((sameSubTheme) =>{
                                                // setExpanded(__expanded)
                                                return(<TreeItem nodeId={String(sameSubTheme.id)} label={sameSubTheme.name}
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
        </div>
    )
}