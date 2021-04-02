import React from "react";
import {Card, Container, Row, Button} from "react-bootstrap"
import logo from "../../img/createUserTestImg.png"
import logo2 from "../../img/TestingImg.png"
import logo3 from "../../img/ModernTestEditor.png"
import { gql, useQuery } from '@apollo/client';

// const QUESTION_DATA = gql`
//       query {
//         questionById(id: 5){
//           text
//           videoUrl
//         }}
//     `

export class MainExperimental extends React.Component{
    render() {
        // const { loading, error, data } = useQuery(QUESTION_DATA);
        // //
        // // if (loading) console.log('.....loading....')
        // // if (error) console.log(`Error! ${error.message}`)
        // console.log(data)

        return(
            <>
                {/*<div style={{backgroundImage: `url(${backgroundImg})`,*/}
                {/*    // height: '100vh',*/}
                {/*    opacity: 0.1,*/}
                {/*    backgroundPosition: 'center',*/}
                {/*    backgroundSize: 'cover',*/}
                {/*    backgroundRepeat: 'no-repeat'}}>*/}
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
                                <Button variant="primary" href="/test" block size="lg" className="mt-5">Пройти вопрос</Button>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }} className="ml-2">
                            <Card.Img variant="top" src={logo3}  style={{height: '10rem'}}/>
                            <Card.Body>
                                <Card.Title>Редактор вопросов</Card.Title>
                                <Card.Text>
                                    После нажатия вы будете перенаправлены в  редактор вопросов
                                </Card.Text>
                                <Button variant="primary" href="/testeditor"   >Создать/Редактировать вопросы</Button>
                            </Card.Body>
                        </Card>
                    </Row>
                </Container>
                {/*</div>*/}
            </>
        )
    }

}