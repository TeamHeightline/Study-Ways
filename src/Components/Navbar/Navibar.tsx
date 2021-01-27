import * as React from 'react'
import 'react-bootstrap';
import  {Navbar, Form, Nav, FormControl, Dropdown, Button, DropdownButton, Row} from 'react-bootstrap';
// import IsLogin from '../login';
import s from'./navibar.module.css';


export default function Navibar(){
    return(
            <Navbar bg="light" expand="lg" >
                <Navbar.Brand>IOT</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={s.navlink}>

                        <Nav.Link href="/" className="ml-3">Главная</Nav.Link>
                        <Nav.Link href="/search" className="ml-3">Расширенный поиск</Nav.Link>
                        <Nav.Link href="/pc" className="ml-3">Личный кабинет</Nav.Link>
                    </Nav>

                    <Form  className="col-lg-6">
                        <FormControl type="text" placeholder="Поиск карточки" className="ml-auto"  />
                    </Form>
                    <Button variant="outline-success" className="ml-1 mr-2 ml-3 ">Поиск</Button>
                    {/*<IsLogin className="ml-auto"/>*/}
                    <Row className="ml-3">
                    <Navbar.Text className="">User name</Navbar.Text>

                    <DropdownButton id="dropdown-navibar-button"  title="" className="ml-4">
                        <Dropdown.Item href="/stat">Статистика</Dropdown.Item>
                        <Dropdown.Item href="/profile">Профиль</Dropdown.Item>
                        <Dropdown.Item href="/courses">Выйти</Dropdown.Item>
                    </DropdownButton>
                    </Row>
                </Navbar.Collapse>
            </Navbar>
    )
}
