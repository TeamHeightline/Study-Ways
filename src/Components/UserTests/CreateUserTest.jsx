import React from "react";
import {Button, Form, Jumbotron, Row} from "react-bootstrap";


export class CreateUserTest extends React.Component{

    constructor(props) {

        super(props);
        this.addQuestion = this.addQuestion.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
        this.state = {
            items: [],
            isLoaded: false
        }

    }

    componentDidMount() {
        fetch('http://localhost:3001/api/test/21')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    userTest: json[0],
                    isLoaded: true,
                })
            }).catch((err) => {
            console.log(err);
        });

    }
    addQuestion(){
        // console.log(this.state.userTest)
        let data = this.state.userTest
        // data = JSON.parse(data)
        const question = {
            questionName: '',
            questionCoasting: 0,
            averageMark: 0,
            questionTextV1: '',
            questionTextV2: '',
            questionTextV3: '',
            answers:[{
                isTrue: true,
                missingCoast: 0,
                answerAward: 0,
                answerText: '',
                helpTextLevelEasy: '',
                helpTextLevelMedium: '',
                helpTextLevelHard: ''
            }]

        }
        data.questions.push(question)
        this.setState({userTest: data})
    }
    addAnswer(questionId) {
        let data = this.state.userTest
        console.log(data)
        const answer = {
            isTrue: true,
            missingCoast: 0,
            answerAward: 0,
            answerText: '',
            helpTextLevelEasy: '',
            helpTextLevelMedium: '',
            helpTextLevelHard: ''
        }
        data.questions[questionId].answers.push(answer)
        this.setState({userTest: data})
    }


    render() {

        const { isLoaded } = this.state;

        if (!isLoaded)
            return <div>Loading...</div>;
        // console.log(userTest)
        return (
            <>
                <div className="display-4 text-center ">Создание теста</div>
                <Row className="justify-content-center">
                <div className="blockquote ml-5 mt-5 ">Название теста</div>
                    <Form className="ml-2 col-7 mt-5">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Введите название теста"
                                          value={this.state.userTest.testName}
                                          onChange={ e =>{
                                              let data = this.state.userTest
                                              data.testName = e.target.value
                                              // console.log(data)
                                              this.setState({userTest: data})
                                          }
                                          }/>
                        </Form.Group>
                    </Form>
                </Row>
                <div className="display-4 ml-4">Вопросы:</div>
                {/*Ниже код, который должен быть вынесен в отдельный компонент, в будующем эта часть должна быть полностью переписана*/}

                {/*<TestQuestions questionArray={userTest[0].questions}/>*/}

                {this.state.userTest.questions.map((question, questionIndex) =>
                    <div key={questionIndex} className="mr-4">
                        <h3 className="ml-4">Вопрос №{questionIndex}</h3>
                        <Form className="ml-4 mr-4">
                            <Form.Label>Первая формулировка вопроса</Form.Label>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Введите первую формулировку вопроса"
                                value={this.state.userTest.questions[questionIndex].questionTextV1}
                                onChange={e=>{
                                    let data = this.state.userTest
                                    let question = data.questions[questionIndex]
                                    question.questionTextV1 = e.target.value
                                    data.questions[questionIndex] = question
                                    console.log(this.state.userTest)
                                    this.setState({userTest: data})
                                }}/>
                            </Form.Group>
                            <Form.Label>Вторая формулировка вопроса</Form.Label>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Введите вторую формулировку вопроса"
                                              value={this.state.userTest.questions[questionIndex].questionTextV2}
                                              onChange={e=>{
                                                  let data = this.state.userTest
                                                  let question = data.questions[questionIndex]
                                                  question.questionTextV2 = e.target.value
                                                  data.questions[questionIndex] = question
                                                  console.log(this.state.userTest)
                                                  this.setState({userTest: data})
                                              }}/>
                            </Form.Group>
                            <Form.Label>Третья формулировка вопроса</Form.Label>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Введите третью формулировку вопроса"
                                              value={this.state.userTest.questions[questionIndex].questionTextV3}
                                              onChange={e=>{
                                                  let data = this.state.userTest
                                                  let question = data.questions[questionIndex]
                                                  question.questionTextV3 = e.target.value
                                                  data.questions[questionIndex] = question
                                                  console.log(this.state.userTest)
                                                  this.setState({userTest: data})
                                              }}/>
                            </Form.Group>
                        </Form>
                        {/*<QuestionAnswers answerArray={question.answers}/>*/}
                        {this.state.userTest.questions[questionIndex].answers.map((answer, answerIndex) =>
                            <div key={answerIndex}>
                                <Jumbotron className="col-11 justify-content-center ml-5">
                                    <h4 className="ml-4">Ответ №{answerIndex}</h4>
                                    <Form className="mr-5 ml-4">

                                        <Form.Label>Ответ верный/неверный</Form.Label>
                                        <Form.Control as="select" className="col-6 col-md-3"
                                                      onChange={e=>{
                                                          let data = this.state.userTest
                                                          let question = data.questions[questionIndex]
                                                          let answer = question.answers[answerIndex]
                                                          answer.isTrue = e.target.value
                                                          question.answers[answerIndex] = answer
                                                          data.questions[questionIndex] = question
                                                          console.log(this.state.userTest)
                                                          this.setState({userTest: data})
                                                      }}>
                                            <option value={true}>Верный</option>
                                            <option value={false}>Неверный</option>
                                        </Form.Control>

                                        <Form.Label className="mt-2">Грубость ошибки (чем число больше, тем более грубая ошибка, на ответ с наиболее грубой ошибкой будет дано пояснение)</Form.Label>
                                        <Form.Group>
                                            <Form.Control  type="number" placeholder="Ведите число, отражающее грубость ошибки" className="col-6 col-md-3"
                                                           value={this.state.userTest.questions[questionIndex].answers[answerIndex].missingCoast}
                                                           onChange={e=>{
                                                               let data = this.state.userTest
                                                               let question = data.questions[questionIndex]
                                                               let answer = question.answers[answerIndex]
                                                               answer.missingCoast = e.target.value
                                                               question.answers[answerIndex] = answer
                                                               data.questions[questionIndex] = question
                                                               console.log(this.state.userTest)
                                                               this.setState({userTest: data})
                                                           }}/>
                                        </Form.Group>

                                        <Form.Label>Формулировка ответа</Form.Label>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Control type="text" placeholder="Введите формулировку ответа"
                                                          value={this.state.userTest.questions[questionIndex].answers[answerIndex].answerText}
                                                          onChange={e=>{
                                                              let data = this.state.userTest
                                                              let question = data.questions[questionIndex]
                                                              let answer = question.answers[answerIndex]
                                                              answer.answerText = e.target.value
                                                              question.answers[answerIndex] = answer
                                                              data.questions[questionIndex] = question
                                                              console.log(this.state.userTest)
                                                              this.setState({userTest: data})
                                                          }}/>
                                        </Form.Group>

                                        <Form.Label>Подсказка для упрощенного уровня</Form.Label>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Control type="text" placeholder="Введите подсказку для упрощенного уровня"
                                                          value={this.state.userTest.questions[questionIndex].answers[answerIndex].helpTextLevelEasy}
                                                          onChange={e=>{
                                                              let data = this.state.userTest
                                                              let question = data.questions[questionIndex]
                                                              let answer = question.answers[answerIndex]
                                                              answer.helpTextLevelEasy = e.target.value
                                                              question.answers[answerIndex] = answer
                                                              data.questions[questionIndex] = question
                                                              console.log(this.state.userTest)
                                                              this.setState({userTest: data})
                                                          }}/>
                                        </Form.Group>

                                        <Form.Label>Подсказка для нормального уровня</Form.Label>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Control type="text" placeholder="Введите подсказку для нормального уровня"
                                                          value={this.state.userTest.questions[questionIndex].answers[answerIndex].helpTextLevelMedium}
                                                          onChange={e=>{
                                                              let data = this.state.userTest
                                                              let question = data.questions[questionIndex]
                                                              let answer = question.answers[answerIndex]
                                                              answer.helpTextLevelMedium = e.target.value
                                                              question.answers[answerIndex] = answer
                                                              data.questions[questionIndex] = question
                                                              console.log(this.state.userTest)
                                                              this.setState({userTest: data})
                                                          }}/>
                                        </Form.Group>

                                        <Form.Label>Подсказка для усложненного уровня</Form.Label>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Control type="text" placeholder="Введите подсказку для усложненного уровня"
                                                          value={this.state.userTest.questions[questionIndex].answers[answerIndex].helpTextLevelHard}
                                                          onChange={e=>{
                                                              let data = this.state.userTest
                                                              let question = data.questions[questionIndex]
                                                              let answer = question.answers[answerIndex]
                                                              answer.helpTextLevelHard = e.target.value
                                                              question.answers[answerIndex] = answer
                                                              data.questions[questionIndex] = question
                                                              console.log(this.state.userTest)
                                                              this.setState({userTest: data})
                                                          }}/>
                                        </Form.Group>
                                        <Button onClick={() =>this.addAnswer(questionIndex)} className="ml-5">Добавить ответ</Button>
                                    </Form>
                                </Jumbotron>
                            </div>)}
                    </div>
                )}
                <Button onClick={this.addQuestion} className="ml-5">Добавить вопрос</Button>
            </>
        );

    }

}