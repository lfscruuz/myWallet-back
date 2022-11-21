
import {
    usersCollection,
    sessionsCollection,
    registryCollection
} from "../database/db.js";



export async function postRegistry(req, res) {
    const newRegister = req.newRegister;
    
    try {
        await registryCollection.insertOne(newRegister);
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    };
};

export async function getRegistry(req, res) {
    const token = req.token

    try {
        const sessions = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: sessions.userId });
        const registry = await registryCollection.find({ userId: user._id }).toArray();
        return res.send(registry);
    } catch (error) {
        return res.sendStatus(500);
    };
}