import React from 'react'
import 'react-bootstrap';
import {Navbar, Form, Nav, Dropdown, Button, DropdownButton, Row, Spinner} from 'react-bootstrap';
import s from'./navibar.module.css';
import NavSearch from "./search"
import {gql, useQuery} from "@apollo/client";
import { Link } from 'react-router-dom';

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
        pollInterval: 4000,
        onCompleted: data => {
            console.log(data)
        },
        onError: error => {
            console.log(error)
        }
    })
    if (!user_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
            <Navbar bg="light" expand="lg" className="col-12 mr-1" >
                <Navbar.Brand>IOT</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav >
                        <Nav.Link className="ml-3">
                            <Link className={s.link} to="/">Главная </Link>
                        </Nav.Link>
                        <Nav.Link className="ml-3">
                            <Link className={s.link} to="/testeditor">Редактировать тест</Link> </Nav.Link>
                        <Nav.Link className="ml-3">
                            <Link className={s.link} to="/test">Пройти тест</Link>
                        </Nav.Link>
                    </Nav>

                    <Form  className="col-lg-6">
                        <NavSearch/>
                    </Form>
                    <Button variant="outline-success" className=" ml-3 ">Поиск</Button>
                    <Row className="ml-3">
                    {user_data.me ? <Navbar.Text>{user_data.me.username}</Navbar.Text> :
                        <Nav.Link>
                            <Link className={s.link} to="/login">Войти</Link>
                        </Nav.Link>}

                    {user_data.me? <div>
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
                            null: <Nav.Link><Link className={s.link} to="/registration">Зарегистрироваться</Link></Nav.Link>}
                    </Row>
                </Navbar.Collapse>
            </Navbar>
    )
}
