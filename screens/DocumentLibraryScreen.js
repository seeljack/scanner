import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { DocumentStore } from '../DocumentStore';
import { CATEGORIES } from '../constants/Categories';

// Mock data for documents
const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Invoice #1234',
    date: '2023-05-15',
    category: 'Invoices',
    preview: null,
    lastViewed: '2023-06-01'
  },
  {
    id: '2',
    title: 'Receipt - Office Supplies',
    date: '2023-05-10',
    category: 'Receipts',
    preview: null,
    lastViewed: '2023-05-20'
  },
  {
    id: '3',
    title: 'Rental Agreement',
    date: '2023-04-01',
    category: 'Contracts',
    preview: null,
    lastViewed: '2023-05-15'
  },
  {
    id: '4',
    title: 'Driver License',
    date: '2023-03-15',
    category: 'IDs',
    preview: null,
    lastViewed: '2023-04-10'
  },
  {
    id: '5',
    title: 'Meeting Notes',
    date: '2023-05-05',
    category: 'Notes',
    preview: null,
    lastViewed: '2023-05-06'
  },
  {
    id: '6',
    title: 'Internet Bill',
    date: '2023-05-20',
    category: 'Invoices',
    preview: null,
    lastViewed: '2023-05-21'
  },
  {
    id: '7',
    title: 'Health Insurance',
    date: '2023-02-10',
    category: 'Contracts',
    preview: null,
    lastViewed: '2023-03-15'
  },
  {
    id: '8',
    title: 'Project Proposal',
    date: '2023-05-18',
    category: 'Notes',
    preview: null,
    lastViewed: '2023-05-19'
  }
];

const DocumentLibraryScreen = ({ navigation, route }) => {
  // Get the refresh parameters
  const refreshTimestamp = route?.params?.refreshTimestamp || 0;
  const newDocumentId = route?.params?.newDocumentId;

  // Initialize with empty array instead of MOCK_DOCUMENTS
  const [documents, setDocuments] = useState([]);

  // Add this useEffect to load documents from DocumentStore
  useEffect(() => {
    const docs = DocumentStore.getDocuments();
    setDocuments(docs);
  }, [refreshTimestamp]); // This will reload documents when refreshTimestamp changes

  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('date'); // 'date', 'name', 'recent'
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Filter documents based on search query and selected category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      doc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Sort documents based on selected sort option
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortOption) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'recent':
        return new Date(b.lastViewed) - new Date(a.lastViewed);
      default:
        return 0;
    }
  });

  // Handle document actions
  const handleRename = (id) => {
    Alert.alert('Rename Document', 'This would open a rename dialog in the full implementation.');
  };

  const handleMove = (id) => {
    Alert.alert('Move Document', 'This would open a folder selection dialog in the full implementation.');
  };

  const handleTag = (id) => {
    Alert.alert('Tag Document', 'This would open a tag selection dialog in the full implementation.');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter(doc => doc.id !== id));
          }
        }
      ]
    );
  };

  const handleExport = (id) => {
    Alert.alert('Export Document', 'This would open a share sheet in the full implementation.');
  };

  const handleScan = () => {
    navigation.navigate('Scan', {
      isNewDocument: true
    });
  };

  const handleSettings = () => {
    navigation.navigate('Setting');
  };

  // Handle document selection
  const handleDocumentSelect = (document) => {
    // Navigate to document detail screen with the document ID
    navigation.navigate('DocumentDetail', { documentId: document.id });
  };

  // Render document item based on view mode
  const renderDocumentItem = ({ item }) => {
    console.log('Rendering document with preview:', item.preview); // Debug log
    
    return (
      <TouchableOpacity 
        style={isGridView ? styles.gridItem : styles.listItem}
        onPress={() => handleDocumentSelect(item)}
      >
        <View style={isGridView ? styles.gridItemContent : styles.listItemContent}>
          <View style={[
            styles.documentPreview,
            isGridView && styles.gridDocumentPreview
          ]}>
            {item.preview ? (
              <Image
                source={{ uri: item.preview }}
                style={styles.documentImage}
                resizeMode="cover"
                onError={(error) => console.log('Image loading error:', error)} // Debug log
              />
            ) : (
              <MaterialIcons name="description" size={50} color="#9e9e9e" />
            )}
          </View>
          
          <View style={isGridView ? styles.gridItemDetails : styles.listItemDetails}>
            <Text style={styles.documentTitle} numberOfLines={isGridView ? 2 : 1}>
              {item.title}
            </Text>
            
            {!isGridView && (
              <View style={styles.listItemMeta}>
                <Text style={styles.documentDate}>{formatDate(item.date)}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>
            )}
            
            {isGridView && (
              <Text style={styles.documentDate}>{formatDate(item.date)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Helper function to get icon for category
  const getCategoryIcon = (category) => {
    const categoryObj = CATEGORIES.find(cat => 
      cat.name.toLowerCase() === category.toLowerCase()
    );
    return categoryObj ? categoryObj.icon : 'folder';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.title}>SmartScanAI</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsGridView(!isGridView)}
          >
            <MaterialIcons 
              name={isGridView ? 'list' : 'grid-view'} 
              size={24} 
              color="#1E88E5" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <MaterialIcons name="sort" size={24} color="#1E88E5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleSettings}
          >
            <MaterialIcons name="settings" size={24} color="#1E88E5" />
          </TouchableOpacity>
        </View>
      </View>
      
      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'date' && styles.selectedSortOption]}
            onPress={() => {
              setSortOption('date');
              setShowSortOptions(false);
            }}
          >
            <MaterialIcons name="calendar-today" size={18} color={sortOption === 'date' ? "#4CAF50" : "#666"} />
            <Text style={[styles.sortOptionText, sortOption === 'date' && styles.selectedSortOptionText]}>Date</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'name' && styles.selectedSortOption]}
            onPress={() => {
              setSortOption('name');
              setShowSortOptions(false);
            }}
          >
            <MaterialIcons name="sort-by-alpha" size={18} color={sortOption === 'name' ? "#4CAF50" : "#666"} />
            <Text style={[styles.sortOptionText, sortOption === 'name' && styles.selectedSortOptionText]}>Name</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'recent' && styles.selectedSortOption]}
            onPress={() => {
              setSortOption('recent');
              setShowSortOptions(false);
            }}
          >
            <MaterialIcons name="access-time" size={18} color={sortOption === 'recent' ? "#4CAF50" : "#666"} />
            <Text style={[styles.sortOptionText, sortOption === 'recent' && styles.selectedSortOptionText]}>Recently Viewed</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContentContainer}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? "#4CAF50" : "#666"} 
              />
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.selectedCategoryButtonText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.contentContainer}>
        {sortedDocuments.length > 0 ? (
          <FlatList
            data={sortedDocuments}
            renderItem={renderDocumentItem}
            keyExtractor={item => item.id}
            numColumns={isGridView ? 2 : 1}
            key={isGridView ? 'grid' : 'list'}
            contentContainerStyle={isGridView ? styles.gridContainer : styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="folder-open" size={80} color="#e0e0e0" />
            <Text style={styles.emptyText}>No documents found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Tap the scan button to add documents'}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={handleScan}
      >
        <MaterialIcons name="camera-alt" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const gridItemWidth = (width - 48) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D5F7C',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  categoriesWrapper: {
    backgroundColor: 'white',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    height: 50,
  },
  categoriesContentContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    height: 36,
  },
  selectedCategoryButton: {
    backgroundColor: '#E8EEF2',
  },
  categoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryButtonText: {
    color: '#2D5F7C',
    fontWeight: '500',
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedSortOption: {
    backgroundColor: '#E8EEF2',
  },
  sortOptionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  selectedSortOptionText: {
    color: '#2D5F7C',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  listContainer: {
    paddingBottom: 80,
  },
  gridItem: {
    width: gridItemWidth,
    margin: 6,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  listItem: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  gridItemContent: {
    padding: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  documentPreview: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridDocumentPreview: {
    width: '100%',
    height: 120,
  },
  documentImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  gridItemDetails: {
    flex: 1,
  },
  listItemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#757575',
  },
  listItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: '#E8EEF2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#2D5F7C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 8,
    textAlign: 'center',
  },
  scanButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D5F7C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default DocumentLibraryScreen; 