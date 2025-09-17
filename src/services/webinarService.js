import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'webinars';

// Get all webinars
export const getAllWebinars = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const webinars = [];
    
    querySnapshot.forEach((doc) => {
      webinars.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return webinars;
  } catch (error) {
    console.error('Error fetching webinars: ', error);
    throw new Error('Failed to fetch webinars');
  }
};

// Get upcoming webinars (future dates only)
export const getUpcomingWebinars = async (limitCount = 5) => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, COLLECTION_NAME),
      where('date', '>', now),
      orderBy('date', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const webinars = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      webinars.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to JavaScript Date
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      });
    });
    
    return webinars;
  } catch (error) {
    console.error('Error fetching upcoming webinars: ', error);
    throw new Error('Failed to fetch upcoming webinars');
  }
};

// Get live webinars (currently happening)
export const getLiveWebinars = async () => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('date', '>=', Timestamp.fromDate(oneHourAgo)),
      where('date', '<=', Timestamp.fromDate(oneHourLater)),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const webinars = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      webinars.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      });
    });
    
    return webinars;
  } catch (error) {
    console.error('Error fetching live webinars: ', error);
    throw new Error('Failed to fetch live webinars');
  }
};

// Get next webinar (closest upcoming)
export const getNextWebinar = async () => {
  try {
    const upcoming = await getUpcomingWebinars(1);
    return upcoming.length > 0 ? upcoming[0] : null;
  } catch (error) {
    console.error('Error fetching next webinar: ', error);
    return null;
  }
};

// Format webinar date for display
export const formatWebinarDate = (date) => {
  if (!date) return 'TBD';
  
  const webinarDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffTime = webinarDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else {
    return webinarDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: webinarDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Format webinar time for display
export const formatWebinarTime = (date) => {
  if (!date) return 'TBD';
  
  const webinarDate = date instanceof Date ? date : new Date(date);
  return webinarDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Check if webinar is live
export const isWebinarLive = (date, duration = 60) => {
  if (!date) return false;
  
  const webinarDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const endTime = new Date(webinarDate.getTime() + duration * 60 * 1000);
  
  return now >= webinarDate && now <= endTime;
};

export default {
  getAllWebinars,
  getUpcomingWebinars,
  getLiveWebinars,
  getNextWebinar,
  formatWebinarDate,
  formatWebinarTime,
  isWebinarLive
};