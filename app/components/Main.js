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

                <div className="row">
                    <div className="g-signin2" data-onsuccess="onSignIn"></div>
                    <a href="#" onClick={signOut}>Sign out</a>
                </div>
            </div>
        );
    }
});

// Export the component back for use in other files
module.exports = Main;
