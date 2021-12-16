import {observer} from "mobx-react";
import React from 'react';
import {Button, ButtonGroup, Collapse, Grid, TextField} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface IArrowNavigationProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const ArrowNavigation = observer(({...props}: IArrowNavigationProps) =>{
    return(
        <div {...props}>
            <Collapse in={CESObject.getField("isCardUseArrowNavigation", false)}>
                <Grid item xs={12} container style={{marginTop: 6}}>
                    <Grid item xs={3} md={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button onClick={() =>
                                window.open(CESObject.getField("arrowBefore", ""), "_blank")}>
                                <KeyboardArrowLeftOutlinedIcon />
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <TextField
                            error={!CESObject.validateUrlField("arrowBefore")}
                            value={CESObject.getField("arrowBefore", "")}
                            onChange={CESObject.changeField("arrowBefore")}
                            style={{zoom: "65%"}}
                            label="Ссылка на предыдущий ресурс"
                            variant="outlined"
                            fullWidth
                        />
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
                        <TextField
                            error={!CESObject.validateUrlField("arrowDown")}
                            value={CESObject.getField("arrowDown", "")}
                            onChange={CESObject.changeField("arrowDown")}
                            style={{zoom: "65%"}}
                            label="Ссылка на более простой ресурс"
                            variant="outlined"
                            fullWidth
                        />
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
                        <TextField
                            error={!CESObject.validateUrlField("arrowUp")}
                            value={CESObject.getField("arrowUp", "")}
                            onChange={CESObject.changeField("arrowUp")}
                            style={{zoom: "65%"}}
                            label="Ссылка на более сложный ресурс"
                            variant="outlined"
                            fullWidth
                        />
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
                        <TextField
                            error={!CESObject.validateUrlField("arrowNext")}
                            value={CESObject.getField("arrowNext", "")}
                            onChange={CESObject.changeField("arrowNext")}
                            style={{zoom: "65%"}}
                            label="Ссылка на следующий ресурс"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Collapse>
        </div>
    )
})