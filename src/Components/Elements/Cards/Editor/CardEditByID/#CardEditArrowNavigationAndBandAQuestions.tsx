import {Button, ButtonGroup, Collapse, Grid, TextField} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";

export function CardEditArrowNavigationAndBandAQuestions(props: any) {
    const [arrowBeforeValid, setArrowBeforeValid] = useState(true)
    const [arrowUpValid, setArrowUpValid] = useState(true)
    const [arrowDownValid, setArrowDownValid] = useState(true)
    const [arrowNextValid, setArrowNextValid] = useState(true)

    function urlValidation(arrow_url){
        if(arrow_url.length === 0){
            return true
        }
        try {
            const url = new URL(arrow_url);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }

    }
    function arrowBeforeHandler(e){
        setArrowBeforeValid(urlValidation(e.target.value))
        props.autoSave()
        props.setArrowBefore(e.target.value)
    }

    function arrowUpHandler(e){
        setArrowUpValid(urlValidation(e.target.value))
        props.autoSave()
        props.setArrowUp(e.target.value)
    }
    function arrowDownHandler(e){
        setArrowDownValid(urlValidation(e.target.value))
        urlValidation(e.target.value)
        props.autoSave()
        props.setArrowDown(e.target.value)
    }
    function arrowNextHandler(e){
        setArrowNextValid(urlValidation(e.target.value))
        props.autoSave()
        props.setArrowNext(e.target.value)
    }
    return <Grid container
                 style={{paddingLeft: window.innerHeight / window.innerWidth > 1 ? 0 : 48,
                     marginTop: window.innerHeight / window.innerWidth > 1 ? 36 : 0
    }}>
        <Grid item xs={12} md={6}>
            <Collapse in={props.isUseArrowNavigation}>
                <Grid item xs={12} container style={{marginTop: 6}}>
                    <Grid item xs={3} md={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button>
                                <KeyboardArrowLeftOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <TextField
                            error={!arrowBeforeValid}
                            value={props.arrowBefore}
                            onChange={arrowBeforeHandler}
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
                            <Button>
                                <KeyboardArrowDownOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <TextField
                            error={!arrowDownValid}
                            value={props.arrowDown}
                            onChange={arrowDownHandler}
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
                            <Button>
                                <KeyboardArrowUpOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <TextField
                            error={!arrowUpValid}
                            value={props.arrowUp}
                            onChange={arrowUpHandler}
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
                            <Button>
                                <KeyboardArrowRightOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid xs={9} md={6}>
                        <TextField
                            error={!arrowNextValid}
                            value={props.arrowNext}
                            onChange={arrowNextHandler}
                            style={{zoom: "65%"}}
                            label="Ссылка на следующий ресурс"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Collapse>
        </Grid>
        <Grid item xs={12} md={6} spacing={2} container>
            <Grid item xs={12} md={6}>
                <Collapse in={props.in}>
                    <TextField
                        label="ID вопроса для тела карточки"
                        fullWidth
                        value={props.value}
                        onChange={props.onChange}
                    />
                    <Typography>
                        <blockquote/>
                        ТЕКСТ ВОПРОСА: {props.cardBodyQuestionData?.questionById?.text}
                        <blockquote/>
                    </Typography>
                </Collapse>
            </Grid>
            <Grid item xs={12} md={6}>
                <Collapse in={props.in1}>
                    <TextField
                        label="ID вопроса перед входом в карточку"
                        fullWidth
                        value={props.value1}
                        onChange={props.onChange1}
                    />
                    <Typography className="ml-3">
                        <blockquote/>
                        ТЕКСТ ВОПРОСА: {props.cardBeforeCardQuestionData?.questionById?.text}
                        <blockquote/>
                    </Typography>
                </Collapse>
            </Grid>
        </Grid>
    </Grid>;
}
