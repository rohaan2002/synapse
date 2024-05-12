import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js'
import { getNotifs,deleteNotif, deleteOneNotif } from '../controllers/notif.controller.js'
const router = express.Router()

router.get("/",protectRoute,getNotifs)
router.delete("/",protectRoute,deleteNotif)
router.delete("/:notifId",protectRoute,deleteOneNotif)
export default router;