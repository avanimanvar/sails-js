var responseData = function (message, fieldd, error) {
    return {
        "errors": {
            fields: {
                "message": message,
                "name": "ValidatorError"
            }
        },
        "message": "Password field is missing",
        "name": "ValidationError"
    }
};
console.log(responseData);
module.exports = responseData;