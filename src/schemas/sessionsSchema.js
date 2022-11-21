import joi from "joi";

export const sessionsSchema = joi.object({
    name: joi.string().required(),
    token: joi.string().required(),
    userId: joi.object().required(),
})