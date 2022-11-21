import joi from "joi";

export const InputOutputSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required()
});