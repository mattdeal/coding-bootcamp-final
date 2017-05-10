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
                        <div className="btn btn-primary sign-in-required" id="btn-nav-create">Create Survey</div>
                        <div className="btn btn-primary sign-in-required" id="btn-nav-view">View Results</div>
                        <div className="btn btn-primary sign-in-required">New Log Out Button</div>
                    </div>
                </div>

                <div className="row" id="row-view-survey"  style={{display: 'none'}}>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <ol id="survey-list"></ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div id="survey-view"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" id="row-view-response"  style={{display: 'none'}}>
                    <div className="col-xs-12">
                        <ol id="response-list"></ol>
                    </div>
                </div>

                <div className="row" id="row-create-survey"  style={{display: 'none'}}>
                    <div className="col-xs-12">
                        <div className="row" id="row-questions">
                            <div className="col-xs-12">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <div className="form-group">
                                            <label htmlFor="input-survey-name" className="col-lg-2 control-label">Survey Name</label>
                                            <div className="col-lg-10">
                                                <input type="text" className="form-control" id="input-survey-name" placeholder="Survey Name" />
                                            </div>
                                        </div>
                                        <ol id="question-container"></ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row" id="row-create-question">
                            <div className="col-xs-3">
                                <div className="btn btn-primary btn-block" id="btn-question-short" data-question-type="short">Short Answer</div>
                            </div>
                            <div className="col-xs-3">
                                <div className="btn btn-info btn-block" id="btn-question-single" data-question-type="multi-radio">Multiple Choice - Single Answer</div>
                            </div>
                            <div className="col-xs-3">
                                <div className="btn btn-warning btn-block" id="btn-question-multi" data-question-type="multi-check">Multiple Choice - Multi Answer</div>
                            </div>
                            <div className="col-xs-3">
                                <div className="btn btn-success btn-block" id="btn-question-toggle" data-question-type="toggle">Yes/No Toggle</div>
                            </div>
                        </div>

                        <div className="row" id="row-save-survey">
                            <div className="col-xs-12">
                                <div className="btn btn-primary btn-block" id="btn-save-survey">Save Survey</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" id="row-create-response"  style={{display: 'none'}}>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <h2 id="display-survey-name"></h2>
                                        <ol id="response-question-list"></ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row" id="row-save-response">
                            <div className="col-xs-12">
                                <div className="btn btn-primary btn-block" id="btn-save-response">Save Response</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" id="row-thank-you" style={{display: 'none'}}>
                    <div className="col-xs-12">
                        <h2>Thank You!</h2>
                    </div>
                </div>
            </div>
        );
    }
});

// Export the component back for use in other files
module.exports = Main;
