import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';

import { CardActionArea} from "@mui/material";
import 'fontsource-roboto';
import {Row} from "react-bootstrap";
import 'fontsource-roboto';


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        width: "400px",
        height: "170px"
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 200,
    },
}));

interface CreateNewCardProps extends React.HTMLAttributes<HTMLDivElement>{
    startCreatingCard: any
}

export default function CreateNewCard({startCreatingCard, ...props}: CreateNewCardProps){
    const classes = useStyles();

    return(
        <div
            // className="col-4"
            {...props}>
            <Card variant="outlined" className={classes.root} onClick={() =>{
                startCreatingCard(true)
            }}>
                <CardMedia
                    className={classes.cover}
                    image="https://www.shareicon.net/data/256x256/2017/03/06/880378_blue_512x512.png"
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
            </Card>
        </div>
    )
}