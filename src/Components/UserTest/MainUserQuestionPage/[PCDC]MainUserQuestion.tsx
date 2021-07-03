import React from 'react';
import {Container, Form, Spinner} from "react-bootstrap";
import {Button, Paper, TextField} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Collapse from "@material-ui/core/Collapse";
import {Autocomplete} from "@material-ui/lab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ImageQuestion from "../ImageQuestion";
import QuestionById from "../QuestionByID";
export default function PCDCMainUserQuestion({...props}: any){
    if (!props.data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (!props.testHadBeenStarted) {
        return (
            <div>
                <Container className="justify-content-center col-12 col-lg-4 mt-5">
                    <Paper className="justify-content-center" style={{maxWidth: "500px"}}>
                        <div className="mr-2 ml-2">
                            <br/>
                            <div className="display-4 text-center " style={{fontSize: '33px'}}>
                                Выбирите вопрос и уровень сложности
                            </div>
                            <FormControlLabel
                            className="mt-3"
                            control={
                                <Switch
                            checked={props.showAuthorAndThemesSelectorPanel}
                            onChange={(e) => {
                                props.setShowAuthorAndThemesSelectorPanel(e.target.checked)
                                props.setQuestionForSelectAfterSelectedTheme()
                                if (!e.target.checked){
                                    props.setQuestionsForSelect(props.data.question)
                                }
                            }}
                            name="checkedB"
                            color="primary"
                                />
                        }
                            label="Искать по темам или авторам"
                            />
                            <div className="mt-3">
                            <Collapse in={props.showAuthorAndThemesSelectorPanel}>
                            <Form.Control
                                className="mt-1"
                            // size="lg"
                            as="select"
                            value={props.selectedAuthor}
                            onChange={async (event) => {
                                await props.setSelectedAuthor(event.target.value)
                                await props.setThemesForSearching(props.returnThemesOfQuestionsWhereAuthorSameThatSelected(props.data, event.target.value))
                                props.setQuestionForSelectAfterSelectedTheme(props.returnThemesOfQuestionsWhereAuthorSameThatSelected(props.data, event.target.value)[0].id,
                                    event.target.value)
                            }}>
                            {props.authorsForSearching.map((author: any) => {
                                return (<option key={author.id + "authorForSelect"}
                                value={author.id}>Автор: {author.name}</option>)
                            })}
                            </Form.Control>

                            {props.selectedAuthor && props.selectedAuthor?.id !== -10 ?
                                <Form.Control
                                    className="mt-1"
                                // size="lg"
                                as="select"
                                value={props.selectedTheme}
                                onChange={async (event) => {
                                props.setSelectedTheme(event.target.value)
                                props.setQuestionForSelectAfterSelectedTheme(event.target.value)
                            }}>
                                {props.themesForSearching.map((theme: any) => {
                                    return (<option key={theme.id + "themeForSelect"}
                                    value={theme.id}>Тема: {theme.name}</option>)
                                })}
                                </Form.Control> : null}

                                </Collapse>
                                </div>
                                <Autocomplete
                                className="mt-3"
                                id="combo-box-demo"
                                fullWidth
                                options={props.questionsForSelect}
                                getOptionLabel={(option: any) => option.text}
                                renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                                onChange={(e: any, values: any) => {
                                props.autocompliteSelectHandleChange(e, values)
                            }}
                                />
                                <Row className="mt-3">
                            <Col>
                                <Form.Control
                                    className="mt-1"
                                // size="lg"
                                as="select"
                                value={props.helpLevel}
                                onChange={props.onChangeHelpLevel}>
                                <option value={"0"}>Легкий</option>
                                    <option value={"1"}>Средний</option>
                                <option value={"2"}>Сложный</option>
                                </Form.Control>
                                </Col>
                                <Col className="offset-2">
                            <Button className="mt-1" variant="contained" color="primary" onClick={() => {
                                props.changeTestHadBeenStarted(true)
                            }}>
                                Начать тест
                            </Button>
                            </Col>
                            </Row>
                            <br/>
                        </div>
                </Paper>
            </Container>
        </div>
        )
    }
    if (!props.get_question_data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (props.get_question_data?.questionById?.isImageQuestion){
        return (
            <ImageQuestion id={props.selectedQuestionId} helpLevel={props.helpLevel} onChange={(e) =>{
                if(e === "goBack"){
                    props.changeTestHadBeenStarted(false)
                }
            }}/>
        )
    }
    return (
        <ImageQuestion id={props.selectedQuestionId} helpLevel={props.helpLevel} onChange={(e) =>{
            if(e === "goBack"){
                props.changeTestHadBeenStarted(false)
            }
        }}/>)

}