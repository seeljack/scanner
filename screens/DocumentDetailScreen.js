import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
  Modal
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { DocumentStore } from '../DocumentStore';
import { AVAILABLE_TAGS } from '../constants/Tags';
import { getCategoryNames } from '../constants/Categories';

// Add mock data directly in this file
const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Invoice #1234',
    date: '2023-05-15',
    category: 'Invoices',
    tags: ['business', 'tax'],
    preview: null,
    lastViewed: '2023-06-01'
  },
  {
    id: '2',
    title: 'Receipt - Office Supplies',
    date: '2023-05-10',
    category: 'Receipts',
    tags: ['business', 'expense'],
    preview: null,
    lastViewed: '2023-05-20'
  },
  {
    id: '3',
    title: 'Rental Agreement',
    date: '2023-04-01',
    category: 'Contracts',
    tags: ['personal', 'important'],
    preview: null,
    lastViewed: '2023-05-15'
  },
  {
    id: '4',
    title: 'Driver License',
    date: '2023-03-15',
    category: 'IDs',
    tags: ['personal', 'important'],
    preview: null,
    lastViewed: '2023-04-10'
  },
  {
    id: '5',
    title: 'Meeting Notes',
    date: '2023-05-05',
    category: 'Notes',
    tags: ['business'],
    preview: null,
    lastViewed: '2023-05-06'
  },
  {
    id: '6',
    title: 'Internet Bill',
    date: '2023-05-20',
    category: 'Invoices',
    tags: ['personal', 'bill'],
    preview: null,
    lastViewed: '2023-05-21'
  },
  {
    id: '7',
    title: 'Health Insurance',
    date: '2023-02-10',
    category: 'Contracts',
    tags: ['personal', 'health', 'important'],
    preview: null,
    lastViewed: '2023-03-15'
  },
  {
    id: '8',
    title: 'Project Proposal',
    date: '2023-05-18',
    category: 'Notes',
    tags: ['business', 'project'],
    preview: null,
    lastViewed: '2023-05-19'
  }
];

// Mock OCR text for demo purposes
const MOCK_OCR_TEXT = `INVOICE

Invoice #: 1234
Date: May 15, 2023

Bill To:
John Smith
123 Main Street
Anytown, CA 12345

Description                   Quantity    Rate    Amount
Web Development Services      40 hours    $75     $3,000
UI/UX Design                  15 hours    $85     $1,275
Content Creation              5 hours     $65     $325

Subtotal                                          $4,600
Tax (8%)                                          $368
Total                                             $4,968

Payment Terms: Net 30
Due Date: June 14, 2023

Thank you for your business!`;

// Mock AI summary for demo purposes
const MOCK_AI_SUMMARY = `This is an invoice (#1234) dated May 15, 2023, for web development services, UI/UX design, and content creation totaling $4,968 (including 8% tax). Payment is due by June 14, 2023.`;

// Mock AI suggested tags
const MOCK_AI_TAGS = ['invoice', 'web development', 'design', 'business expense', 'tax deductible'];

// Replace your availableTags with categories
const availableCategories = getCategoryNames();

const DocumentDetailScreen = ({ route, navigation }) => {
  // Get document ID and image URI from route params
  const documentId = route?.params?.documentId || '1';
  const imageUri = route?.params?.imageUri;
  const isNewScan = route?.params?.newScan || false;
  
  // State for document details
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for UI
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isEditingOcr, setIsEditingOcr] = useState(false);
  const [editedOcrText, setEditedOcrText] = useState('');
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSuggestedTags, setShowSuggestedTags] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  
  // Refs
  const titleInputRef = useRef(null);
  const ocrTextInputRef = useRef(null);
  
  // Add state for fullscreen modal
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Add state for saving document
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch document data when component mounts
  useEffect(() => {
    if (documentId) {
      // Get document from DocumentStore instead of MOCK_DOCUMENTS
      const foundDocument = DocumentStore.getDocumentById(documentId);
      
      if (foundDocument) {
        // Use the actual document data
        setDocument({
          ...foundDocument,
          ocrText: foundDocument.ocrText || MOCK_OCR_TEXT, // Fallback to mock text if needed
          notes: foundDocument.notes || ''
        });
        setNewTitle(foundDocument.title);
        setEditedOcrText(foundDocument.ocrText || MOCK_OCR_TEXT);
        setNotes(foundDocument.notes || '');
        setSelectedCategory(foundDocument.category || '');
      } else if (isNewScan) {
        // Handle new scan
        const newDocument = {
          id: 'new-' + Date.now(),
          title: 'New Scan',
          date: new Date().toISOString().split('T')[0],
          category: 'Uncategorized',
          tags: [],
          preview: null,
          lastViewed: new Date().toISOString().split('T')[0],
          ocrText: MOCK_OCR_TEXT,
          notes: ''
        };
        setDocument(newDocument);
        setNewTitle(newDocument.title);
        setEditedOcrText(MOCK_OCR_TEXT);
        setNotes('');
        setSelectedCategory(newDocument.category || '');
      }
    }
    
    setIsLoading(false);
  }, [documentId, isNewScan]);
  
  // Handle title edit
  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  };
  
  const saveTitle = () => {
    if (document) {
      setDocument({ ...document, title: newTitle });
      setIsEditingTitle(false);
    }
  };
  
  // Handle OCR text edit
  const handleOcrEdit = () => {
    setIsEditingOcr(true);
    setTimeout(() => {
      ocrTextInputRef.current?.focus();
    }, 100);
  };
  
  const saveOcrText = () => {
    setDocument({ ...document, ocrText: editedOcrText });
    setIsEditingOcr(false);
  };
  
  // Generate AI summary
  const generateAiSummary = () => {
    setIsGeneratingSummary(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setAiSummary(MOCK_AI_SUMMARY);
      setShowAiSummary(true);
      setIsGeneratingSummary(false);
    }, 1500);
  };
  
  // Get AI suggested tags
  const getAiSuggestedTags = () => {
    // Simulate API call delay
    setTimeout(() => {
      setSuggestedTags(MOCK_AI_TAGS);
      setShowSuggestedTags(true);
    }, 1000);
  };
  
  // Export document
  const handleExport = (type) => {
    Alert.alert(
      "Export Document",
      `Document will be exported as ${type}`,
      [{ text: "OK" }]
    );
  };
  
  // Add page to document
  const handleAddPage = () => {
    navigation.navigate('Scan', { addToDocumentId: documentId });
  };
  
  // Re-scan document
  const handleRescan = () => {
    navigation.navigate('Scan', { rescanDocumentId: documentId });
  };
  
  // Save notes
  const handleSaveNotes = () => {
    setDocument({ ...document, notes });
    Alert.alert("Notes Saved", "Your notes have been saved successfully.");
  };
  
  // Copy OCR text to clipboard
  const handleCopyText = () => {
    Alert.alert(
      "Text Copied",
      "The OCR text has been copied to clipboard",
      [{ text: "OK" }]
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Zoom and pan instructions
  const handleZoomInstructions = () => {
    Alert.alert(
      "Zoom and Pan",
      "Pinch to zoom and drag to pan around the document",
      [{ text: "OK" }]
    );
  };
  
  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  // Save document to library
  const saveDocument = () => {
    setIsSaving(true);
    
    try {
      const finalDocument = {
        id: document?.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newTitle || 'New Document',
        date: document?.date || new Date().toISOString().split('T')[0],
        category: selectedCategory || 'Uncategorized',
        preview: document?.preview || imageUri,
        ocrText: editedOcrText || '',
        notes: notes || '',
        lastViewed: new Date().toISOString().split('T')[0]
      };
      
      DocumentStore.saveDocument(finalDocument);
      
      Alert.alert(
        "Document Saved",
        "Your document has been saved to the library",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('DocumentLibrary', { 
              refreshTimestamp: Date.now(),
              newDocumentId: finalDocument.id 
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error saving document:', error);
      Alert.alert("Error", "Failed to save document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Add this function to handle document deletion
  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (document?.id) {
              DocumentStore.deleteDocument(document.id);
              navigation.navigate('DocumentLibrary', {
                refreshTimestamp: Date.now()
              });
            }
          }
        }
      ]
    );
  };
  
  // Render the document preview
  const renderPreview = () => {
    if (imageUri) {
      console.log('imageUri', imageUri);
      return (
        <View style={styles.previewContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={toggleFullScreen}
            style={{ flex: 1 }}
          >
            <Image 
              source={{ uri: imageUri }} 
              style={[styles.documentImage, { width: '100%', height: 400 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          {/* Fullscreen Modal */}
          <Modal
            visible={isFullScreen}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleFullScreen}
          >
            <View style={styles.fullScreenContainer}>
              <StatusBar backgroundColor="#000" barStyle="light-content" />
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={toggleFullScreen}
              >
                <MaterialIcons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              
              <ScrollView 
                contentContainerStyle={styles.fullScreenScrollContainer}
                maximumZoomScale={3}
                minimumZoomScale={1}
                bouncesZoom={true}
              >
                <Image 
                  source={{ uri: imageUri }} 
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </ScrollView>
            </View>
          </Modal>
        </View>
      );
    } 
    // If no camera image, check if document has a preview
    else if (document?.preview) {
      return (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: document.preview }} 
            style={styles.documentImage}
            resizeMode="contain"
          />
        </View>
      );
    } 
    // If no images available, show placeholder
    else {
      return (
        <View style={styles.previewContainer}>
          <View style={styles.documentPlaceholder}>
            <MaterialIcons name="description" size={80} color="#9e9e9e" />
            <Text style={styles.placeholderText}>No Document Preview</Text>
          </View>
        </View>
      );
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return renderPreview();
      case 'text':
        return (
          <View style={styles.ocrContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Extracted Text</Text>
              <View style={styles.ocrActions}>
                <TouchableOpacity 
                  style={styles.ocrActionButton}
                  onPress={handleCopyText}
                >
                  <MaterialIcons name="content-copy" size={20} color="#1E88E5" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.ocrActionButton}
                  onPress={isEditingOcr ? saveOcrText : handleOcrEdit}
                >
                  <MaterialIcons 
                    name={isEditingOcr ? "check" : "edit"} 
                    size={20} 
                    color="#1E88E5" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {isEditingOcr ? (
              <TextInput
                ref={ocrTextInputRef}
                style={styles.ocrTextInput}
                value={editedOcrText}
                onChangeText={setEditedOcrText}
                multiline
                autoFocus
              />
            ) : (
              <View style={styles.ocrTextContainer}>
                <Text style={styles.ocrText}>{document.ocrText}</Text>
              </View>
            )}
          </View>
        );
      case 'summary':
        return (
          <View style={styles.summaryContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Summary</Text>
              <TouchableOpacity 
                style={styles.aiButton}
                onPress={generateAiSummary}
                disabled={isGeneratingSummary}
              >
                <MaterialIcons name="auto-awesome" size={18} color="#1E88E5" />
                <Text style={styles.aiButtonText}>
                  {showAiSummary ? "Regenerate" : "Generate Summary"}
                </Text>
              </TouchableOpacity>
            </View>
            
            {isGeneratingSummary ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#1E88E5" />
                <Text style={styles.loadingText}>Generating summary...</Text>
              </View>
            ) : showAiSummary ? (
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryText}>{aiSummary}</Text>
              </View>
            ) : (
              <View style={styles.emptySummaryContainer}>
                <MaterialIcons name="auto-awesome" size={40} color="#e0e0e0" />
                <Text style={styles.emptySummaryText}>
                  Generate an AI summary of this document
                </Text>
              </View>
            )}
          </View>
        );
      case 'notes':
        return (
          <View style={styles.notesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notes</Text>
              {/* <TouchableOpacity 
                style={styles.saveNotesButton}
                onPress={handleSaveNotes}
              >

              </TouchableOpacity> */}
            </View>
            
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about this document..."
              multiline
            />
          </View>
        );
      default:
        return null;
    }
  };
  
  // Show loading state while fetching document
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D5F7C" />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // If document not found
  if (!document) {
    console.log('Document not found', document);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>Document not found</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        {isEditingTitle ? (
          <View style={styles.titleEditContainer}>
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              value={newTitle}
              onChangeText={setNewTitle}
              onBlur={saveTitle}
              onSubmitEditing={saveTitle}
              autoFocus
            />
            <TouchableOpacity onPress={saveTitle}>
              <MaterialIcons name="check" size={24} color="#2D5F7C" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.titleContainer}
            onPress={handleTitleEdit}
          >
            <Text style={styles.title}>{document.title}</Text>
            <MaterialIcons name="edit" size={18} color="#666" />
          </TouchableOpacity>
        )}
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleExport('PDF')}
          >
            <MaterialIcons name="picture-as-pdf" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleExport('Text')}
          >
            <MaterialIcons name="text-snippet" size={24} color="#2D5F7C" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Document Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Date: </Text>
            {formatDate(document.date)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Category: </Text>
            {document.category}
          </Text>
        </View>
        
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesWrapper}>
            {availableCategories.map(category => (
              <TouchableOpacity 
                key={category} 
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
                {selectedCategory === category && (
                  <MaterialIcons name="check" size={16} color="white" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'preview' && styles.activeTab]}
            onPress={() => setActiveTab('preview')}
          >
            <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'text' && styles.activeTab]}
            onPress={() => setActiveTab('text')}
          >
            <Text style={[styles.tabText, activeTab === 'text' && styles.activeTabText]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
            onPress={() => setActiveTab('summary')}
          >
            <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>Notes</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
        
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={saveDocument}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  titleEditContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: '500',
    color: '#666',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 300, // Make sure this is tall enough
  },
  documentImage: {
    width: '100%',
    height: '100%',
  },
  documentPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 12,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  previewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  previewActionText: {
    marginLeft: 4,
    color: '#2D5F7C',
    fontWeight: '500',
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  selectedCategoryChip: {
    backgroundColor: '#2D5F7C',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  selectedCategoryText: {
    color: 'white',
  },
  checkIcon: {
    marginLeft: 4,
  },
  ocrContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ocrActions: {
    flexDirection: 'row',
  },
  ocrActionButton: {
    marginLeft: 12,
    padding: 4,
  },
  ocrTextContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  ocrText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  ocrTextInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  notesContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  saveNotesButton: {
    backgroundColor: '#E8EEF2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  saveNotesText: {
    color: '#2D5F7C',
    fontSize: 12,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  bottomSpacing: {
    height: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2D5F7C',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#2D5F7C',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#2D5F7C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenScrollContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  saveButton: {
    backgroundColor: '#2D5F7C',
  },
  deleteButton: {
    backgroundColor: '#DC3545', // Red color for delete
    marginLeft: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  summaryTextContainer: {
    padding: 16,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
  },
  emptySummaryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySummaryText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 12,
  },
  aiButton: {
    backgroundColor: '#2D5F7C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DocumentDetailScreen; 