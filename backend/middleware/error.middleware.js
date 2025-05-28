

export const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err.stack);  // for debugging

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message
    });
};


// =======================  WHO TO USE ==========================
// if (!user) {
//     const error = new Error("User not found");
//     error.statusCode = 404;
//     throw error;
// }

// OR
// return next(new Error("Something went wrong"));