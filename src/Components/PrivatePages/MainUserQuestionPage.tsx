import React from 'react';
import {Container, Form, Spinner} from "react-bootstrap";
import {Button, FormControl, InputLabel, MenuItem, Paper, Select} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Collapse from "@material-ui/core/Collapse";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ImageQuestion} from "../Elements/UserTest/ImageQuestion/ImageQuestion";
import {observer} from "mobx-react";
import {QuestionPageStorage} from "../../Store/PublicStorage/QuestionPage/QuestionPageStore";
import {toJS} from "mobx";

export const MainUserQuestionPage = observer(() =>{

    if (!QuestionPageStorage.questionsData) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (!QuestionPageStorage.isOpenQuestionPlayer) {
        return (
            <div>
                <Container className="justify-content-center col-12 col-lg-4 mt-5">
                    <Paper variant="outlined" className="justify-content-center pr-2 pl-2" style={{maxWidth: "500px"}}>
                        <div className="mr-2 ml-2">
                            <br/>
                            <div className="display-4 text-center " style={{fontSize: '33px'}}>
                                Выберите вопрос и уровень сложности
                            </div>
                            <FormControlLabel
                            className="mt-3"
                            control={
                                <Switch
                            checked={QuestionPageStorage.useSearchByThemeOrAuthor}
                            onChange={(e) => {
                                QuestionPageStorage.changeUseSearchByThemeOrAuthor(e.target.checked);
                            }}
                            name="checkedB"
                            color="primary"
                                />
                        }
                            label="Искать по темам или авторам"
                            />
                            <div className="mt-1">
                            <Collapse in={QuestionPageStorage.useSearchByThemeOrAuthor}>
                                <FormControl variant="outlined" className="mt-1 col-12" size="small" >
                                    <InputLabel id="demo-simple-select-outlined-label">Автор</InputLabel>
                                    <Select
                                        value={QuestionPageStorage.selectedAuthorID}
                                        onChange={(e) =>{
                                            QuestionPageStorage.changeSelectedAuthorID(e.target.value)}}
                                        label="Автор"
                                    >
                                        {toJS(QuestionPageStorage.authorsForSelect).map((author) =>{
                                            return(<MenuItem key={author.id + "AuthorSelect"} value={author.id}>{author.name}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className="mt-2 col-12" size="small" >
                                    <InputLabel id="demo-simple-select-outlined-label">Тема</InputLabel>
                                    <Select
                                        value={QuestionPageStorage.selectedThemeID}
                                        onChange={(e) =>{
                                            QuestionPageStorage.changeSelectedTheme(e.target.value)}}
                                        label="Тема"
                                    >
                                        {toJS(QuestionPageStorage.themesForSelect).map((theme) =>{
                                            return(<MenuItem key={theme.id + "ThemesSelect"} value={theme.id}>{theme.name}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                            </Collapse>
                            </div>
                            <FormControl variant="outlined" className="mt-3 col-12">
                                <InputLabel>Вопрос</InputLabel>
                                <Select
                                    value={QuestionPageStorage.selectedQuestionID}
                                    onChange={(e) =>{
                                        QuestionPageStorage.changeSelectedQuestionID(e.target.value)}}
                                    label="Вопрос"

                                >
                                    {toJS(QuestionPageStorage.QuestionsAfterSelectTheme).map((question) =>{
                                        return(<MenuItem key={question?.id + "questionSelect"} value={question?.id}>{"ID: " + question?.id + " " + question?.text}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                                <Row className="mt-3">
                            <Col>
                                <Form.Control
                                    className="mt-1"
                                // size="lg"
                                as="select"
                                value={QuestionPageStorage.helpLevel}
                                onChange={e => QuestionPageStorage.changeHelpLevel(e.target.value)}>
                                <option value="0">Легкий</option>
                                    <option value="1">Средний</option>
                                <option value="2">Сложный</option>
                                </Form.Control>
                                </Col>
                                <Col className="offset-2">
                            <Button className="mt-1" variant="contained" color="primary"
                                    onClick={() => {QuestionPageStorage.startQuestion()}}>
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
    if (!QuestionPageStorage.dataHasBeenDelivered) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return (
        <div>
            <Button
                className="ml-lg-2 mt-4  col-12 col-lg-2 mr-2 mb-2"
                variant="outlined" color="primary"
                onClick={ () => {
                    QuestionPageStorage.closeQuestion()
                }}>
                Назад
            </Button>
            <ImageQuestion id={QuestionPageStorage.selectedQuestionID} helpLevel={QuestionPageStorage.helpLevel}/>
        </div>)

})