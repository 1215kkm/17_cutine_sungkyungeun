import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

interface PartnerFormData {
  salonName: string;
  ownerName: string;
  phone: string;
  address: string;
  bookingUrl?: string;
  message?: string;
}

export async function submitPartnerApplication(data: PartnerFormData): Promise<string> {
  const docRef = await addDoc(collection(db, 'partnerApplications'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
