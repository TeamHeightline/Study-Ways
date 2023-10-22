import React, {useEffect, useState} from "react";
import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {SERVER_BASE_URL} from "../../settings";


export default function ImageAnswerNode(props: any) {
    const [answerImgUrl, setAnswerImgUrl] = useState('')
    const [urlHasBeenPassed, setUrlHasBeenPassed] = useState(false)
    const [isSelected, changeIsSelected] = useState(false)
    const fetchData = async () => {
        const data = await axios(SERVER_BASE_URL + "/files/answer?id=" + props.answer.id)
        try {
            setUrlHasBeenPassed(true)
            setAnswerImgUrl(data.data[0].image)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchData()
    }, [props.answerIndex]);
    let borderColor = props?.selected && props?.selected?.indexOf(props?.answer?.id) !== -1 ? "#71c3ef" : ""
    if (props.borderIsTrueStrategy) {
        borderColor = props.answer.isTrue ? "#2196f3" : "#f50057"
    }

    return (
        <div className=" mt-3">
            {/*"#93cdf3"*/}
            <Card variant="outlined"
                  sx={{
                      display: 'flex',
                      width: 385,
                      height: 400, backgroundColor: borderColor
                  }}

                  onClick={() => {
                      props.onChange(props.answer.id)
                      setTimeout(changeIsSelected, 150, !isSelected)
                  }}>
                <CardActionArea>
                    {!props?.answer.isImageDeleted && answerImgUrl ?
                        <CardMedia
                            style={{opacity: props.selected.indexOf(props.answer.id) !== -1 ? 0.5 : 1}}
                            sx={{height: (props?.answer?.text || props?.answerText) ? 240 : 400}}
                            image={answerImgUrl}
                            title="Contemplative Reptile"
                        /> : null}
                    {props?.answer?.text &&
                        <CardContent className="mb-5">
                            <Typography variant="body1" color="textSecondary" component="p" className="mb-5 pb-5">
                                {props?.answer?.text ? props?.answer?.text : props?.answerText}
                            </Typography>
                        </CardContent>}
                </CardActionArea>
            </Card>
        </div>
    )
}

