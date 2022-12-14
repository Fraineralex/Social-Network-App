const express = require('express');

const router = express.Router();

const eventController = require('../controllers/EventController');
const isLogin = require("../middleware/is-login");


router.get("/events",isLogin, eventController.GetAllEvents);
router.get("/events-created",isLogin, eventController.GetCreatedEvents);
router.get("/create-event",isLogin, eventController.GetCreateEvent);
router.post("/create-event",isLogin, eventController.PostCreateEvent);
router.get("/delete-event/:EventId",isLogin, eventController.GetDeleteEvent);
router.get("/add-invited/:AuthorId/:EventId",isLogin, eventController.GetAddInvited);
router.post("/add-invited",isLogin, eventController.PostAddInvited);
router.get("/view-invited/:AuthorId/:EventId",isLogin, eventController.GetViewInvited);
router.post("/assist/:Message",isLogin, eventController.PostMessageReceptor);
router.get("/delete-invited/:InvitedId/:EventId/:AuthorId",isLogin, eventController.GetDeleteInvited);


module.exports = router;
