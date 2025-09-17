import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'premiumRequests';

// Create a new premium request
export const createPremiumRequest = async (requestData, userId) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...requestData,
      userId,
      status: 'pending', // pending, approved, rejected
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Premium request created with ID: ', docRef.id);
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating premium request: ', error);
    throw new Error('Failed to submit premium request');
  }
};

// Get all premium requests (for admin)
export const getAllPremiumRequests = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching premium requests: ', error);
    throw new Error('Failed to fetch premium requests');
  }
};

// Get premium requests by user ID
export const getPremiumRequestsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching user premium requests: ', error);
    throw new Error('Failed to fetch your premium requests');
  }
};

// Update premium request status (for admin)
export const updatePremiumRequestStatus = async (requestId, status, adminNotes = '') => {
  try {
    const requestRef = doc(db, COLLECTION_NAME, requestId);
    
    await updateDoc(requestRef, {
      status,
      adminNotes,
      updatedAt: serverTimestamp(),
      reviewedAt: serverTimestamp()
    });
    
    console.log('Premium request status updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating premium request status: ', error);
    throw new Error('Failed to update request status');
  }
};

// Delete premium request (for admin)
export const deletePremiumRequest = async (requestId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, requestId));
    console.log('Premium request deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deleting premium request: ', error);
    throw new Error('Failed to delete premium request');
  }
};

// Get pending premium requests count (for admin dashboard)
export const getPendingRequestsCount = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching pending requests count: ', error);
    return 0;
  }
};

// Get premium requests statistics (for admin dashboard)
export const getPremiumRequestsStats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stats.total++;
      stats[data.status]++;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching premium requests stats: ', error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };
  }
};

export default {
  createPremiumRequest,
  getAllPremiumRequests,
  getPremiumRequestsByUser,
  updatePremiumRequestStatus,
  deletePremiumRequest,
  getPendingRequestsCount,
  getPremiumRequestsStats
};