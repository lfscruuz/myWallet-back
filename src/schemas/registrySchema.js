import joi from "joi";

export const registrySchema = joi.object({
    date: joi.string().required(),
    description: joi.string().required(),
    value: joi.number().required(),
    type: joi.string().required(),
    userId: joi.object().required()
});