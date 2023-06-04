const globalErrorHandler = (err, req, res, next) => {
    const stack = err.stack;
    const message = err.message;
    const status =  err.status ? err.status : "failed";
    const statusCode = err.status ? err.statusCode : 500;

    res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

export default globalErrorHandler