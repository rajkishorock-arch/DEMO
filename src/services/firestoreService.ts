import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt?: any;
  updatedAt?: any;
  progress: {
    activeRoutesCount: number;
    routesAtRiskCount: number;
    activeIncidentsCount: number;
    vehiclesInTransitCount: number;
  };
  profile: {
    role: string;
    region: string;
    organization: string;
  };
}

export interface ActivityItem {
  id?: string;
  route: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  timestamp?: any;
  reporter: string;
}

export interface ProgressLogItem {
  id?: string;
  title: string;
  details: string;
  status: string;
  timestamp?: any;
}

// 1. Create or update user document upon login / signup
export const createOrUpdateUserProfile = async (
  user: User,
  extraProfileData?: { fullName?: string }
): Promise<UserProfileData> => {
  if (!user || !user.uid) {
    throw new Error('User UID is missing.');
  }

  const userDocRef = doc(db, 'users', user.uid);
  const displayName =
    extraProfileData?.fullName ||
    user.displayName ||
    (user.email ? user.email.split('@')[0] : 'Logistics Dispatcher');

  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    // New User Initial Record - Genuine zero state
    const newUserData: UserProfileData = {
      uid: user.uid,
      displayName,
      email: user.email || '',
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      progress: {
        activeRoutesCount: 0,
        routesAtRiskCount: 0,
        activeIncidentsCount: 0,
        vehiclesInTransitCount: 0
      },
      profile: {
        role: 'Logistics Controller',
        region: 'North Eastern Region',
        organization: 'Smart NER Platform'
      }
    };

    await setDoc(userDocRef, newUserData);
    return newUserData;
  } else {
    // Returning User - return existing profile without triggering write operations
    return docSnap.data() as UserProfileData;
  }
};

// 2. Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  if (!uid) return null;
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfileData;
  }
  return null;
};

// 3. Update user profile
export const updateUserProfile = async (uid: string, data: Partial<UserProfileData>): Promise<boolean> => {
  if (!uid) return false;
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  return true;
};

// 4. Get user progress
export const getUserProgress = async (uid: string) => {
  const profile = await getUserProfile(uid);
  return profile?.progress || null;
};

// 5. Update user progress
export const updateUserProgress = async (
  uid: string,
  progressData: UserProfileData['progress']
): Promise<boolean> => {
  if (!uid) return false;
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, { progress: progressData, updatedAt: serverTimestamp() }, { merge: true });
  return true;
};

// 6. Add user activity (subcollection: users/{uid}/activities)
export const addUserActivity = async (uid: string, activity: ActivityItem): Promise<string | null> => {
  if (!uid) return null;
  const activitiesRef = collection(db, 'users', uid, 'activities');
  const docRef = await addDoc(activitiesRef, {
    ...activity,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

// 7. Get user activities (subcollection: users/{uid}/activities)
export const getUserActivities = async (uid: string): Promise<ActivityItem[]> => {
  if (!uid) return [];
  const activitiesRef = collection(db, 'users', uid, 'activities');
  const q = query(activitiesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const activities: ActivityItem[] = [];
  querySnapshot.forEach((docSnap) => {
    activities.push({
      id: docSnap.id,
      ...(docSnap.data() as ActivityItem)
    });
  });
  return activities;
};

// 8. Add user progress log item (subcollection: users/{uid}/progress)
export const addUserProgressLog = async (uid: string, progressItem: ProgressLogItem): Promise<string | null> => {
  if (!uid) return null;
  const progressRef = collection(db, 'users', uid, 'progress');
  const docRef = await addDoc(progressRef, {
    ...progressItem,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

// 9. Get user progress logs (subcollection: users/{uid}/progress)
export const getUserProgressLogs = async (uid: string): Promise<ProgressLogItem[]> => {
  if (!uid) return [];
  const progressRef = collection(db, 'users', uid, 'progress');
  const q = query(progressRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const logs: ProgressLogItem[] = [];
  querySnapshot.forEach((docSnap) => {
    logs.push({
      id: docSnap.id,
      ...(docSnap.data() as ProgressLogItem)
    });
  });
  return logs;
};
