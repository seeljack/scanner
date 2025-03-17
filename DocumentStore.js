// A simple in-memory document store
let documents = [];

export const DocumentStore = {
  // Get all documents
  getDocuments: () => {
    console.log('DocumentStore returning documents:', documents); // Debug log
    return [...documents];
  },
  
  // Add or update a document
  saveDocument: (document) => {
    // Make sure document has an ID
    if (!document.id) {
      document.id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    console.log('DocumentStore saving document with image:', document.preview); // Debug log
    
    const index = documents.findIndex(doc => doc.id === document.id);
    if (index >= 0) {
      // Update existing document
      documents[index] = { ...documents[index], ...document };
    } else {
      // Add new document
      documents.push({ ...document });
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