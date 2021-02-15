import React from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

export class ShowErrorsOnScreen extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.errorArray.length === 0 && !this.props.oneTimeErrorCheck)
            return <div></div>
        if(this.props.errorArray.length === 0 && this.props.oneTimeErrorCheck)
            return <div className="display-3 text-center">Поздравляем, вы прошли тест!</div>
        return(
            <>
            {/*<div>{this.props.answers[this.props.errorArray[0]].helpTextLevelEasy}</div>*/}
                <ReactPlayer width="auto" height={700} controls
                             url={this.props.answers[this.props.errorArray[0]].helpTextLevelEasy}
                />

            </>
        )
    }
}
ShowErrorsOnScreen.propTypes = {
    errorArray: PropTypes.array,
    answers: PropTypes.array,
    oneTimeErrorCheck: PropTypes.bool
};