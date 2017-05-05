var React = require("react");
var helpers = require("./utils/helpers");

var Main = React.createClass({
    // Here we render the function
    render: function () {
        return (
            <div className="container">
                <div className="row">
                    <div className="jumbotron">
                        <h2 className="text-center">This is a test</h2>
                        <p className="text-center">
                            <em>There should be some google stuff below here and in the console</em>
                        </p>
                    </div>
                </div>

                <div className="row" id="row-nav">
                    <div className="col-xs-12">
                        {/*<div className="g-signin2" data-onsuccess="onSignIn"></div>*/}
                        <div className="g-signin2" data-onsuccess="onGoogleSignIn"></div>
                        <a href="#" onClick={onGoogleSignOut}>Sign Out</a>
                        {/*todo: insert other nav items here*/}
                        <div className="btn btn-primary sign-in-required">Button 1</div>
                        <div className="btn btn-primary sign-in-required">Button 2</div>
                        <div className="btn btn-primary sign-in-required">Button 3</div>
                    </div>
                </div>

                <div className="row" id="row-view-survey"></div>

                <div className="row" id="row-create-survey">
                    <div className="col-xs-12">
                        <div className="row" id="row-questions">
                            <div className="col-xs-12" id="question-container">
                                
                            </div>
                        </div>

                        <div className="row" id="row-create-question">
                            <div className="col-xs-3">
                                <div className="btn btn-primary btn-block" id="btn-question-short" data-question-type="short">Short Answer</div>
                            </div>
                            <div className="col-xs-3">
                                <div className="btn btn-info btn-block" id="btn-question-multi" data-question-type="multi">Multiple Choice</div>
                            </div>
                            <div className="col-xs-3">
                                <div className="btn btn-warning btn-block" id="btn-question-checkbox" data-question-type="check">Checkboxes</div>
                            </div>
                            <div className="col-xs-3">
                                <div className="btn btn-success btn-block" id="btn-question-other" data-question-type="other">Other</div>
                            </div>
                        </div>

                        <div className="row" id="row-save-survey">
                            <div className="col-xs-12">
                                <div className="btn btn-primary btn-block" id="btn-save-survey">Save Survey</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" id="row-submit-survey"></div>
            </div>
        );
    }
});

// Export the component back for use in other files
module.exports = Main;
