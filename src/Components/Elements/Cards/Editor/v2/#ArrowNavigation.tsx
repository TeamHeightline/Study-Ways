import {observer} from "mobx-react";
import React from 'react';
import {Button, ButtonGroup, Collapse, Grid} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {SelectCard} from "./##SelectCard";

interface IArrowNavigationProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const ArrowNavigation = observer(({...props}: IArrowNavigationProps) =>{
    return(
        <div {...props}>
            <Collapse in={CESObject.getField("isCardUseArrowNavigation", false)}>
                <Grid alignItems={"center"} item xs={12} container style={{marginTop: 6}}>
                    <Grid item xs={3} md={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button onClick={() =>
                                window.open(CESObject.getField("arrowBefore", ""), "_blank")}>
                                <KeyboardArrowLeftOutlinedIcon />
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <SelectCard card_direction={"cardBefore"}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} container style={{marginTop: 6}}>
                    <Grid item xs={3} md={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button onClick={() =>
                                window.open(CESObject.getField("arrowDown", ""), "_blank")}>
                                <KeyboardArrowDownOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <SelectCard card_direction={"cardDown"}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} container style={{marginTop: 6}}>
                    <Grid item xs={3} md={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button onClick={() => window.open(CESObject.getField("arrowUp", ""), "_blank")}>
                                <KeyboardArrowUpOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <SelectCard card_direction={"cardUp"}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} container style={{marginTop: 6}}>
                    <Grid item xs={3} md={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button onClick={() =>
                                window.open(CESObject.getField("arrowNext", ""), "_blank")}>
                                <KeyboardArrowRightOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <SelectCard card_direction={"cardNext"}/>
                    </Grid>
                </Grid>
            </Collapse>
        </div>
    )
})