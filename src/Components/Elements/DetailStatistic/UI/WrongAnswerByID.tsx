import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import {useQuery} from "@apollo/client";
import {GET_WRONG_ANSWERS} from "../Store/Query";
import {Card, Grow, Typography} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import {Query} from "../../../../SchemaTypes";
import {SERVER_BASE_URL} from "../../../../settings";
import Paper from "@mui/material/Paper";

interface IWrongAnswerByIDProps extends React.HTMLAttributes<HTMLDivElement>{
    answer_id: string | number
}
export const WrongAnswerByID = observer(({answer_id, ...props}: IWrongAnswerByIDProps) =>{
    const {data: answer_data, loading} = useQuery<Query>(GET_WRONG_ANSWERS, {variables:{
        id: answer_id
        }})
    const [answerImageUrl, setAnswerImageUrl] = useState<undefined | string>(undefined)

    function getImageUrlFromServer(){
        if(answer_id){
            fetch(SERVER_BASE_URL + "/files/answer?id="+ answer_id)
                .then(response => response.json())
                .then(data => {
                    if(data && data[0]?.image){
                        setAnswerImageUrl(data[0].image)
                    }
                })
                .catch(() => void(0))
        }
    }
    useEffect(()=>{getImageUrlFromServer()}, [answer_id])

    // if(loading){
    //     return (<Skeleton sx={{width: 385, height: 400}} variant="text"/>)
    // }
    return(
        <Grow in={!loading}>
            <Paper {...props} sx={{pb:1, pt:1, pl: 1}}>
                <Card
                    variant="outlined"
                    sx={{width: 385, height: 400}}
                    style={{borderColor: answer_data?.answerById?.isTrue? "#2296F3" : "#f50057",}}
                >
                    {answerImageUrl &&
                        <CardMedia
                            sx={{height: answer_data?.answerById?.text ? 240: 400}}
                            image={answerImageUrl}
                        />}
                    {answer_data?.answerById?.text &&
                        <CardContent>
                            <Typography variant="body1" color="textSecondary">
                                {answer_data?.answerById?.text}
                            </Typography>
                        </CardContent>}
                </Card>
            </Paper>
        </Grow>
    )
})