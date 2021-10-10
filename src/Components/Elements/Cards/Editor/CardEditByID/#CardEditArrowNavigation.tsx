import {Button, ButtonGroup, Collapse, Grid, TextField} from "@material-ui/core";
import KeyboardArrowLeftOutlinedIcon from "@material-ui/icons/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@material-ui/icons/KeyboardArrowRightOutlined";
import Typography from "@material-ui/core/Typography";
import React from "react";

export function CardArrowNavigation(props: any) {
    return <Grid container
                 style={{paddingLeft: window.innerHeight / window.innerWidth > 1 ? 0 : 48,
                     marginTop: window.innerHeight / window.innerWidth > 1 ? 36 : 0
    }}>
        <Grid item xs={12} md={6}>
            <Grid item xs={12} container>
                <Grid item xs={3} md={1}>
                    <ButtonGroup size="medium" color="primary">
                        <Button>
                            <KeyboardArrowLeftOutlinedIcon/>
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid xs={9} md={6}>
                    <TextField
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
                        style={{zoom: "65%"}}
                        label="Ссылка на следующий ресурс"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
            </Grid>
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
