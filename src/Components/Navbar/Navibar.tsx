// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться, вообще, сейчас здесь странные роуты, в будущем, все изменится

import React from 'react'
import 'react-bootstrap';
import {Navbar, Form, Nav, Dropdown, Button, DropdownButton, Row, Spinner, Col} from 'react-bootstrap';
import s from'./navibar.module.css';
import NavSearch from "../OLD_NOT_USED/search"
import {gql, useQuery} from "@apollo/client";
import { Link } from 'react-router-dom';
import {Typography} from "antd";

const GET_USER_DATA = gql`
    query{
        me{
            id
            firstName
            username
        }
    }
`

// Как это устроено - в локальном хранилище лежит токен, он подставляется в каждый запрос автоматически,
// при логине мы получаем этот токен, при анлогине - удаляем, навбар просто пулит каждые 4 секунды значение с этим
// токеном, если в вернувшемся обьекте есть данные о пользователи - значит токен верен - значит мы вошли

export default function Navibar(){
    const {data: user_data} = useQuery(GET_USER_DATA, {
        // pollInterval: 10000,
        onCompleted: data => {
            // console.log(data)
        },
        onError: error => {
            // console.log(error)
        }
    })
    if (!user_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div >
            <Navbar bg="light" expand="lg" className="col-12 mr-1" >
                <Navbar.Brand>SW</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="col-5">
                        <Link className={s.link} to="/">Главная </Link>
                        <Link className={s.link} to="/cards">Катрочки</Link>
                        <Link className={s.link} to="/test">Тесты</Link>
                        <Typography className={s.link}> | </Typography>
                        <Link className={s.link} to="/testeditor">Редактировать тест</Link>
                    </Nav>

                    <Col className="col-2 offset-5">
                        <Row className="ml-3">
                            {user_data.me ? <Navbar.Text>{user_data.me.username}</Navbar.Text> :
                                <Col>
                                    <Link className={s.link} to="/login">Войти</Link>
                                </Col>
                            }

                            {user_data.me? <div className="col-3">
                                <DropdownButton id="dropdown-navibar-button"  title="" className="ml-4">
                                    <Dropdown.Item>
                                        <Link className={s.link} to="/stat">Статистика </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Link className={s.link} to="/profile">Профиль</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Link className={s.link} to="/unlogin">Выйти</Link>
                                    </Dropdown.Item>
                                </DropdownButton></div> : null}
                            {user_data.me?
                                null: <Col>
                                    <Link className={s.link} to="/registration">Зарегистрироваться</Link>
                            </Col>}
                        </Row>
                    </Col>
                    {/*<Button variant="outline-success" className=" ml-3 ">Поиск</Button>*/}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}
