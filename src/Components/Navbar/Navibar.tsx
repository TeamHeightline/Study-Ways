import * as React from 'react'
import 'react-bootstrap';
import  {Navbar, Form, Nav, Dropdown, Button, DropdownButton, Row} from 'react-bootstrap';
// import IsLogin from '../login';
import s from'./navibar.module.css';
import NavSearch from "./search"
import {gql, useMutation} from "@apollo/client";
import {useEffect} from "react";
import { Link } from 'react-router-dom';

const VERIFY_LOGIN = gql`
    mutation VERIFY_LOGIN($token: String!){
      verifyToken(token: $token){
        payload
        success
        errors
      }
    }
`



export default function Navibar(){

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
                        {/*<FormControl type="text" placeholder="Поиск карточки" className="ml-auto"  />*/}
                        <NavSearch/>
                    </Form>
                    <Button variant="outline-success" className=" ml-3 ">Поиск</Button>
                    {/*<IsLogin className="ml-auto"/>*/}
                    <Row className="ml-3">
                    {/*<Navbar.Text className="">User name</Navbar.Text>*/}
                    {localStorage.getItem("is_login") ==='true'? <Navbar.Text>{localStorage.getItem("user_name")}</Navbar.Text> :
                        <Nav.Link>
                            <Link className={s.link} to="/login">Войти</Link>
                        </Nav.Link>}

                    {localStorage.getItem("is_login") ==='true'? <div>
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
                        {localStorage.getItem("is_login") ==='true'?
                            null: <Nav.Link className={s.link} href="/registration">Зарегистрироваться</Nav.Link>}
                    </Row>
                </Navbar.Collapse>
            </Navbar>
    )
}
