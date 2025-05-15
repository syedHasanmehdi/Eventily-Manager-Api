import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addEvent, deleteEvent, getAllEvents, updateEvent } from "../controllers/events.controller.js";

const router = Router();

router.use(isAuthenticated);

router.get('/',getAllEvents);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;