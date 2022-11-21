import dayjs from "dayjs";
import { InputOutputSchema } from "../schemas/registerSchema.js";
import {
    usersCollection,
    sessionsCollection,
    registrosCollection
} from "../database/db.js";

export async function registerList(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");    

    if (!token) {
        return res.sendStatus(401)
    }
    try {
        const sessions = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: sessions?.userId });

        const registros = await registrosCollection.find().toArray();
        const regs = registros.filter(u => (u.userId.toString() === user._id.toString()));

        res.send({
            user,
            regs,
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

export async function inputRegister(req, res) {    
    const { value, description } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");    

    const sessions = await sessionsCollection.findOne({ token });
    console.log(sessions)

    if (!token) {
        return res.sendStatus(401)
    };
    
    try {
        const registros = await registrosCollection.insertOne({
            description,
            value: Number(value),
            day: dayjs().locale("pt-br").format("DD/MM"),
            type: "entrada",
            userId: sessions.userId
        });

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

export async function outputRegister(req, res) {
    const { value, description } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessions = await sessionsCollection.findOne({ token });

    if (!token) {
        return res.sendStatus(401)
    };
    

    try {
        const registros = await registrosCollection.insertOne({
            description,
            value: Number(value),
            day: dayjs().locale("pt-br").format("DD/MM"),
            type: "saida",
            userId: sessions.userId
        });

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};