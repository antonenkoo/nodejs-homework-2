const fs = require("fs/promises");
const nanoid = require("nanoid");

async function listContacts() {
  const contactsRaw = await fs.readFile("./models/contacts.json", "utf8");
  return JSON.parse(contactsRaw);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === String(contactId));
  return result || null;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid.nanoid(), ...body };
  const updatedContacts = [...contacts, newContact];
  fs.writeFile("./models/contacts.json", JSON.stringify(updatedContacts));
  return newContact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(
    (contact) => contact.id === String(contactId)
  );
  if (index === -1) {
    return null;
  }
  const removedContact = contacts.splice(index, 1);
  await fs.writeFile(
    "./models/contacts.json",
    JSON.stringify(contacts, null, 2)
  );
  return removedContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === String(contactId));
  if (!contact) {
    return null;
  }
  const { id, name, email, phone } = contact;
  const updatedContact = {
    id,
    name: body?.name || name,
    email: body?.email || email,
    phone: body?.phone || phone,
  };

  const updatedList = contacts.map((contact) => {
    if (contact.id === contactId) {
      return updatedContact;
    }
    return contact;
  });

  await fs.writeFile("./models/contacts.json", JSON.stringify(updatedList));
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
