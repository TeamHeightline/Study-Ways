// https://image-store-iot-experemental.s3.amazonaws.com/question-images/2021/04/11/img020.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QESEDVQVQN6BL4P%2F20210411%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210411T134742Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=25b7888a08c977a1b910e1feced0f9996ee5863d7b20686a4106c02580e4a777

import React from 'react';
import {Theme, createStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Col from "react-bootstrap/Col";
import {Form} from "react-bootstrap";
import {Button, CardActionArea, CardActions, Grid} from "@material-ui/core";
import Row from "react-bootstrap/Row";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            maxWidth: 385,
            height: 400,
            paddingBottom: '200px'

        },
        media: {
            height: 140,

        },

        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        playIcon: {
            height: 38,
            width: 38,
        },

    }),
);
export default function ImageTest() {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div>
            <Row className="">
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                <div className="col-5 ml-2 mt-3">
                    <Card style={{height: 400}}>
                        <Row>
                            <Col className="col-7">
                                <CardMedia
                                    className="col-11"
                                    style={{height: 400, width: 400}}
                                    image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                    title="Из при веденных ниже высказываний выберите те, из которых можно составить максимально полный ответ на вопрос: В чем состоит закон Кулона и какова область его применимости в рамках классической физики"
                                />
                            </Col>
                            <Col >
                                <div>
                                    <CardContent >
                                        <Typography component="h5" variant="h5">
                                            Вопрос
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Из при веденных ниже высказываний выберите те, из которых можно составить
                                            максимально
                                            полный ответ на вопрос: В чем состоит закон Кулона и какова область его
                                            применимости в
                                            рамках классической физики
                                            Из при веденных ниже высказываний выберите те, из которых можно составить
                                            максимально
                                            полный ответ на вопрос: В чем состоит закон Кулона и какова область его
                                            применимости в
                                            рамках классической физики

                                        </Typography>
                                    </CardContent>
                                    <Row className="ml-auto mr-2 pb-2">
                                        <Col className="col-6">
                                            <Form.Control
                                                // size="lg"
                                                as="select">
                                                <option value={"0"}>Легкий</option>
                                                <option value={"1"}>Средний</option>
                                                <option value={"2"}>Сложный</option>
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Button variant="contained" color="primary">
                                                Проверить
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>




                <div className=" mt-3 ml-2">
                    <Card className={classes.root} onClick={() =>{console.log("------------")}}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Согласно закону Кулона, любые два покоящиеся электрически заряженные тела
                                    взаимодействуют друг с другом с силами, величины которых пропорциональны произведению
                                    величин зарядов этих тел и обратно-пропорциональны квадрату расстояния между их центрами
                                    зарядов, положение которых определяется аналогично положению центров масс с точностью до
                                    замены m на q. -600
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>


                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Электростатические силы, возникающие при взаимодействии двух существенно протяженных заряженных тел направлены вдоль прямой, соединяющей ближайшие точки этих тел. -610
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>



                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Каждая из возникающих при взаимодействии двух точечных заряженных тел электростатических сил направлена вдоль вектора, проведенного из точки нахождения тела, воздействующего на рассматриваемое, в точку нахождения рассматриваемого тела, испытывающего действие силы. +2150
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>



                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Закон Кулона позволяет рассчитывать обусловленные электромагнитными взаимодействиями полные силы, возникающие между неподвижными макроскопическими телами.. +2100
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>



                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Каждая из возникающих при взаимодействии двух точечных заряженных тел электростатических сил направлена вдоль прямой, соединяющей заряды и является силой притяжения в случае одноименных зарядов и силой отталкивания в случае, если заряды разноименны. -300
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>



                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Согласно закону Кулона, любые два точечные электрически заряженные тела взаимодействуют друг с другом с силами, величины которых пропорциональны произведению величин зарядов этих тел и обратно-пропорциональны квадрату расстояния между ними +2000
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>



                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Закон Кулона применим для приближенного описания электростатических взаимодействий между макроскопическими телами малых (по сравнению с расстоянием между ними) размеров и для описания электростатических взаимодействий между элементарными частицами вплоть до расстояний, сравнимых с оценками характерных размеров этих частиц. +2200
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>


                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Закон Кулона, описывающий электростатические взаимодействия двух макроскопических тел, размеры которых малы по сравнению с расстоянием между ними, является абсолютно точным. Например сила взаимодействия незаряженного металлического шарика с точечным положительным зарядом, согласно закону Кулона, равна 0, и это прекрасно подтверждается на эксперименте. -1000
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>


                <div className=" mt-3 ml-3">
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Согласно закону Кулона, любые два покоящиеся электрически заряженные тела
                                    взаимодействуют друг с другом с силами, величины которых пропорциональны произведению
                                    величин зарядов этих тел и обратно-пропорциональны квадрату расстояния между их центрами
                                    зарядов, положение которых определяется аналогично положению центров масс с точностью до
                                    замены m на q. -600
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
                </Grid>
            </Row>
        </div>
)
}