import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - direct values for testing
const firebaseConfig = {
  apiKey: "AIzaSyBiHgN2QEl26kfQEJfmiwWcUlIr1tohAWE",
  authDomain: "chat-application-c569c.firebaseapp.com",
  projectId: "chat-application-c569c",
  storageBucket: "chat-application-c569c.firebasestorage.app",
  messagingSenderId: "113327722670",
  appId: "1:113327722670:web:c004df38ff7e1344fbdd3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with specific settings for better performance and reliability
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // This can help with some connection issues
});

// Try to enable persistence (might not work in all browsers)
enableIndexedDbPersistence(db).catch((err) => {
  console.error("Error enabling persistence:", err.code, err.message);
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.log("Multiple tabs open. Persistence only works in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.log("This browser doesn't support persistence.");
  }
});

const storage = getStorage(app);

// ===== Authentication Functions =====

// Sign up a new user
export const signUpUser = async (email, password, displayName) => {
  try {
    console.log("Creating user with email:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("User created successfully:", user.uid);
    
    // Update the user profile with the displayName
    console.log("Updating user profile with displayName:", displayName);
    await updateProfile(user, { displayName });
    
    // Use try-catch specifically for Firestore operation
    try {
      // Create a user document in Firestore
      console.log("Creating user document in Firestore");
      const userData = {
        uid: user.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        isOnline: true
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log("User document created successfully");
    } catch (firestoreError) {
      // Log Firestore error but don't fail the signup
      console.error("Firestore document creation failed:", firestoreError);
      console.log("User was created but Firestore document creation failed");
    }
    
    return user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Sign in an existing user
export const signInUser = async (email, password) => {
  try {
    console.log("Signing in user with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("User signed in successfully:", user.uid);
    
    // Use try-catch specifically for Firestore operation
    try {
      // Update user status in Firestore
      console.log("Updating user status in Firestore");
      await updateDoc(doc(db, 'users', user.uid), {
        lastSeen: serverTimestamp(),
        isOnline: true
      });
      console.log("User status updated successfully");
    } catch (firestoreError) {
      // Log Firestore error but don't fail the signin
      console.error("Firestore status update failed:", firestoreError);
      console.log("User is signed in but Firestore status update failed");
    }
    
    return user;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

// Sign out the current user
export const signOutUser = async () => {
  try {
    const user = auth.currentUser;
    
    if (user) {
      // Update user status in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        lastSeen: serverTimestamp(),
        isOnline: false
      });
    }
    
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ===== Firestore Data Operations =====

// User Operations

// Get a user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Update a user profile
export const updateUserProfile = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Search users by displayName
export const searchUsers = async (searchTerm) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Contact Operations

// Add a user to contacts
export const addContact = async (currentUserId, contactUserId) => {
  try {
    // Create a contact document in the current user's contacts subcollection
    await setDoc(doc(db, 'users', currentUserId, 'contacts', contactUserId), {
      uid: contactUserId,
      createdAt: serverTimestamp()
    });
    
    // Create a contact document in the contact user's contacts subcollection
    await setDoc(doc(db, 'users', contactUserId, 'contacts', currentUserId), {
      uid: currentUserId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Get all contacts of a user
export const getUserContacts = async (userId) => {
  try {
    const contactsCollection = collection(db, 'users', userId, 'contacts');
    const querySnapshot = await getDocs(contactsCollection);
    
    const contacts = [];
    
    for (const doc of querySnapshot.docs) {
      const contactData = doc.data();
      // Get the contact user's profile data
      const userDoc = await getDoc(doc(db, 'users', contactData.uid));
      
      if (userDoc.exists()) {
        contacts.push({
          id: userDoc.id,
          ...userDoc.data()
        });
      }
    }
    
    return contacts;
  } catch (error) {
    throw error;
  }
};

// Remove a contact
export const removeContact = async (currentUserId, contactUserId) => {
  try {
    // Remove from current user's contacts
    await deleteDoc(doc(db, 'users', currentUserId, 'contacts', contactUserId));
    
    // Remove from contact user's contacts
    await deleteDoc(doc(db, 'users', contactUserId, 'contacts', currentUserId));
  } catch (error) {
    throw error;
  }
};

// Message Operations

// Create or get a chat between two users
export const createOrGetChat = async (userIds) => {
  try {
    // Sort user IDs to ensure consistent chat ID regardless of who initiates
    const sortedUserIds = [...userIds].sort();
    const chatId = sortedUserIds.join('_');
    
    // Check if chat exists
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    
    if (!chatDoc.exists()) {
      // Create a new chat document
      await setDoc(doc(db, 'chats', chatId), {
        participants: sortedUserIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return chatId;
  } catch (error) {
    throw error;
  }
};

// Send a message in a chat
export const sendMessage = async (chatId, senderId, content) => {
  try {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    
    await setDoc(doc(messagesCollection), {
      senderId,
      content,
      createdAt: serverTimestamp(),
      read: false
    });
    
    // Update the chat's lastMessage and updatedAt
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: content,
      lastMessageSenderId: senderId,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(
      messagesCollection,
      where('senderId', '!=', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const batch = [];
    querySnapshot.forEach((doc) => {
      batch.push(updateDoc(doc.ref, { read: true }));
    });
    
    await Promise.all(batch);
  } catch (error) {
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (chatId, messageId) => {
  try {
    await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
  } catch (error) {
    throw error;
  }
};

// ===== Real-time Listeners =====

// Subscribe to user online status
export const subscribeToUserStatus = (userId, callback) => {
  const userDoc = doc(db, 'users', userId);
  return onSnapshot(userDoc, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

// Subscribe to user's chats
export const subscribeToUserChats = (userId, callback) => {
  const chatsCollection = collection(db, 'chats');
  const q = query(
    chatsCollection,
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const chats = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    callback(chats);
  });
};

// Subscribe to messages in a chat
export const subscribeToMessages = (chatId, callback) => {
  const messagesCollection = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesCollection, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};

// Subscribe to typing indicators
export const subscribeToTypingIndicator = (chatId, callback) => {
  const typingDoc = doc(db, 'chats', chatId, 'typing', 'status');
  
  return onSnapshot(typingDoc, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback({});
    }
  });
};

// Set typing indicator
export const setTypingIndicator = async (chatId, userId, isTyping) => {
  try {
    const typingDoc = doc(db, 'chats', chatId, 'typing', 'status');
    
    if (isTyping) {
      await setDoc(typingDoc, {
        [userId]: serverTimestamp()
      }, { merge: true });
    } else {
      await updateDoc(typingDoc, {
        [userId]: null
      });
    }
  } catch (error) {
    throw error;
  }
};

// Export Firebase instances
export { app, auth, db, storage };

/* 
=== INSTRUCTIONS FOR SETTING UP FIREBASE PROJECT ===

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Add a web app to your project
4. Register the app and get your Firebase configuration
5. Create a .env.local file in the project root and add the following:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

6. Enable Authentication methods in the Firebase console:
   - Email/Password

7. Set up Firestore Database:
   - Create database
   - Start in test mode for development
   - Choose a location close to your users

8. Set up Storage:
   - Initialize Storage
   - Start in test mode for development

*/