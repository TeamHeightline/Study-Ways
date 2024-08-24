import {Box, Card, CardActionArea, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import React from "react";

interface IUISingleAnswerByDataProps extends BoxProps {
    text?: string,
    isSelected?: boolean,
    onAnswerClick?: () => void,
    imageURL: string,
    isImageDeleted?: boolean,

}


const UISingleAnswerByData = observer(({
                                           text,
                                           imageURL,
                                           isImageDeleted,
                                           onAnswerClick,
                                           isSelected,
                                           ...props
                                       }: IUISingleAnswerByDataProps) => {
    return (
        <Box {...props}>
            <Card variant="outlined"
                  sx={{
                      backgroundColor: isSelected ? "#2296F3" : "",
                      display: 'flex',
                      width: {md: 385, xs: "100%"},
                      height: 400,
                  }}
                  onClick={onAnswerClick}
            >
                <CardActionArea>
                    {!isImageDeleted && imageURL &&
                        <CardMedia
                            style={{opacity: isSelected ? 0.5 : 1}}
                            sx={{height: text ? 240 : 400}}
                            image={imageURL}
                        />}
                    {text &&
                        <CardContent sx={{mb: 2, overflow: "auto"}}>
                            <Typography variant="body1" color="textSecondary"
                                        component="p" sx={{pb: 2}}>
                                {text}
                            </Typography>
                        </CardContent>}
                </CardActionArea>
            </Card>
        </Box>
    )
})

export default UISingleAnswerByData;