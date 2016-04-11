
/*
    Create and prepare a command

    @param {String} description
    @param {Function} func
    @return {Object}
*/
function createCommand(description, func, opts) {
    return {
        description: description,
        exec: func,
        options: opts || []
    };
}

module.exports = createCommand;
