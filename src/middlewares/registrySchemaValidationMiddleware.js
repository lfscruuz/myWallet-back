import dayjs from "dayjs";
import { sessionsCollection, usersCollection } from "../database/db.js";
import { registrySchema } from "../schemas/registrySchema.js";


export async function registrySchemaValidation(req, res, next) {
    const { description, value, type } = req.body;
    const token = req.token

    const sessions = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: sessions.userId });
    const newRegister = {
        date: dayjs().format("DD/MM"),
        description,
        value,
        type,
        userId: user._id
    };

    const { error } = registrySchema.validate(newRegister, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    };

    req.newRegister = newRegister;

    next();
}