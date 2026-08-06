export const errorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: null,
        error: 
            process.env.NODE_ENV === "production"
                ? err.stack
                : undefined
    });
}

export default errorHandler;