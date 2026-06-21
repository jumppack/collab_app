import Document from '../models/Document.js';
import User from '../models/User.js';
import {
  createDocumentSchema,
  updateDocumentSchema,
  shareDocumentSchema,
} from '../schemas/documentSchemas.js';

export const getUserDocuments = async (req, res, next) => {
  const userId = req.user.id;
  const documents = await Document.find({ $or: [{ owner: userId }, { collaborators: userId }] }).lean();
  return res.status(200).json({documents});
};

export const createDocument = async (req, res, next) => {
  const validation = createDocumentSchema.safeParse(req.body);
  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message);
    return res.status(400).json({message: errors.join(', ')});
  }
  const { title, content} = validation.data;
  const userId = req.user.id;
  const doc = await Document.create({title: title, content: content, owner: userId, collaborators: []});
  return res.status(201).json({document: doc});
};

export const getDocumentById = async (req, res, next) => {
  const docId = req.params.id;

  const doc = await Document.findById(docId);
  if (!doc) {
    return res.status(404).json({message: "Document not found"})
  }

  const userId = req.user.id;

  const isOwner = doc.owner.toString() === userId.toString();
  const isCollaborator = doc.collaborators.some((collId) => collId.toString() === userId.toString());

  if (!isOwner && !isCollaborator) {
    return res.status(403).json({message: "Forbidden: You are not the owner and not a collaborator"})
  }

  return res.status(200).json({document: doc});
};

export const updateDocument = async (req, res, next) => {

  const docId = req.params.id;

  const validation = updateDocumentSchema.safeParse(req.body);
  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message);
    return res.status(400).json({message: errors.join(', ')});
  }

  const {title, content} = validation.data;

  const doc = await Document.findById(docId);

  if (!doc) {
    return res.status(404).json({message: "Document not found"})
  }

  const userId = req.user.id;
  const isOwner = doc.owner.toString() === userId.toString();
  const isCollaborator = doc.collaborators.some((collId) => collId.toString() === userId.toString());

  if (!isOwner && !isCollaborator) {
    return res.status(403).json({message: "Forbidden: You are not the owner and not a collaborator"})
  }

  if (title != undefined) doc.title = title;
  if (content != undefined) doc.content = content;

  const updatedDoc = await doc.save();

  return res.status(200).json({document: updatedDoc});
};

export const shareDocument = async (req, res, next) => {

  const docId = req.params.id;
  const validation = shareDocumentSchema.safeParse(req.body);
  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message);
    return res.status(400).json({message: errors.join(', ')});
  }

  const doc = await Document.findById(docId);
  if (!doc) {
    return res.status(404).json({message: "Document not found"})
  }

  const userId = req.user.id;
  const isOwner = doc.owner.toString() === userId.toString();

  if (!isOwner) {
    return res.status(403).json({message: "Forbidden: only the owner can share the document"})
  }

  const {username} = validation.data;
  const collaborator = await User.findOne({ username: username }).lean();
  if (!collaborator) {
    return res.status(404).json({message: "Collaborator not found"})
  }

  // check if the collaborator is the owner
  if (collaborator._id.toString() === userId.toString()) {
    return res.status(400).json({message: "You cannot share the document with yourself"})
  }

  // check if the collaborator is already a collaborator
  const isAlreadyCollaborator = doc.collaborators.some((collId) => collId.toString() === collaborator._id.toString());
  if (isAlreadyCollaborator) {
    return res.status(400).json({message: "Collaborator already exists"})
  }

  doc.collaborators.push(collaborator._id);
  await doc.save();

  return res.status(200).json({document: doc});

};
