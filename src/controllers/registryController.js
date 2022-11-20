import { 
    usersCollection, 
    sessionsCollection, 
    registryCollection 
} from "../database/db.js";
import dayjs from "dayjs";

export async function postRegistry (req, res) {
    const { description, value, type} = req.body;
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token){
        return res.sendStatus(401);
    };

    try {
        const sessions = await sessionsCollection.findOne({token});
        const user = await usersCollection.findOne({_id: sessions.userId});
        const newRegister = {
            date: dayjs().format("DD/MM"),
            description, 
            value, 
            type,
            userId: user._id
        }
        await registryCollection.insertOne(newRegister);
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    };
};

export async function getRegistry (req, res){
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token){
        return res.sendStatus(401);
    };

    try {
        const sessions = await sessionsCollection.findOne({token});
        const user = await usersCollection.findOne({_id: sessions.userId});
        const registry = await registryCollection.find({userId: user._id}).toArray();
        return res.send(registry);
    } catch (error) {
        return res.sendStatus(500);
    };
}