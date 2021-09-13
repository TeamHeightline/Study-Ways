/* eslint-disable no-unused-expressions */

// Неизвестно почему, но оно не работает, вернее, работает через раз
import * as React from 'react'
import 'react-bootstrap';
import { Form, Button, Row, Col} from "react-bootstrap";
import {useState} from "react";
import { observer } from "mobx-react"
import { useHistory } from "react-router-dom";
import {UserStorage} from '../../../Store/UserStore/UserStore';
import {Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

export  const Login = observer(() =>{
    const [mail, changeMail] = useState('')
    const [password, changePassword] = useState('')
    const history = useHistory();
    //Если при логине не было ошибок, пользователя отправляют на главную страницу
    if(UserStorage.isLogin){
        setTimeout(history.push, 400, "/")
    }
    return(
        <div>
            <Typography className="text-center mt-5" variant="h4">
                Введите email и пароль
            </Typography>
            <Row className="justify-content-center">
                {/*Теоретически, здесь должен быть вариант с социальными сетями, но увы и ах*/}
                {/*<div className="display-4 text-center mt-5" style={{fontSize: '33px'}}>Введите email и пароль</div>*/}
                <Col className="col-md-4 col-12 mt-3">
                    {/*Стандартная форма мэйла и пароля*/}
                        <Form>
                            <Form.Group>
                                <Form.Label><Typography>Введите ваш email</Typography></Form.Label>
                                <Form.Control type="email" placeholder="email" value={mail} onChange={(event) =>{changeMail(event.target.value)}}/>
                            </Form.Group>
                            <Form.Group>
                                {/*Пароль отображается скрытым*/}
                                <Form.Label><Typography>Введите пароль</Typography></Form.Label>
                                <Form.Control type="password" placeholder="Пароль" value={password} onChange={(event) =>{changePassword(event.target.value)}}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mr-auto" size="lg" block onClick={(event => {
                                event.preventDefault();
                                UserStorage.doLogin(mail, password) //Вызываем экшен в нашем сторе, оттуда вернется успешно ли прошел процесс логина и есть ли ошибки
                            })}>
                                Войти
                            </Button>
                            {UserStorage.doLoginSuccess && <Alert variant="outlined" severity="success" className="mt-2">Поздравляем, вы вошли</Alert>}
                            {!UserStorage.doLoginSuccess && UserStorage.doLoginReturnError  &&  <Alert severity='error' variant="outlined" className="mt-2">Ошибка в логине или пароле</Alert>}
                        {/*    проверка на вход проста и гениальна*/}
                            <Row className="mt-3 ml-4">
                                <Typography className="mt-1">
                                    Для регистрации  -
                                </Typography>
                                <Button className="ml-2 mr-1" variant="outline-danger"
                                        onClick={()=>{history.push('/registration')}}>
                                    Регистрация
                                </Button>
                            </Row>
                        </Form>
                </Col>
            </Row>
        </div>
    )
})
