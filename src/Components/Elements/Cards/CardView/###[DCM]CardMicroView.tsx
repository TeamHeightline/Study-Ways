import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import {Breadcrumbs, CardActionArea, Chip} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import YouTubeIcon from "@material-ui/icons/YouTube";
import HttpIcon from "@material-ui/icons/Http";
import ImageIcon from "@material-ui/icons/Image";
import {Popover} from "antd";
import React from "react";
import {ClassNameMap} from "@material-ui/styles";

export function DCMCardMicroView(props: { props: Pick<any, string | number | symbol>, height: number, width: number, classes: ClassNameMap<"cover" | "controls" | "root" | "details" | "playIcon" | "content">, onClick: () => void, cardData: any, cardImage: any, callbackfn: (e) => JSX.Element, element: (e, eIndex) => JSX.Element, element1: (e, eIndex) => JSX.Element }) {
    return <div
        // className="col-4"
        {...props.props}>
        <Card variant="outlined" className={props.height / props.width < 1 ? props.classes.root : "col-12"}
              style={{padding: 0, height: "200px", minWidth: "300px"}} onClick={props.onClick}>
            {/*Код для отображения фото из ютуб*/}
            {Number(props.cardData.cardById.cardContentType[2]) === 0 && props.cardData?.cardById?.videoUrl &&
            <CardMedia
                className={props.height / props.width < 1 ? props.classes.cover : "col-12"}

                style={{height: "100px"}}
                image={"https://img.youtube.com/vi/" + props.cardData?.cardById.videoUrl.split("?v=")[1] + "/hqdefault.jpg"}
                title="Live from space album cover"
            />}
            {/*Код для отображения фото от карточек типа Изображение и Внешний ресурс*/}
            {(Number(props.cardData.cardById.cardContentType[2]) === 1 || Number(props.cardData.cardById.cardContentType[2]) === 2) && props.cardImage ?
                <CardMedia
                    className={props.height / props.width < 1 ? props.classes.cover : "col-12"}
                    style={{height: "100px"}}
                    image={props.cardImage}
                    title="Live from space album cover"
                /> : null
            }
            <CardActionArea>
                <CardContent className={props.height / props.width < 1 ? props.classes.content : "col-12"}>
                    <Typography variant="h6" gutterBottom className="pr-5">
                        ID: {props.cardData?.cardById.id}
                        {Number(props.cardData.cardById.cardContentType[2]) === 0 &&
                        <Chip size="small" variant="outlined" color="secondary" icon={<YouTubeIcon/>} label="YouTube"/>}
                        {Number(props.cardData.cardById.cardContentType[2]) === 1 &&
                        <Chip size="small" variant="outlined" color="primary" icon={<HttpIcon/>} label="Ресурс"/>}
                        {Number(props.cardData.cardById.cardContentType[2]) === 2 &&
                        <Chip size="small" variant="outlined" color="default" icon={<ImageIcon/>} label="Изображение"/>}
                    </Typography>
                    <Popover trigger="hover" title="Название карточки" content={[0].map(props.callbackfn)}>
                        <Typography variant="button" display="block" gutterBottom style={{maxHeight: 20}}>
                            {props.cardData?.cardById?.title.slice(0, 25)}
                        </Typography>
                    </Popover>
                    {props.cardData?.cardById?.subTheme.length !== 0 ?
                        <Popover trigger="hover" title="Темы карточки"
                                 content={props.cardData?.cardById?.subTheme.map(props.element)}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography color="inherit">
                                    {props.cardData?.cardById?.subTheme[0]?.theme?.globalTheme?.name.slice(0, 8)}
                                </Typography>
                                <Typography color="inherit">
                                    {props.cardData?.cardById?.subTheme[0]?.theme?.name.slice(0, 8)}
                                </Typography>
                                <Typography color="textPrimary">
                                    {props.cardData?.cardById?.subTheme[0]?.name.slice(0, 10)}
                                </Typography>
                            </Breadcrumbs>
                        </Popover> : <br/>}
                    {props.cardData?.cardById?.author.length !== 0 ?
                        <Popover trigger="hover" title="Авторы карточки"
                                 content={props.cardData?.cardById?.author.map(props.element1)}>
                            <Typography>
                                {props.cardData?.cardById?.author[0]?.name.slice(0, 25)}
                            </Typography>

                        </Popover>
                        : <br/>}
                </CardContent>
            </CardActionArea>
        </Card>
    </div>;
}
