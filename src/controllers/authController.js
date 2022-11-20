import bcrypt from "bcrypt";
import {v4 as uuidV4} from "uuid"
import { 
    usersCollection, 
    sessionsCollection 
} from "../database/db.js";

export async function signUp (req, res){
    const {name, email, password} = req.body;

    const hashPassword = bcrypt.hashSync(password, 10)
    try {
        const foundUser = await usersCollection.findOne({email});
        if (foundUser){
            res.status(409).send("usuário já existe");
            return;
        };
        await usersCollection.insertOne({name, email, password: hashPassword});
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    };
};

export async function signIn (req, res) {
    const {email, password} = req.body;
    const token = uuidV4();
    try {
        const foundUser = await usersCollection.findOne({email: email});
        const {name} = foundUser
        console.log(name)
        if (!foundUser){
            return res.status(401).send("usuário não encontrado");
        }

        const comparePasswords = bcrypt.compare(password, foundUser.password);
        if (!comparePasswords){
            return res.sendStatus(401)
        }
        
        await sessionsCollection.insertOne({token, userId: foundUser._id})
        return res.send({token, name});
    } catch (error) {
        res.sendStatus(500);
    }
    
};

export async function signOut(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token){
        return res.sendStatus(401);
    };

    try {
        const sessions = await sessionsCollection.findOne({token});
        if (sessions){
            await sessionsCollection.deleteOne({token})
        }
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500);
    };
};