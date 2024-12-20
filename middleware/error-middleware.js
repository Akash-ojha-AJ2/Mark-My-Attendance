const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Backend Error";
    const extraDetails = err.extraDetails || "Error from the Backend";
  
    console.error(
      `[${req.method}]  ${req.path} >> StatusCode:: ${status}, Message:: ${extraDetails} `
    );
  
    return res.status(status).json({ message, extraDetails });
  };
  
  module.exports = errorMiddleware;
  

  const validate = (schema) => async (req, res, next) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (err) {
      const status = 422;

  
      const error = {
        status,
      };
  
      next(error);
    }
  };
  
  module.exports = validate;