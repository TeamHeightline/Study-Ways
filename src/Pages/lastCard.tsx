import ReactPlayer from "react-player";
import * as React from 'react'
import {  Typography, Breadcrumb, Rate  } from 'antd';
import {LeftOutlined, RightOutlined, DownOutlined, UpOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import {Alert, Pagination, Row, Col, Container} from "react-bootstrap";
const { Title } = Typography;


export const lastCard = () => (
    <>
        <Row className="ml-2 mt-4 " >
            <Col className="col-8">
                <Row>
                    <div className="display-4 text-left mr-sm-2">О ПРОЕКТЕ ЧКМИФ НАВИГАТОР</div>
                    <Title level={4} className="ml-2">3.1.1.1.1.2.1</Title>
                </Row>
                <Breadcrumb>
                    <Breadcrumb.Item>Физика</Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">_Общие вопросы</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">__Общие вопросы</a></Breadcrumb.Item>
                    <Breadcrumb.Item>__Общие вопросы</Breadcrumb.Item>
                    <Breadcrumb.Item>Выпускникам школ</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            <Col   className="mt-3 col-10 col-md-3">
                <Pagination size="lg">
                    <Pagination.Item><LeftOutlined/></Pagination.Item>
                    <Pagination.Item className="secondary"><UpOutlined/></Pagination.Item>
                    <Pagination.Item className="secondary"><DownOutlined/></Pagination.Item>
                    <Pagination.Item><RightOutlined/></Pagination.Item>
                </Pagination>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col className="col-10 col-lg-5 ml-2 mt-4">
                <ReactPlayer width="auto"  controls
                    url="https://www.youtube.com/watch?v=7sDY4m8KNLc"
                />
            </Col>
            <Col className="col-12 col-lg-6">
                <Alert className="blockquote" variant="light" >
                     Дается краткая характеристика проекта Массового Индивидуализированного Физического образования
                    (МИФО) и сопровождающей оболочки свободного доступа к качественным образовательным
                    Интернет-ресурсам, включая авторский курс Чируова А.С. Интерактивного Многоуровневого обучения
                    физике (ЧК_МИФ).
                    /Пленарный доклад на удаленной сессии XXVI Международной научно-методическая конференции
                    "Современное образование: содержание, технологии, качество" 2020_09_29. Длительность 0:29:10 / /
                </Alert>

                <Alert className="blockquote">На сколько эта карточка была полезна?</Alert>
                <Rate allowHalf defaultValue={4} className="ml-3" />
         </Col>
        </Row>
    </>
)
