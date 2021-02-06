import React from "react";
import {Avatar, Grid, Paper, TextField} from "@material-ui/core";
import {Button, Row, Col} from "react-bootstrap";


const imgLink =
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

class Comment extends React.Component{
    render(){
        return(
            <div style={{ padding: 14 }}>
                <h1>Комментарии</h1>
                <Row>
                    <Col className="col-11 ml-2 justify-content-center" >
                        <TextField  variant="outlined" size="medium" fullWidth multiline rows={3}/>
                        <Button variant='outline-primary' className="mt-1">Оставить комментарий</Button>

                        <Paper style={{ padding: "20px 20px", marginTop: 10 }}>
                            <Grid container wrap="nowrap" spacing={2}>
                                <Grid item>
                                     <Avatar alt="Remy Sharp" src={imgLink} />
                            </Grid>
                             <Grid >
                                 <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
                                 <p style={{ textAlign: "left" }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                                        luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.
                                        Suspendisse congue vulputate lobortis. Pellentesque at interdum
                                        tortor. Quisque arcu quam, malesuada vel mauris et, posuere
                                        sagittis ipsum. Aliquam ultricies a ligula nec faucibus. In elit
                                        metus, efficitur lobortis nisi quis, molestie porttitor metus.
                                        Pellentesque et neque risus. Aliquam vulputate, mauris vitae
                                        tincidunt interdum, mauris mi vehicula urna, nec feugiat quam
                                        lectus vitae ex.{" "}
                                 </p>

                             </Grid>
                        </Grid>
                    </Paper>
                    </Col>
                </Row>
            </div>
        )
    }
}

export {Comment}
