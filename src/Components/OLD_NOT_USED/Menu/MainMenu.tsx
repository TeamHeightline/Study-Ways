// Это типа главное меню, он заменяет собой главную страницу, тоже в будущем будет переработано
// Здесь всего две карточки, из важного, только то, что для перехода на новые вкладки
// мы используем history.push("/новый урл");

import React from "react";
import {Card, Container, Row, Button} from "react-bootstrap"
import { useHistory } from "react-router-dom";
import logo2 from "../../../img/TestingImg.png"
import logo3 from "../../../img/ModernTestEditor.png"

export function MainExperimental (){
        const history = useHistory();
        return(
            <>
                <div className="display-4 text-center ">Создание и редактирование вопросов</div>
                <Container className="mt-3">
                    <Row>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={logo2}  style={{height: '10rem'}}/>
                            <Card.Body>
                                <Card.Title>Пройти вопрос</Card.Title>
                                <Card.Text>
                                    После нажатия вы будете перенаправлены в среду для прохождения вопроса
                                </Card.Text>
                                <Button variant="primary" block size="lg" className="mt-5" onClick={() =>{
                                    history.push("/test");
                                }}>
                                    Пройти вопрос
                                </Button>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }} className="ml-2">
                            <Card.Img variant="top" src={logo3}  style={{height: '10rem'}}/>
                            <Card.Body>
                                <Card.Title>Редактор вопросов</Card.Title>
                                <Card.Text>
                                    После нажатия вы будете перенаправлены в  редактор вопросов
                                </Card.Text>
                                <Button variant="primary"
                                        // href="/testeditor"
                                        onClick={() =>{
                                            history.push("/testeditor");
                                        }}
                                >Создать/Редактировать вопросы</Button>
                            </Card.Body>
                        </Card>
                    </Row>
                </Container>
                {/*</div>*/}
            </>
        )
}