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
                    {/*<div className="g-signin2" data-onsuccess="onSignIn"></div>*/}
                    <div className="g-signin2" data-onsuccess="onGoogleSignIn"></div>
                    <a href="#" onClick={onGoogleSignOut}>Sign Out</a>
                    {/*todo: insert other nav items here*/}
                    <div className="btn btn-primary sign-in-required">Button 1</div>
                    <div className="btn btn-primary sign-in-required">Button 2</div>
                    <div className="btn btn-primary sign-in-required">Button 3</div>
                </div>

                <div className="row" id="row-view-survey"></div>

                <div className="row" id="row-create-survey"></div>

                <div className="row" id="row-submit-survey"></div>
            </div>
        );
    }
});

// Export the component back for use in other files
module.exports = Main;
