const express = require("express");
const router = express.Router();
const Joi = require("joi");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

const validateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(15),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(8).max(12),
});

router.get("/", async (req, res, next) => {
  return res.json({
    message: "Contacts list",
    contacts: await listContacts(),
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);
  if (result === null) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(result);
});

router.post("/", async (req, res, next) => {
  const isValid = validateSchema.validate(req.body);
  if (isValid.error) {
    return res.status(403).json({ message: isValid.error.details[0].message });
  }
  if (!req.body.name || !req.body.phone || !req.body.email) {
    const { name, phone, email } = req.body;
    const missingFields = [];
    if (!name) {
      missingFields.push("name");
    }
    if (!phone) {
      missingFields.push("phone");
    }
    if (!email) {
      missingFields.push("email");
    }

    return res.status(400).json({
      error: `missing required field`,
      missingFields: missingFields,
    });
  }
  return res.status(201).json({ newList: await addContact(req.body) });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  // console.log(result);
  if (result) {
    return res.status(200).json({ message: "contact deleted" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ errorMessage: "missing fields" });
  }

  const isValid = validateSchema.validate(req.body);
  if (isValid.error) {
    return res.status(403).json({ error: isValid.error.details[0].message });
  }

  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (result !== null) {
    return res.status(200).json({ updated: result });
  }

  res.status(404).json({ message: "Not found" });
});

module.exports = router;
