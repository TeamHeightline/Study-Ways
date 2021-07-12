// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться, вообще, сейчас здесь странные роуты, в будущем, все изменится

import React from 'react'
import 'react-bootstrap';
import {Navbar, Form, Nav, Dropdown, DropdownButton, Row, Spinner, Col} from 'react-bootstrap';
import s from'./navibar.module.css';
import {gql, useQuery} from "@apollo/client";
import {Link, useHistory} from 'react-router-dom';
import {Typography} from "antd";
import useWindowDimensions from "../../CustomHooks/useWindowDimensions";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {UserStorage} from '../../Store/UserStore/UserStore'

import BlurLinearIcon from "@material-ui/icons/BlurLinear";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EditIcon from '@material-ui/icons/Edit';
import {observer} from "mobx-react";

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

export const Navibar = observer(() =>{
    const{height, width} = useWindowDimensions();
    const [value, setValue] = React.useState('0');//Здесь хронится значение на какой мы странице для
    // мобильных устройств
    const history = useHistory();

    const mobileMunuClickHandleChange = (event, newValue) => {
        if(newValue == 0){
            history.push('/courses')
        }
        if(newValue == 1){
            history.push('/cards')
        }
        if(newValue == 2){
            history.push('/test')
        }
        if(newValue == 3){
            history.push('/editor')
        }
        setValue(newValue);
    };
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
    if(height/width >= 1){
        return (
            <BottomNavigation value={value} onChange={mobileMunuClickHandleChange} className="col-12">
                <BottomNavigationAction label="Курсы" value="0" icon={<BlurLinearIcon />} />
                <BottomNavigationAction label="Карточки" value="1" icon={<ArtTrackIcon />} />
                <BottomNavigationAction label="Вопросы" value="2" icon={<DoneAllIcon />} />
                <BottomNavigationAction label="Редакторы" value="3" icon={<EditIcon />} />
            </BottomNavigation>
        )
    }
    return(
        <div >
            <Navbar bg="light" expand="lg" className="col-12 mr-1" >
                <Navbar.Brand>SW</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="col-5">
                        <Link className={s.link} to="/courses">Курсы </Link>
                        <Link className={s.link} to="/cards">Карточки</Link>
                        <Link className={s.link} to="/test">Вопросы</Link>
                        <Typography className={s.link}> | </Typography>
                        <Link className={s.link} to="/editor">Редакторы</Link>
                    </Nav>

                    <Col className="col-2 offset-5">
                        <Row className="ml-3">
                            {UserStorage.isLogin ? <Navbar.Text>{UserStorage.username}</Navbar.Text> :
                                <Col>
                                    <Link className={s.link} to="/login">Войти</Link>
                                </Col>
                            }

                            {UserStorage.isLogin? <div className="col-3">
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
                            {!UserStorage.isLogin &&
                                 <Col>
                                    <Link className={s.link} to="/registration">Зарегистрироваться</Link>
                                </Col>}
                        </Row>
                    </Col>
                    {/*<Button variant="outline-success" className=" ml-3 ">Поиск</Button>*/}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
})
