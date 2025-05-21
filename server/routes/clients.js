
import express from "express";
import {
    addVehicle,
    deleteVehicle,
    getAllClients,
    getClientById,
    searchClients,
    updateClient,
    updateVehicle
} from "../controllers/clientController.js";
import { requireAuth } from '../middleware/auth.js';


const router = express.Router();

router.get("/", requireAuth, getAllClients); //Get all clients
router.get("/search", requireAuth, searchClients); //Search for client (Optimize)
router.get("/:id", requireAuth, getClientById); //Get Client by ID
router.put("/:id", requireAuth, updateClient) //Update client info



router.post("/:clientId/vehicles", requireAuth, addVehicle)//Add new Vehicle
router.put('/:clientId/vehicles/:vehicleId', requireAuth, updateVehicle) //Update Vehicle info
router.delete("/:clientId/vehicles/:vehicleId", requireAuth, deleteVehicle) //Delete Vehicle
export default router;
