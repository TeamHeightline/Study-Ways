/* eslint-disable no-unused-expressions */

// Неизвестно почему, но оно не работает, вернее, работает через раз
import * as React from 'react'
import 'react-bootstrap';
import {Container, Form, Button, Alert, Row} from "react-bootstrap";
import {useState} from "react";
import { observer } from "mobx-react"
import { useHistory } from "react-router-dom";
import {UserStorage} from '../../Store/UserStore/UserStore';
import {Typography} from "@material-ui/core";

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
            <Container>
                {/*Теоретически, здесь должен быть вариант с социальными сетями, но увы и ах*/}
                <div className="display-4 text-center mt-5" style={{fontSize: '33px'}}>Введите email и пароль</div>
                <div className="col-4 offset-4 mt-3">
                    {/*Стандартная форма мэйла и пароля*/}
                        <Form>
                            <Form.Group>
                                <Form.Label>Введите ваш email</Form.Label>
                                <Form.Control type="email" placeholder="email" value={mail} onChange={(event) =>{changeMail(event.target.value)}}/>
                            </Form.Group>
                            <Form.Group>
                                {/*Пароль отображается скрытым*/}
                                <Form.Label>Введите пароль</Form.Label>
                                <Form.Control type="password" placeholder="Пароль" value={password} onChange={(event) =>{changePassword(event.target.value)}}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mr-auto" size="lg" block onClick={(event => {
                                event.preventDefault();
                                UserStorage.doLogin(mail, password) //Вызываем экшен в нашем сторе, оттуда вернется успешно ли прошел процесс логина и есть ли ошибки
                            })}>
                                Войти
                            </Button>
                            {UserStorage.doLoginSuccess && <Alert variant="success" className="mt-2">Поздравляем, вы вошли</Alert>}
                            {!UserStorage.doLoginSuccess && UserStorage.doLoginReturnError  &&  <Alert variant='danger' className="mt-2">Ошибка в логине или пароле</Alert>}
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
                </div>
            </Container>
        </div>
    )
})
