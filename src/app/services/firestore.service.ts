import { Injectable } from '@angular/core';
import {
  DocumentData,
  Firestore,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
//import { MyAppLogModel } from '../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /////////////////////////////////////////////////////
  // The generic  C R U D  firestore functions below //
  /////////////////////////////////////////////////////

  protected async createDocument<T extends DocumentData>(
    collectionName: string,
    docData: T, // Cannot be "partial<T>" must be the whole object <T>
    addTimestamp: boolean
  ): Promise<string> {
    try {
      const collectionRefrence = collection(this.firestore, collectionName);
      const newDocReference = doc(collectionRefrence); // Creates a new document reference with a unique ID

      const newDocData = addTimestamp
        ? {
            ...docData, // Include existing log data
            timeStamped: Timestamp.now(), // Add or overwrite timeLogged with the timestamp
          }
        : docData; //If did not choose timestamp then the input is the whole object

      await setDoc(newDocReference, newDocData);
      console.log(
        `Firestore doc was created successfully! But validating its ID value ...`
      );

      const newDocId = newDocReference.id; // Get the ID

      if (typeof newDocId !== 'string') {
        console.error(
          'Unexpected type (expected string type) of the Firestore document ID :',
          typeof newDocId,
          newDocId
        );
        throw new Error(
          'Could not retrieve document ID from Firestore even though the log entry was created successfully.'
        );
      }

      console.log(`The ID of the newly created Firestore doc is "${newDocId}"`);

      return newDocId; //Will always return a string
    } catch (error) {
      console.error('Error creating log entry:', error);
      throw error;
    }
  }

  /**
   * G E T   ( R E A D )   A    D O C U M E N T    F R O M    F I R E S T O R E
   * This function fetches a document from Firestore.
   * @param docPath
   * @returns
   */
  protected async getDocument<T>(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);

    if (docSnap.exists()) {
      return docSnap.data() as T; // Type assertion
    } else {
      return null;
    }
  }

  /**
   * U P D A  T E    A    D O C U M E N T    I N    F I R E S T O R E
   * This function updates a document in Firestore.
   * It has an input parameter for the data which can be a partial part of the data model
   * So the object sent can have less properties than the original object model and only
   * the properties that are sent will be updated.
   * @param docPath
   * @param docData
   */
  protected async updateDocument<T>(
    docPath: string,
    docData: Partial<T>
  ): Promise<void> {
    try {
      const docReference = doc(this.firestore, docPath);
      await updateDoc(docReference, docData);
      console.log('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }

  /**
   * D E L E T E     A     D O C U M E N T    F R O M     F I R E S T O R E
   * Creates a new expense log entry in the 'logs' collection.
   * XXX @param docData The data for the new log entry, conforming to the LogModel interface.
   * XXX @returns A Promise that resolves when the log entry is created successfully.
   * XXX @throws An error if the log entry creation fails.
   */

  /**
   * D E L E T E  A  D O C U M E N T  F R O M  F I R E S T O R E
   * This function deletes a document from Firestore.
   * @param docPath The path to the document to be deleted.
   */
  protected async deleteDocument(docPath: string): Promise<void> {
    try {
      const docReference = doc(this.firestore, docPath);
      await deleteDoc(docReference);
      console.log('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }
}
