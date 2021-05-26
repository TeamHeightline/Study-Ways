/* eslint-disable no-unused-expressions */

import * as React from 'react'
import 'react-bootstrap';
import {Card, Container, Form, Button, Alert} from "react-bootstrap";
import {useState} from "react";
import {gql, useQuery, useMutation} from "@apollo/client";

import { useHistory } from "react-router-dom";

const LOGIN_MUTATION = gql`
    mutation AUTHORIZATION($pass: String!, $mail: String!){
      tokenAuth(password: $pass, email: $mail){
        token
        refreshToken
        success
        errors
        user{
          id
          username
          isStaff
          userAccessLevel
        }
      }
    }`

export default function Login(){
    const [mail, changeMail] = useState('')
    const [password, changePassword] = useState('')
    const history = useHistory();
    const [login, { data, error }] = useMutation(LOGIN_MUTATION, {
        variables: {
            pass: password,
            mail: mail
        }
    })

    // if(data){
    //     console.log(data)
    // }
    const saveLoginData = () => {

        localStorage.setItem('token', data.tokenAuth.token)
        localStorage.setItem('refreshToken', data.tokenAuth.refreshToken)
        localStorage.setItem('is_login', 'true')
    }
    {data ?  data.tokenAuth.success ? saveLoginData() : null : null}
    {localStorage.getItem('is_login') === 'true' ? setTimeout(history.push, 1000, '/'): null}
    return(
        <div>
            <Container>
                <div className="display-4 text-center mt-5" style={{fontSize: '33px'}}>Введите email и пароль</div>
                <div className="col-4 offset-4 mt-3">
                    {/*<Card>*/}
                        <Form>
                            <Form.Group>
                                <Form.Label>Введите ваш email</Form.Label>
                                <Form.Control type="email" placeholder="email" value={mail} onChange={(event) =>{changeMail(event.target.value)}}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Введите пароль</Form.Label>
                                <Form.Control type="password" placeholder="Пароль" value={password} onChange={(event) =>{changePassword(event.target.value)}}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mr-auto" size="lg" block onClick={(event => {event.preventDefault(); login()})}>
                                Войти
                            </Button>
                            {data ? data.tokenAuth.success ? <Alert variant="success" className="mt-2">Поздравляем, вы вошли</Alert> : <Alert variant='danger' className="mt-2">Ошибка в логине или пароле</Alert> : null}
                            {/*{data ? data.tokenAuth.success === false ? <div>Ошибка в логине или пароле</div>: null: null}*/}
                        </Form>
                    {/*</Card>*/}
                </div>
            </Container>
        </div>
    )
}
