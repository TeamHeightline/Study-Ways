import {observer} from "mobx-react";
import React from "react";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import {Card, CardActionArea, Grid, Typography} from "@material-ui/core";
import {Row} from "react-bootstrap";
import {QSShowAllOrMyQSFlag} from "./#QSShowAllOrMyQSFlag";

export const MainPageQSForSelect = observer(() =>{

    return(
        <React.Fragment>
            <Grid container justify="center">
                <Grid item xs="auto">
                    <QSShowAllOrMyQSFlag/>
                </Grid>
            </Grid>
            {StatisticPageStoreObject.qsDataForRenderOnPage?.map((sequence) =>{
                return(
                    <div key={sequence?.id} className="mt-3 col-md-5 col-12">
                        <Card variant="outlined" key={sequence?.id + "SequenceKey"} style={{padding: 0}}
                              onClick={ () => {void(0)}}>
                            <CardActionArea className="col-12" style={{flex: "auto"}}
                            onClick={() => {
                                StatisticPageStoreObject.selectedQuestionSequenceID = sequence?.id
                            }}>
                                <div className="ml-4">
                                    <Typography variant="h6" color="textSecondary" className="ml-2 mt-2">
                                        <strong>
                                            {"ID: " + sequence?.id}
                                        </strong>
                                    </Typography>
                                    <Typography className="ml-2">
                                        {"Название: " + sequence?.name}
                                    </Typography>

                                    <Typography className="ml-2">
                                        {"Описание: " + sequence?.description}
                                    </Typography>

                                    <Row className="mr-3 ml-2" style={{overflowY: "auto"}}>
                                        {sequence?.sequenceData?.sequence?.map( (question, qIndex) =>{
                                            return(
                                                <Card
                                                    style={{borderColor: "#2296F3"}}
                                                    variant="outlined" className="col-2 mr-2 ml-2 mt-2" key={sequence?.id + "SequenceKey"+ qIndex + "QuestionKey"}>
                                                    {question}
                                                    <br/>
                                                </Card>
                                            )
                                        })}
                                        <br/>
                                    </Row>
                                    <br/>
                                </div>
                            </CardActionArea>
                        </Card>
                    </div>
                )
            })}
        </React.Fragment>
    )
})