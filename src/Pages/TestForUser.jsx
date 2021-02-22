import React from "react";
// import {Steps} from "antd";
import {Container, Spinner, Button, Form, Row, Accordion, Card} from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
import { ThemeProvider, createMuiTheme, makeStyles, } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import {ShowErrorsOnScreen} from "../Components/UserTests/ShowErrorsOnScreen";
import ReactPlayer from "react-player";


const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: blue,
    },
});

// const { Step } = Steps;
export class TestForUser extends React.Component{
    constructor(props) {
        super(props);
        this.goToNextQuestion = this.goToNextQuestion.bind(this);
        this.goToPreviousQuestion = this.goToPreviousQuestion.bind(this);
        this.getRows = this.getRows.bind(this);
        this.selectDeselectRow = this.selectDeselectRow.bind(this);
        this.checkUserErrors = this.checkUserErrors.bind(this);
        this.state = {
            items: [],
            isLoaded: false,
            columns : [
                { field: 'answerText', headerName: 'Ответы на вопрос', width: 2500 },
            ],
            rows: [
                {id: 1,answerText: ''},
            ],
            activeQuestion: 0,
            selectedRows: [],
            errorArray: [],
            oneTimeErrorCheck: false,
            HelpLevel: '0',
            showHelpVideo: false,
        }
    }
    componentDidMount() {
        fetch('https://iot-show-version.herokuapp.com/api/test/randq/25')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    userTest: json[0],
                    isLoaded: true,
                })
            })
            .then(this.getRows)
            .catch((err) => {
            console.log(err);
        });
    }
    async goToNextQuestion(){
        if (this.state.activeQuestion < this.state.userTest.questions.length - 1){
            await this.setState({activeQuestion: this.state.activeQuestion + 1})
        }

        this.getRows()
    }
    async goToPreviousQuestion(){
        if (this.state.activeQuestion > 0){
            await this.setState({activeQuestion: this.state.activeQuestion - 1})
        }
        this.getRows()
    }
    getRows(){
        let rows = []
        this.state.userTest.questions[this.state.activeQuestion].answers.forEach( (answers, answersIndex) =>{
            rows.push({id: answersIndex, answerText: answers.answerText})
        })
        this.setState({rows: rows})
    }

    async checkUserErrors(){
        let userErrors= []
        let minErrorQuery = 10000
        this.state.userTest.questions[this.state.activeQuestion].answers.forEach( (answer, answersIndex) =>{
            if(answer.isTrue === (this.state.selectedRows.indexOf(answersIndex) === -1)){
                // console.log(answersIndex)
                // missing coast становится очередью проверки, чем меньше число, тем раньше будет произведена проверка
                if (answer.missingCoast < minErrorQuery){
                    userErrors=[]
                    userErrors.push(answersIndex)
                    minErrorQuery = answer.missingCoast
                }
            }
        })
        this.setState({oneTimeErrorCheck: true})
        console.log(userErrors)
        this.setState({errorArray: userErrors})
    }

    async selectDeselectRow(RowSelectedParams){
        // console.log(RowSelectedParams)
        if(RowSelectedParams.isSelected && this.state.selectedRows.indexOf(RowSelectedParams.data.id) === -1){
            let newRows = this.state.selectedRows
            newRows.push(RowSelectedParams.data.id)
            await this.setState({selectedRows: newRows})
            // console.log(this.state.selectedRows)
        }
        if (!RowSelectedParams.isSelected){
            let newRows = this.state.selectedRows
            newRows.splice(this.state.selectedRows.indexOf(RowSelectedParams.data.id), 1)
            await this.setState({selectedRows: newRows})
            // console.log(this.state.selectedRows)
        }
    }

    render() {
        const { isLoaded } = this.state;
        if (!isLoaded)
            return <div className="display-1 text-center">Loading...
                <Spinner animation="grow" variant="primary" />
            </div>
        return(
            <Container>
                {/*<Steps size="small" current={this.state.activeQuestion} className="mt-5">*/}
                {/*    {this.state.userTest.questions.map((question, questionIndex) =>*/}
                {/*        <Step title="" key={questionIndex}/>*/}
                {/*    )}*/}
                {/*</Steps>*/}

                <div className="display-4" style={{fontSize: '35px'}}>{this.state.userTest.questions[this.state.activeQuestion].questionTextV1}</div>
                <Accordion  className="mt-4">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                Отобразить видео вопрос
                                {console.log(this.state.userTest.questions[this.state.activeQuestion].questionVideoUrl)}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <ReactPlayer url={this.state.userTest.questions[this.state.activeQuestion].questionVideoUrl} controls />
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <ShowErrorsOnScreen errorArray={this.state.errorArray} answers={this.state.userTest.questions[this.state.activeQuestion].answers}
                                    oneTimeErrorCheck={this.state.oneTimeErrorCheck} HelpLevel={this.state.HelpLevel}
                                    showHelpVideo={this.state.showHelpVideo} className="mt-2"/>
                <div>
                    <ThemeProvider theme={theme}>
                        {this.state.getRows}
                    <DataGrid rows={this.state.rows} columns={this.state.columns}  checkboxSelection autoHeight={true}
                               disableColumnMenu={true} hideFooter={true} disableExtendRowFullWidth={false}
                              showCellRightBorder={true} showToolbar={false} pageSize={10}
                              onRowSelected={(RowSelectedParams) =>{this.selectDeselectRow(RowSelectedParams)}}
                              disableColumnSelector={true} rowHeight={60}
                   />
                    </ThemeProvider>
                </div>
                {/*<Button onClick={this.goToPreviousQuestion}>Назад</Button>*/}
                {/*<Button onClick={this.goToNextQuestion}>Вперед</Button>*/}
                <Row className="mt-2 ml-1">
                <Button onClick={this.checkUserErrors} variant="outline-info">Проверить ответы</Button>
                <Form className="mr-3 ml-3">
                    {/*<Form.Label>Выбирите уровень пояснений к ответам</Form.Label>*/}
                    <Form.Control as="select"
                                  value={this.state.HelpLevel}
                                  onChange={e=>{
                                      this.setState({HelpLevel: e.target.value})
                                      console.log(e.target.value)
                                  }}>
                        <option value={0}>Легкий</option>
                        <option value={1}>Средний</option>
                        <option value={2}>Сложный</option>
                    </Form.Control>
                </Form>
                    <div className="display-4 mt-1" style={{fontSize: '20px'}}>Отображать видео подсказку:</div>
                    <Form.Check type="checkbox" id="autoSizingCheck" inline onChange={e =>
                    {this.setState({showHelpVideo: e.target.checked})}}/>
                </Row>
                {/*<div>{this.state.userTest.questions[this.state.activeQuestion].answers[this.state.errorArray[0]].helpTextLevelEasy}</div>*/}
                <br/>
                <br/>
                <br/>
                <br/>
            </Container>
        )
    }

}