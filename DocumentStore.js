// A simple in-memory document store
let documents = [];

export const DocumentStore = {
  // Get all documents
  getDocuments: () => {
    return [...documents];
  },
  
  // Add or update a document
  saveDocument: (document) => {
    const index = documents.findIndex(doc => doc.id === document.id);
    if (index >= 0) {
      // Update existing document
      documents[index] = document;
    } else {
      // Add new document
      documents.push(document);
    }
    return document;
  },
  
  // Delete a document
  deleteDocument: (id) => {
    documents = documents.filter(doc => doc.id !== id);
  },
  
  // Get a document by ID
  getDocumentById: (id) => {
    return documents.find(doc => doc.id === id);
  }
}; 