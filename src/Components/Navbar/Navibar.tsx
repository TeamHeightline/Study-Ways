import * as React from 'react'
import 'react-bootstrap';
import  {Navbar, Form, Nav, Dropdown, Button, DropdownButton, Row} from 'react-bootstrap';
// import IsLogin from '../login';
import s from'./navibar.module.css';
import NavSearch from "./search"
import {gql, useMutation} from "@apollo/client";
import {useEffect} from "react";

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
    // const [verify_login, { data, error }] = useMutation(VERIFY_LOGIN, {
    //     variables: {
    //         token: localStorage.getItem("token")
    //     }
    // })

    return(

            <Navbar bg="light" expand="lg" >
                <Navbar.Brand>IOT</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={s.navlink}>
                        <Nav.Link href="/" className="ml-3">Главная</Nav.Link>
                        <Nav.Link href="https://iot-experemental.herokuapp.com/admin/" className="ml-3">Редактировать тест</Nav.Link>
                        <Nav.Link href="/exp/testing" className="ml-3">Пройти тест</Nav.Link>
                    </Nav>

                    <Form  className="col-lg-6">
                        {/*<FormControl type="text" placeholder="Поиск карточки" className="ml-auto"  />*/}
                        <NavSearch/>
                    </Form>
                    <Button variant="outline-success" className=" ml-3 ">Поиск</Button>
                    {/*<IsLogin className="ml-auto"/>*/}
                    <Row className="ml-3">
                    {/*<Navbar.Text className="">User name</Navbar.Text>*/}
                    {localStorage.getItem("is_login") ==='true'? <Navbar.Text>{localStorage.getItem("user_name")}</Navbar.Text> : <Nav.Link href="/login">Войти</Nav.Link>}
                    {localStorage.getItem("is_login") ==='true'? <div>
                            <DropdownButton id="dropdown-navibar-button"  title="" className="ml-4">
                            <Dropdown.Item href="/stat">Статистика</Dropdown.Item>
                            <Dropdown.Item href="/profile">Профиль</Dropdown.Item>

                            <Dropdown.Item href="/unlogin">Выйти</Dropdown.Item>
                        </DropdownButton></div> : null}
                        {localStorage.getItem("is_login") ==='true'? null: <Nav.Link href="/registration">Зарегистрироваться</Nav.Link>}


                    </Row>
                </Navbar.Collapse>
            </Navbar>
    )
}
