import express from "express";
import joi from "joi";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {v4 as uuidV4} from "uuid"
const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

const mongoCilent = new MongoClient("mongodb://localhost:27017");
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

try {
    await mongoCilent.connect();
} catch (error) {
    console.log(error);
};

const db = mongoCilent.db("myWallet");
const usersCollection = db.collection("users");
const registryCollection = db.collection("registry");
const sessionsCollection = db.collection("sessions");

app.post("/sign-up", async (req, res) =>{
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
});

app.post("/sign-in", async (req, res)=>{
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
    
});

app.post("/registry", async (req, res) =>{
    const {date, description, value, type} = req.body;
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token){
        return res.sendStatus(401);
    };

    try {
        const sessions = await sessionsCollection.findOne({token});
        const user = await usersCollection.findOne({_id: sessions.userId});
        await registryCollection.insertOne({date, description, value, type, userId: user._id});
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    };
})

app.get("/registry", async (req, res) =>{
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
});

app.delete("/sign-out", async (req, res) =>{
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
});

app.listen(5000);