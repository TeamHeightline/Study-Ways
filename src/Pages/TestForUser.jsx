import React from "react";
import {Steps} from "antd";
import {Container, Spinner, Button} from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
import { ThemeProvider, createMuiTheme, makeStyles, } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import {ShowErrorsOnScreen} from "../Components/UserTests/ShowErrorsOnScreen";


const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: blue,
    },
});

const { Step } = Steps;
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
                { field: 'answerText', headerName: 'Ответы на вопрос', width: 900 },
            ],
            rows: [
                {id: 1,answerText: ''},
            ],
            activeQuestion: 0,
            selectedRows: [],
            errorArray: [],
            oneTimeErrorCheck: false,
        }
    }
    componentDidMount() {
        fetch('https://iot-show-version.herokuapp.com/api/test/22')
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
        this.state.userTest.questions[this.state.activeQuestion].answers.forEach( (answers, answersIndex) =>{
            if(answers.isTrue === (this.state.selectedRows.indexOf(answersIndex) === -1)){
                // console.log(answersIndex)
                userErrors.push(answersIndex)
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
                <div className="display-4">{this.state.userTest.questions[this.state.activeQuestion].questionTextV1}</div>
                <div className="mt-5">
                    <ThemeProvider theme={theme}>
                        {this.state.getRows}
                    <DataGrid rows={this.state.rows} columns={this.state.columns}  checkboxSelection autoHeight={true}
                               disableColumnMenu={true} hideFooter={true} disableExtendRowFullWidth={false}
                              showCellRightBorder={true} showToolbar={false} pageSize={10}
                              onRowSelected={(RowSelectedParams) =>{this.selectDeselectRow(RowSelectedParams)}}
                              disableColumnSelector={true}
                   />
                    </ThemeProvider>
                </div>
                {/*<Button onClick={this.goToPreviousQuestion}>Назад</Button>*/}
                {/*<Button onClick={this.goToNextQuestion}>Вперед</Button>*/}
                <Button onClick={this.checkUserErrors} variant="outline-warning">Проверить ответы</Button>

                {/*<div>{this.state.userTest.questions[this.state.activeQuestion].answers[this.state.errorArray[0]].helpTextLevelEasy}</div>*/}
                <ShowErrorsOnScreen errorArray={this.state.errorArray} answers={this.state.userTest.questions[this.state.activeQuestion].answers}
                                    oneTimeErrorCheck={this.state.oneTimeErrorCheck}/>
            </Container>
        )
    }

}