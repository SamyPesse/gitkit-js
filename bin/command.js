
/*
    Create and prepare a command

    @param {String} description
    @param {Function} func
    @return {Object}
*/
function createCommand(description, func) {
    return {
        description: description,
        exec: func
    };
}

module.exports = createCommand;
