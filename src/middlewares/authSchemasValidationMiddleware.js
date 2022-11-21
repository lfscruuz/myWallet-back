import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { usersCollection } from "../database/db.js";
import { signUpSchema } from "../schemas/signUpSchema.js";
import { sessionsSchema } from "../schemas/sessionsSchema.js";

export async function signUpSchemaValidation(req, res, next) {
    const { name, email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = {
        name,
        email,
        password: hashPassword
    }

    const foundUser = await usersCollection.findOne({ email });
    if (foundUser) {
        res.status(409).send("usuário já existe");
        return;
    };

    const { error } = signUpSchema.validate(newUser, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    req.newUser = newUser;

    next();
};

export async function sessionsSchemaValidation(req, res, next) {
    const { email, password } = req.body;
    const token = uuidV4();

    const foundUser = await usersCollection.findOne({ email: email });

    if (!foundUser) {
        return res.status(401).send("usuário não encontrado");
    };
    const comparePasswords = bcrypt.compare(password, foundUser.password);
    if (!comparePasswords) {
        return res.sendStatus(401)
    };
    const newSession = {
        name: foundUser.name,
        token,
        userId: foundUser._id
    };

    const {error} = sessionsSchema.validate(newSession, {abortEarly: false});
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    };

    req.newSession = newSession;
    next();
}