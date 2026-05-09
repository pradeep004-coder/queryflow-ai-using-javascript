import { loginSchema, signupSchema } from "./auth.schema.js";

export const signupMiddleware = (req,res,next) => {

    const {error} = signupSchema.validate(req.body); //validate data , returns error info if it has error
    if (error) {
        console.log("error at signup middleware: ", error);
        return res.status(400).json({message: 'incorrect request', error});
        // execution stops
    }
    // no error, pass control
    next();
}

export const loginMiddleware = (req,res,next) => {

    const {error} = loginSchema.validate(req.body);
    if (error) {
        console.log("error at login middleware: ", error);
        return res.status(400).json({message: 'incorrect request', error});
    }
    next();
}