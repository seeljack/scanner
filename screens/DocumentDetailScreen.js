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
  SafeAreaView
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

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

const DocumentDetailScreen = ({ route, navigation }) => {
  // Get document ID from route params
  const documentId = route?.params?.documentId || '1';
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeTab, setActiveTab] = useState('preview');
  
  // Refs
  const titleInputRef = useRef(null);
  const ocrTextInputRef = useRef(null);
  
  // Fetch document data when component mounts
  useEffect(() => {
    // In a real app, you would fetch this from a database or API
    // For now, we'll use the mock data
    const fetchDocument = () => {
      setIsLoading(true);
      
      // Find the document in MOCK_DOCUMENTS by ID
      const foundDocument = MOCK_DOCUMENTS.find(doc => doc.id === documentId);
      
      if (foundDocument) {
        // Use the actual document data
        setDocument({
          ...foundDocument,
          ocrText: MOCK_OCR_TEXT, // This would come from the real document in a full implementation
          notes: ''
        });
        setNewTitle(foundDocument.title);
        setEditedOcrText(MOCK_OCR_TEXT);
        setNotes('');
        setSelectedTags(foundDocument.tags || []);
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
        setSelectedTags([]);
      }
      
      setIsLoading(false);
    };
    
    fetchDocument();
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
  
  // Add or remove tag
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
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
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <View style={styles.previewContainer}>
            <TouchableOpacity 
              style={styles.previewImageContainer}
              onPress={handleZoomInstructions}
            >
              <View style={styles.documentPreview}>
                <MaterialIcons name="description" size={80} color="#9e9e9e" />
                <Text style={styles.previewText}>Document Preview</Text>
                <Text style={styles.previewSubtext}>Tap to zoom</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={styles.previewActionButton}
                onPress={handleRescan}
              >
                <MaterialIcons name="refresh" size={20} color="#1E88E5" />
                <Text style={styles.previewActionText}>Re-scan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.previewActionButton}
                onPress={handleAddPage}
              >
                <MaterialIcons name="add-circle-outline" size={20} color="#1E88E5" />
                <Text style={styles.previewActionText}>Add Page</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
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
              <TouchableOpacity 
                style={styles.saveNotesButton}
                onPress={handleSaveNotes}
              >
                <Text style={styles.saveNotesText}>Save</Text>
              </TouchableOpacity>
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
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TouchableOpacity 
              style={styles.aiButton}
              onPress={getAiSuggestedTags}
            >
              <MaterialIcons name="auto-awesome" size={18} color="#1E88E5" />
              <Text style={styles.aiButtonText}>Suggest Tags</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagsWrapper}>
            {selectedTags.map(tag => (
              <TouchableOpacity 
                key={tag} 
                style={styles.tagChip}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.addTagButton}
              onPress={() => Alert.alert("Add Tag", "Add a custom tag to this document")}
            >
              <MaterialIcons name="add" size={20} color="#1E88E5" />
            </TouchableOpacity>
          </View>
          
          {showSuggestedTags && (
            <View style={styles.suggestedTagsContainer}>
              <Text style={styles.suggestedTagsTitle}>AI Suggested Tags:</Text>
              <View style={styles.suggestedTagsWrapper}>
                {suggestedTags.map(tag => (
                  <TouchableOpacity 
                    key={tag} 
                    style={[
                      styles.suggestedTagChip,
                      selectedTags.includes(tag) && styles.selectedSuggestedTagChip
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.suggestedTagText,
                      selectedTags.includes(tag) && styles.selectedSuggestedTagText
                    ]}>
                      {tag}
                    </Text>
                    {selectedTags.includes(tag) && (
                      <MaterialIcons name="check" size={16} color="#1E88E5" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
        
        {renderTabContent()}
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

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
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewImageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
  },
  documentPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 10,
  },
  previewSubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 5,
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
  tagsContainer: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EEF2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  aiButtonText: {
    color: '#2D5F7C',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EEF2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#2D5F7C',
    fontSize: 14,
    marginRight: 4,
  },
  addTagButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestedTagsContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  suggestedTagsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  suggestedTagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestedTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EEF2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSuggestedTagChip: {
    backgroundColor: '#E8EEF2',
  },
  suggestedTagText: {
    color: '#2D5F7C',
    fontSize: 14,
    marginRight: 4,
  },
  selectedSuggestedTagText: {
    color: '#2D5F7C',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  summaryTextContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptySummaryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptySummaryText: {
    marginTop: 8,
    color: '#9e9e9e',
    textAlign: 'center',
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
});

export default DocumentDetailScreen; 