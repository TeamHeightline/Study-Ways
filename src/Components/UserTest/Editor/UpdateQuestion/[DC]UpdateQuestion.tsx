import React from 'react'
import {Col, Row, Spinner} from "react-bootstrap";
import {Button, Container, Snackbar, TextField, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import {MenuProps} from "./Struct";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import {Alert} from "@material-ui/lab";
import AnswerNode from "../AnswerNode";

export default function DCUpdateQuestion({...props}: any){
    if (!props.data) {
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    return (
        <div className="col-12">
            <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                    size="large"
                //         onClick={() => {
                //         create_course().then(() => refetch())
                // }}
            >
                Создать новый вопрос
            </Button>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать вопрос</div>
            <div className="col-8 offset-2 mt-3 ">
                {props.memedAutocomplite}
            </div>
            {props.questionId &&
            <Row className="mt-3">
                <Col className="col-md-6 col-11  ml-5">
                    <div>
                        <TextField
                            id="standard-multiline-flexible"
                            label="Текст вопроса"
                            multiline
                            fullWidth
                            rowsMax={4}
                            // style={{width: "50vw"}}
                            value={props.questionText}
                            onChange={(e) => {
                                props.changeQuestionText(e.target.value)
                            }}
                        />
                        <FormControl className="col-12">
                            <TextField
                                id="standard-basic"
                                label="Ссылка на видео-вопрос"
                                value={props.questionUrl}
                                onChange={(e) => {
                                    props.changeQuestionUrl(e.target.value)
                                }}/>
                        </FormControl>
                    </div>
                </Col>
                <Col className="col-md-4  col-10 offset-md-1">
                    <div>
                        {/*{console.log(data)}*/}
                        <FormControl className="col-12 ml-5">
                            <InputLabel id="question-theme-multiple">Темы вопросов</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                multiple
                                value={props.ThemesId}
                                onChange={(e: any) => {
                                    props.changeThemesId(e.target.value)
                                }}
                                input={<Input/>}
                                MenuProps={MenuProps}
                            >
                                {props.selectedQuestion ? props.data.questionThemes.map((theme: any) => (
                                    <MenuItem key={theme.name + theme.id} value={theme.id}>
                                        {theme.name}
                                    </MenuItem>
                                )) : null}
                            </Select>
                        </FormControl>
                        <FormControl className='col-12 ml-5'>
                            <InputLabel id="question-author-multiple">Авторы вопросов</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                multiple
                                value={props.authorId}
                                onChange={(e: any) => {
                                    props.changeAuthorId(e.target.value)
                                }}
                                input={<Input/>}
                                MenuProps={MenuProps}
                            >
                                {props.selectedQuestion ? props.data.me.questionauthorSet.map((author: any) => (
                                    <MenuItem key={author.name + author.id} value={author.id}>
                                        {author.name}
                                    </MenuItem>
                                )) : null}

                            </Select>
                        </FormControl>
                    </div>
                </Col>
            </Row>}
            {props.questionId? <Col className="col-md-6 col-11  ml-5 mt-2">
                <div>
                    {/*<Alert severity="warning">*/}
                    Разрешить добавлять изображения к ответам
                    <Switch
                        checked={props.isImageQuestion}
                        onChange={(e) => {
                            console.log(e.target.checked)
                            props.setIsImageQuestion(e.target.checked)
                        }}
                        name="checkedB"
                        color="secondary"
                    />
                    {/*</Alert>*/}
                </div>
            </Col>: null}

            <Row className="mt-2">
                {props.questionId &&
                <Col className="col-1  ml-5">
                    <Button variant="contained" color="primary" onClick={() =>{props.update_question()}}>
                        Сохранить
                    </Button>
                </Col>}

                <Col className="col-2 ml-5">
                    {props.selectedQuestion? <div>
                            <Button
                                color="primary"
                                variant="outlined"
                                component="label"
                            >
                                <input type="file"  hidden name="file" onChange={props.changeHandlerForQuestionImage} />
                                Изображение для вопроса
                            </Button>
                            {props.isSelectedQuestionImage ? (
                                <div>
                                    {props.selectedQuestionImage?.name}
                                </div>
                            ) :null}
                            {props.questionImageName && !props.isSelectedQuestionImage? <div>{props.questionImageName}</div>: null}
                        </div>
                        :null}
                </Col>
                {props.update_question_loading? <Col className="col-1">
                    <Spinner animation="border" variant="success"/>
                </Col> : null }
                {props.update_question_data? props.update_question_data.updateQuestion.errors.length !== 0?
                    <Alert severity="error">Ошибка в одном или нескольких полях</Alert>: null : null}
                {props.questionId? <Col className="text-center mt-2 col-6">
                    <Typography variant="body2" color="textSecondary" component="p">
                        Ссылка на прохождение вопроса - {props.isImageQuestion?
                        <strong>https://www.sw-university.com/iq/{props.questionId}</strong>:
                        <strong>https://www.sw-university.com/q/{props.questionId}</strong>}
                    </Typography>
                </Col>: null}
            </Row>
            {props.questionId &&
            <div className="display-4 text-center mt-3 col-12" style={{fontSize: '33px'}}>Редактировать ответы</div>}
            {/* Нужно кэшировать!!!*/}
            {props.questionIndex !== undefined? console.log(props.data.me.questionSet[props.questionIndex].answers): null}
            {props.questionIndex !== undefined? props.data?.me?.questionSet[props.questionIndex]?.answers.map((answer: any, answerIndex: number) =>{
                    console.log(props.questionIndex)
                    return(<AnswerNode className="mt-4" key={answer.id} answer={answer} answerIndex={answerIndex} questionID={props.questionId} isImageQuestion={props.isImageQuestion}/>)
                }
            ): null}
            {props.selectedQuestion?
                <Container>
                    <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                            size="large"  onClick={() => props.create_answer()}>
                        Создать новый ответ
                    </Button>
                </Container>
                : null }
            {props.create_answer_loading? <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>: null}
            <Snackbar open={props.openQuestionUpdateNotification} autoHideDuration={6000} onClose={props.updateQuestionNotificationHandleClose}>
                <Alert onClose={props.updateQuestionNotificationHandleClose} severity="success">
                    Содержание вопроса обновлено
                </Alert>
            </Snackbar>
            {/*{console.log(create_answer_data)}*/}
            <br/>
            <br/>
        </div>
    )
}