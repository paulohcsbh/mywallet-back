import { InputOutputSchema } from "../schemas/registerSchema.js";

export function schemaValidation(req, res, next){
    const { value, description } = req.body;
    const validation =  InputOutputSchema.validate({
        value,
        description
    });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
         return res.status(422).send(errors);
    };
    next();
};