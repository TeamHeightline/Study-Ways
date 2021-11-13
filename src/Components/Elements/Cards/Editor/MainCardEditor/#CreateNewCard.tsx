import React, { useState} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';

import { CardActionArea} from "@mui/material";
import {gql} from "@apollo/client/core";
import 'fontsource-roboto';
import {useMutation,} from "@apollo/client";
import {Row, Spinner} from "react-bootstrap";
import 'fontsource-roboto';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: "400px",
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
    playIcon: {
        height: 38,
        width: 38,
    },
}));


const CREATE_NEW_CARD = gql`
    mutation CREATE_NEW_CARD{
        card(input: {cardContentType: "0", isCardUseMainContent: true, isCardUseMainText: true,
            title: "Название карточки по умолчанию", createdBy: 0, text: "Описание карточки"}){
            errors{
                field

            }
        }
    }`

export default function CreateNewCard({cardID = 1, ...props}: any,){
    const classes = useStyles();
    const [stateOfCreating, setStateOfCreating] = useState(0) // 0- ничего не происходит, 1- ожидается ответ от сервера, 10 - ошибка
    const [create_mutation] = useMutation(CREATE_NEW_CARD,
        {
            onError: error => {
                setStateOfCreating(10)
                console.log(error)
                props.onCreate()
            },
            onCompleted: data => {
                setStateOfCreating(0)
                console.log(data)
                props.onCreate()
            }
        })
    const createNewCardHandle = () =>{
        setStateOfCreating(1)
        create_mutation()
            .then(() => props.onCreate())
    }
    // console.log(card_data?.cardById.videoUrl.split('?v=')[1])
    // 380 * 110

    return(
        <div
            // className="col-4"
            {...props}>
            <Card variant="outlined" className={classes.root} onClick={() =>{
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
                                <Typography style={{paddingLeft: 6}} variant="h4"  gutterBottom>
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