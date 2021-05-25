import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Typography from '@material-ui/core/Typography';

import {Breadcrumbs, CardActionArea, Chip, Grid, Paper, Tooltip} from "@material-ui/core";
import {gql} from "@apollo/client/core";
import 'fontsource-roboto';
import {useMutation, useQuery} from "@apollo/client";
import {Row, Spinner} from "react-bootstrap";
const AddImg = require('../../../../img/add-to-any.jpg')
import 'fontsource-roboto';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: "550px",
        height: "170px"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    contentText:{
        // ...theme.typography.button,
        fontSize: "20px",
        marginLeft: "40px",

    },
    cover: {
        width: 200,
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
}));

const CREATE_NEW_CARD = gql`
    mutation CREATE_NEW_CARD{
        card(input: {cardContentType: "0", isCardUseMainContent: true, isCardUseMainText: true,
            title: "Название карточки по умолчанию", createdBy: 0}){
            errors{
                field

            }
        }
    }`

export default function CreateNewCard({cardID = 1, ...props}: any,){
    const classes = useStyles();
    const [stateOfCreating, setStateOfCreating] = useState(0) // 0- ничего не происходит, 1- ожидается ответ от сервера, 10 - ошибка
    const [create_mutation, {data: mutation_data}] = useMutation(CREATE_NEW_CARD,
        {
            onError: error => {
                setStateOfCreating(10)
                console.log(error)
            },
            onCompleted: data => {
                setStateOfCreating(0)
                console.log(data)
            }
        })
    const createNewCardHandle = () =>{
        setStateOfCreating(1)
        create_mutation()
    }
    // console.log(card_data?.cardById.videoUrl.split('?v=')[1])
    // 380 * 110

    return(
        <div
            // className="col-4"
            {...props}>
            <Card className={classes.root} onClick={() =>{
                createNewCardHandle()
            }}>
                {stateOfCreating === 0 &&
                    <>
                        <CardMedia
                            className={classes.cover}
                            image="https://www.shareicon.net/data/256x256/2017/03/06/880378_blue_512x512.png"
                            title="Live from space album cover"
                        />
                    <CardActionArea >
                        <CardContent className={classes.content}>
                            <Row>
                                <Typography className={classes.contentText} variant="overline"  gutterBottom>
                                    Создать новую карточку
                                </Typography>
                            </Row>
                        </CardContent>
                    </CardActionArea>
                    </>}
                {stateOfCreating === 1 && <CardContent>
                    <Typography>
                        Карточка создается
                    </Typography>
                    <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
                </CardContent>}

            </Card>
        </div>
    )
}