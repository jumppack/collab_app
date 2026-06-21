import Document from '../models/Document.js';
import User from '../models/User.js';
import {
  createDocumentSchema,
  updateDocumentSchema,
  shareDocumentSchema,
} from '../schemas/documentSchemas.js';

export const getUserDocuments = async (req, res, next) => {
  // TODO:
  // 1. Get the current user's ID from req.user (e.g. req.user._id or req.user.id).
  // 2. Query the database for all documents where the user is either the owner or is in the collaborators array:
  //    Use Document.find({ $or: [{ owner: userId }, { collaborators: userId }] }).lean().
  // 3. Return a 200 OK response with the list of documents.
};

export const createDocument = async (req, res, next) => {
  // TODO:
  // 1. Validate the request body with createDocumentSchema.safeParse().
  //    If invalid, throw/pass a 400 Bad Request error.
  // 2. Get the current user's ID from req.user.
  // 3. Create a new document in the database using the validated title, content (default empty string),
  //    and set owner to the user's ID. Collaborators array should start as empty.
  // 4. Return a 201 Created response with the newly created document.
};

export const getDocumentById = async (req, res, next) => {
  // TODO:
  // 1. Retrieve the document ID from req.params.id.
  // 2. Find the document using Document.findById(id).lean().
  //    If not found, throw/pass a 404 Not Found error.
  // 3. Get the current user's ID from req.user.
  // 4. Verify the current user is either the owner of the document or is in its collaborators array.
  //    If not authorized, throw/pass a 403 Forbidden error.
  // 5. Return a 200 OK response with the document.
};

export const updateDocument = async (req, res, next) => {
  // TODO:
  // 1. Retrieve the document ID from req.params.id.
  // 2. Validate the request body with updateDocumentSchema.safeParse().
  //    If invalid, throw/pass a 400 Bad Request error.
  // 3. Find the document using Document.findById(id).
  //    (Do not use .lean() here since we need to save the document or update it).
  //    If not found, throw/pass a 404 Not Found error.
  // 4. Get the current user's ID from req.user.
  // 5. Verify the current user is either the owner or in the collaborators array.
  //    If not authorized, throw/pass a 403 Forbidden error.
  // 6. Update the document title and content with the validated fields from req.body (if provided).
  // 7. Save the document (triggering pre-save hook for updatedAt) or use findOneAndUpdate with runValidators.
  // 8. Return a 200 OK response with the updated document.
};

export const shareDocument = async (req, res, next) => {
  // TODO:
  // 1. Retrieve the document ID from req.params.id.
  // 2. Validate the request body with shareDocumentSchema.safeParse().
  //    If invalid, throw/pass a 400 Bad Request error.
  // 3. Find the document using Document.findById(id).
  //    If not found, throw/pass a 404 Not Found error.
  // 4. Get the current user's ID from req.user.
  // 5. Verify the current user is the owner of the document. Only the owner can share.
  //    If not authorized (e.g. user is only a collaborator or unrelated), throw/pass a 403 Forbidden error.
  // 6. Find the user to collaborate with by username using User.findOne({ username: req.body.username }).lean().
  //    If the user does not exist, throw/pass a 404 Not Found error.
  // 7. Check if the collaborator is already the owner or already in the collaborators list.
  //    If so, you can return a 400 Bad Request or a 200 OK saying they are already a collaborator.
  // 8. Add the collaborator's _id/id to the document's collaborators array.
  // 9. Save the document.
  // 10. Return a 200 OK response with a success message or the updated document.
};
