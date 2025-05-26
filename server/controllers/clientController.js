import Client from "../models/Client.js";
import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";
// GET /api/clients?page=1&limit=10
export const getAllClients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: 'client',
                    as: 'tickets',
                },
            },
            {
                $addFields: {
                    openTickets: {
                        $filter: {
                            input: '$tickets',
                            as: 'ticket',
                            cond: {
                                $in: ['$$ticket.status', ['open', 'in_progress']],
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    latestOpenTicket: {
                        $max: '$openTickets.createdAt',
                    },
                },
            },
            {
                $sort: {
                    latestOpenTicket: -1,
                    createdAt: -1,
                },
            },
            { $skip: skip },
            { $limit: limit },
        ];

        const [clients, totalCount] = await Promise.all([
            Client.aggregate(pipeline),
            Client.countDocuments(),
        ]);

        res.json({
            data: clients,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

// GET /api/clients/search?term=xxx&page=1&limit=10
export const searchClients = async (req, res) => {
    try {
        const { term } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const regex = new RegExp(term, "i");
        const filter = {
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
                { phone: regex }
            ]
        };

        const totalResults = await Client.countDocuments(filter);
        const results = await Client.find(filter)
            .skip(skip)
            .limit(limit)
            .populate('tickets')
            .populate('vehicles');

        res.json({
            data: results,
            pagination: {
                total: totalResults,
                page,
                limit,
                pages: Math.ceil(totalResults / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
};


// GET /api/clients/:id
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
            .populate('tickets')
            .populate('vehicles');
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.json(client);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch client" });
    }
};

// PUT /api/clients/:id
export const updateClient = async (req, res) => {
    try {

        const clientId = req.params.id;
        const updates = req.body;

        const existing = await Client.findById(clientId);
        if (!existing) {
            return res.status(404).json({ error: "Client not found" });
        }

        const updated = await Client.findByIdAndUpdate(clientId, updates, {
            new: true,
            runValidators: true,
        })
            .populate("tickets")
            .populate("vehicles");
        res.json(updated);
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update client" });
    }
};

// POST /api/clients/:clientId/vehicles
export const addVehicle = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { make, model, year, licensePlate, subscriptionType, color, vin } = req.body;

        const vehicle = new Vehicle({
            client: clientId,
            make,
            model,
            year,
            licensePlate,
            subscriptionType,
            color,
            vin
        });

        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ message: "Failed to add vehicle" });
    }
};



//PUT /api/clients/:clientId/vehicles/:vehicleId
export const updateVehicle = async (req, res) => {
    try {
        const { clientId, vehicleId } = req.params;
        const { make, model, year, licensePlate, subscriptionType, color, vinsubscriptionType, subscriptionStartDate, subscriptionEndDate, subscriptionAmount, } = req.body;

        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId, client: clientId },
            { make, model, year, licensePlate, subscriptionType, color, vinsubscriptionType, subscriptionStartDate, subscriptionEndDate, subscriptionAmount, },
            { new: true, runValidators: true }
        );
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ message: 'Failed to update vehicle' });
    }
}

// DELETE /api/clients/:clientId/vehicles/:vehicleId
export const deleteVehicle = async (req, res) => {
    try {
        const { clientId, vehicleId } = req.params;
        const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, client: clientId });

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ message: "Failed to delete vehicle" });
    }
};


// POST /api/clients/:clientId/refill
export const addFund = async (req, res) => {
    try {
        const { amount } = req.body;
        const client = await Client.findById(req.params.clientId);

        if (!client) {
            console.log("error", error)
            return res.status(404).json({ error: "Client not found" });
        }
        client.balance = Number(client.balance) + Number(amount);
        await client.save();

        res.json({ message: "Balance refilled successfully", client });
    } catch (error) {
        res.status(500).json({ error: "Failed to refill balance" });
    }
}


// POST /api/clients/:clientId/deduct
export const deductBalance = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { amount } = req.body;
        if (!clientId || !amount) {
            return res.status(400).json({ message: 'Missing clientId or amount' });
        }
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (client.balance < Math.abs(amount)) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        client.balance += amount; //The reverse amount is on the frontend side, no need for reverse
        await client.save();

        res.json(client);
    } catch (error) {
        res.status(500).json({ message: "Failed to process deduction" });
    }
};

//POST /api/clients/:clientId/vehicles/:vehicleId/washHistory
export const addWashHistory = async (req, res) => {
    const { clientId, vehicleId } = req.params
    const { historyData } = req.body;
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId, client: clientId },
            { $push: { washHistory: historyData } },
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found." });
        }

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Error adding wash history." });
    }
};
