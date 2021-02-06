import React from "react";
import { Steps, Radio  } from 'antd';
import {Col, ListGroup, Row, Button} from "react-bootstrap";

const { Step } = Steps;

class TestForUser extends React.Component{
    render() {
        return(
            <>
                <div className="display-4 text-center">Тесты</div>
                <Row className="justify-content-center mt-4">
                    <Col className="col-7 " >
                        <Steps size="small" current={2}>
                            <Step/>
                            <Step />
                            <Step/>
                            <Step/>
                            <Step/>
                        </Steps>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col className="col-7 " >
                        <div>Question Text</div>

                    <ListGroup className="mt-4">
                        <ListGroup.Item active={true}>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>sdfasldflsadf</ListGroup.Item>
                    </ListGroup>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col className="col-7">
                        <Button>Назад</Button>
                        <Button>Вперед</Button>
                    </Col>
                </Row>
            </>
        )
    }
}
export {TestForUser}