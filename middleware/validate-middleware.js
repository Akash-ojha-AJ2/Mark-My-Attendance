const validate = (schema) => {
    return (req, res, next) => {
        const validationResult = schema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                errors: validationResult.error.errors.map(err => ({
                    path: err.path,
                    message: err.message,
                })),
            });
        }

        // Attach validated data to request object
        req.body = validationResult.data;
        next();
    };
};

module.exports = validate;
