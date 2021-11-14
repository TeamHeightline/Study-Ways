import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {Collapse, Stack,} from "@mui/material";
import {useTheme} from "@material-ui/core/styles";

export const CustomNode = (props: any) => {
    const theme = useTheme();
    const [startOpenAnimation, setStartOpenAnimation] = useState(false)
    useEffect(() => {
        setStartOpenAnimation(true)
    }, [])
    useEffect(() => () => {
        setStartOpenAnimation(false)
    }, [])
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };
    return (
        <Collapse in={props.isOpen || startOpenAnimation}>
            <Stack direction={"row"} onClick={() => props.setSelectedThemeID(props.node.id)}>
                {props.node.droppable && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon/>
                    </div>
                )}
                <Typography variant="body1" style={{
                    backgroundColor: props.node.id == props.selectedThemeID ?
                        theme.palette.primary.main : ""
                }}>
                    {props.node.text}
                </Typography>
            </Stack>
        </Collapse>
    )
};
