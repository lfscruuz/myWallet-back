import {
    usersCollection,
    sessionsCollection
} from "../database/db.js";

export async function signUp(req, res) {
    const newUser = req.newUser;

    try {
        await usersCollection.insertOne(newUser);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    };
};

export async function signIn(req, res) {
    const newSession = req.newSession;
    const {name, token, userId} = newSession
    try {
        await sessionsCollection.insertOne({token, userId})
        return res.send({ token, name });
    } catch (error) {
        res.sendStatus(500);
    }

};

export async function signOut(req, res) {
    const token = req.token

    try {
        const sessions = await sessionsCollection.findOne({ token });
        if (sessions) {
            await sessionsCollection.deleteOne({ token })
        }
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500);
    };
};