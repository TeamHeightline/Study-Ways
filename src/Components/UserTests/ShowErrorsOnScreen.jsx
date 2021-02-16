import React from "react";
import PropTypes, {bool} from "prop-types";
import ReactPlayer from "react-player";
import {Alert} from "react-bootstrap";

export class ShowErrorsOnScreen extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.errorArray.length === 0 && !this.props.oneTimeErrorCheck)
            return <div></div>
        if(this.props.errorArray.length === 0 && this.props.oneTimeErrorCheck)
            return <div className="display-3 text-center">Поздравляем, вы прошли тест!</div>
        if ((this.props.HelpLevel === '0') && this.props.showHelpVideo)
        return(
            <>
            <Alert variant="info" style={{fontSize: '20px'}} className="display-4">{this.props.answers[this.props.errorArray[0]].helpTextLevelEasy}</Alert>
                <ReactPlayer url={this.props.answers[this.props.errorArray[0]].answerVideoUrl}/>
            </>
        )
        if ((this.props.HelpLevel === '0'))
            return(
                <>
                    <Alert variant="info" style={{fontSize: '20px'}} className="display-4">{this.props.answers[this.props.errorArray[0]].helpTextLevelEasy}</Alert>
                </>
            )

        if (this.props.HelpLevel === '1' && this.props.showHelpVideo)
            return(
                <>
                    <Alert variant="info" style={{fontSize: '20px'}} className="display-4">{this.props.answers[this.props.errorArray[0]].helpTextLevelMedium}</Alert>
                    <ReactPlayer url={this.props.answers[this.props.errorArray[0]].answerVideoUrl}/>
                </>
            )
        if (this.props.HelpLevel === '1')
            return(
                <>
                    <Alert variant="info" style={{fontSize: '20px'}} className="display-4">{this.props.answers[this.props.errorArray[0]].helpTextLevelMedium}</Alert>
                </>
            )

        if (this.props.HelpLevel === '2' && this.props.showHelpVideo)
            return(
                <>
                    <Alert variant="info" style={{fontSize: '20px'}} className="display-4">{this.props.answers[this.props.errorArray[0]].helpTextLevelHard}</Alert>
                    <ReactPlayer url={this.props.answers[this.props.errorArray[0]].answerVideoUrl}/>
                </>
            )
        if (this.props.HelpLevel === '2')
            return(
                <>
                    <Alert variant="info" style={{fontSize: '20px'}} className="display-4">{this.props.answers[this.props.errorArray[0]].helpTextLevelHard}</Alert>
                </>
            )
    }
}
ShowErrorsOnScreen.propTypes = {
    errorArray: PropTypes.array,
    answers: PropTypes.array,
    oneTimeErrorCheck: PropTypes.bool,
    HelpLevel: PropTypes.string,
    showHelpVideo: bool,
};