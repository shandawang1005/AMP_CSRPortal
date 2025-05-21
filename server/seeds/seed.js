// seeds/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Client from "../models/Client.js";
import Vehicle from "../models/Vehicle.js";
import Ticket from "../models/Ticket.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/localDB";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};

const createUsers = async (count = 10) => {
    const users = [];
    const rawPassword = "123456";
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    for (let i = 0; i < count; i++) {
        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            passwordHash,
            role: faker.helpers.arrayElement(["admin", "manager", "csr"]),
        });
    }
    users.push(
        { name: "Admin", email: "admin@amp.com", passwordHash, role: "admin" },
        { name: "Manager", email: "manager@amp.com", passwordHash, role: "manager" },
        { name: "CSR", email: "csr@amp.com", passwordHash, role: "csr" }
    );
    return await User.insertMany(users);
};

const createClients = async (count = 100, userIds = []) => {
    const clients = [];
    for (let i = 0; i < count; i++) {
        const balance = faker.number.int({ min: -7, max: 500 });
        const status = balance > 0 ? 'active' : 'overdue';
        clients.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            createdBy: faker.helpers.arrayElement(userIds),
            balance: balance,
            status: status
        });
    }
    return await Client.insertMany(clients);
};

const createVehiclesAndTickets = async (clients) => {
    const vehicles = [];
    const tickets = [];

    clients.forEach((client) => {
        const vehicleCount = faker.number.int({ min: 1, max: 2 });
        const ticketCount = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < vehicleCount; i++) {
            vehicles.push({
                client: client._id,
                make: faker.vehicle.manufacturer(),
                model: faker.vehicle.model(),
                year: faker.date.past({ years: 10 }).getFullYear(),
                color: faker.vehicle.color(),
                licensePlate: faker.vehicle.vrm() || faker.string.alphanumeric(7).toUpperCase(),
                vin: faker.vehicle.vin() || faker.string.alphanumeric(17).toUpperCase()
            });
        }

        for (let i = 0; i < ticketCount; i++) {
            tickets.push({
                client: client._id,
                subject: faker.lorem.sentence(),

                status: faker.helpers.arrayElement(["open", "in_progress", "closed"]),
                createdAt: faker.date.recent({ days: 30 }),
            });
        }
    });

    await Vehicle.insertMany(vehicles);
    await Ticket.insertMany(tickets);
};

const seed = async () => {
    await connectDB();

    console.log("Clearing old data...");
    await Promise.all([
        User.deleteMany({}),
        Client.deleteMany({}),
        Vehicle.deleteMany({}),
        Ticket.deleteMany({}),
    ]);

    console.log("Seeding users...");
    const users = await createUsers(10);

    console.log("Seeding clients...");
    const clients = await createClients(100, users.map((u) => u._id));

    console.log("Seeding vehicles and tickets...");
    await createVehiclesAndTickets(clients);

    console.log("\u2705 Seed completed");
    process.exit();
};

seed();
