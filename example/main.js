var React = require('react');
var ReactDOM = require('react-dom');

var GitKit = require('../');
var MemoryFS = require('../lib/fs/memory');

var DEFAULT_URL = 'https://github.com/SamyPesse/test-draft-js.git';

var InputForm = React.createClass({
    getInitialState: function() {
        return {
            url: DEFAULT_URL
        };
    },

    onChange: function(e) {
        this.setState({
            url: e.target.value
        });
    },

    onSubmit: function(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.url);
    },

    render: function() {
        return <form className="form" onSubmit={this.onSubmit}>
            <div className="row">
                <div className="col-md-8">
                    <div className="form-group">
                        <input type="text" onChange={this.onChange} className="form-control" placeholder="Enter an HTTPS Git url" />
                    </div>
                </div>
                <div className="col-md-4">
                    <button type="submit" className="btn btn-default btn-block">Clone</button>
                </div>
            </div>
        </form>;
    }
});

var Loading = React.createClass({
    render: function() {
        var line = this.props.line;

        return <div className="progress">
            <div className="progress-bar progress-bar-striped active" style={{width: '50%'}}>
                <span className="sr-only">0% Complete</span>
            </div>
            <p className="help-block text-center">{line? line.getMessage() : 'Loading'}</p>
        </div>
    }
});

var ErrorAlert = React.createClass({
    render: function() {
        var error = this.props.error;

        return <div className="alert alert-danger">
            {error.message || error}
        </div>
    }
});

var Example = React.createClass({
    getInitialState: function() {
        return {
            loading: false,
            progressLine: null,
            error: null
        }
    },

    onUrlChanged: function(url) {
        var that = this;

        this.setState({
            loading: true
        });

        // Create a transport instance for the Git repository
        var transport = new GitKit.HTTPTransport(url);

        // Prepare the filesystem
        var fs = MemoryFS();

        // Create a repository instance
        var repo = GitKit.Repository.createWithFS(fs, false);

        GitKit.RepoUtils.init(repo)
        .then(function() {
            return GitKit.TransferUtils.clone(repo, transport);
        })
        .then(function(newRepo) {
            console.log('end', newRepo);
            that.setState({
                loading: false
            });
        }, function(err) {
            console.log('error', err.stack, err);
            that.setState({
                loading: false,
                error: err
            });
        })
    },

    render: function() {
        return <div className="Example">
            <div className="container">
                <InputForm onSubmit={this.onUrlChanged} />
                {this.state.error? <ErrorAlert error={this.state.error} /> : ''}
                {this.state.loading? <Loading line={this.state.progressLine} /> : ''}
            </div>
        </div>;
    }
});

ReactDOM.render(
    <Example />,
    document.getElementById('target')
);
