import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { usersCollection, sessionsCollection } from "../database/db.js";
import { signUpSchema, signInSchema } from "../schemas/signSchema.js";

export async function signUp(req, res) {
    const { name, email, password } = req.body;

    const users = await usersCollection.find().toArray();

    const validation = signUpSchema.validate({
        name,
        email,
        password
    });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        res.status(422).send(errors)
    }

    if (users.find(participant => participant.name === name)) {
        res.status(422).send("Usuário já cadastrado!");
        return;
    }
    if (users.find(participant => participant.email === email)) {
        res.status(422).send("E-mail já cadastrado!");
        return;
    }


    const passwordHash = bcrypt.hashSync(password, 10);
    try {
        await usersCollection.insertOne({
            name,
            email,
            password: passwordHash
        });
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

export async function signIn(req, res) {
    const { email, password } = req.body;
    const token = uuidV4();

    const validation = signInSchema.validate({
        email,
        password,
    });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        res.status(422).send(errors);
    };

    const user = await usersCollection.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        await sessionsCollection.insertOne({
            token,
            email,
            userId: user._id,
        });
        res.send({ token });
    } else {
        res.sendStatus(401);
    }
};