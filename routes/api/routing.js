const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controller/ctrlContacts");

router.get("/contacts", ctrlContacts.get);

router.get("/contacts/:id", ctrlContacts.getById);

router.post("/contacts", ctrlContacts.create);

router.put("/contacts/:id", ctrlContacts.update);

router.patch("/contacts/:id/favorite", ctrlContacts.updateStatus);

router.delete("/contacts/:id", ctrlContacts.remove);

module.exports = router;
