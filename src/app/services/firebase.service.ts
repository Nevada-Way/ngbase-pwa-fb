import { Injectable } from '@angular/core';
import {
  Firestore,
  Timestamp,
  collection,
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { MyAppLogModel } from '../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /////////////////////////////////////////////////////
  // The generic  C R U D  firestore functions below //
  /////////////////////////////////////////////////////

  /**
   * C R E A T E    A    N E W    D O C U M E N T    I N     F I R E S T O R E
   * Creates a new expense log entry in the 'logs' collection.
   * @param logData The data for the new log entry, conforming to the LogModel interface.
   * @returns A Promise that resolves when the log entry is created successfully.
   * @throws An error if the log entry creation fails.
   */
  private async createLogEntry<T>(logData: Partial<T>): Promise<string> {
    try {
      const logsCollection = collection(this.firestore, 'logs');
      const newLogDocRef = doc(logsCollection); // Creates a new document reference with a unique ID

      const timestampedLogData = {
        ...logData, // Include existing log data
        timeLogged: Timestamp.now(), // Add or overwrite timeLogged with the timestamp
      };

      await setDoc(newLogDocRef, timestampedLogData);
      console.log('Log entry created successfully!');

      const logId = newLogDocRef.id; // Get the ID

      if (typeof logId !== 'string') {
        console.error('Unexpected document ID type:', typeof logId, logId);
        throw new Error(
          'Could not retrieve document ID even though the log entry was created successfully.'
        );
      }

      return newLogDocRef.id; //Will always return a string
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
  private async getDocument<T>(docPath: string): Promise<T | null> {
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
   * @param data
   */
  private async updateDocument<T>(
    docPath: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docReference = doc(this.firestore, docPath);
      await updateDoc(docReference, data);
      console.log('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }

  /**
   * D E L E T E     A     D O C U M E N T    F R O M     F I R E S T O R E
   * Creates a new expense log entry in the 'logs' collection.
   * XXX @param logData The data for the new log entry, conforming to the LogModel interface.
   * XXX @returns A Promise that resolves when the log entry is created successfully.
   * XXX @throws An error if the log entry creation fails.
   */
  //  private async deleteDocument<T>(...

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  // The public context relavent CRUD functions below //
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  public async getBudgetData(): Promise<MyAppLogModel | null> {
    try {
      const budgetData = await this.getDocument<MyAppLogModel>(
        'budget/ni3RFtRqRuRWalX3gVBQ' // 'cu0mTrel1L44YumvywFA'
      );
      console.log('getBudgetData() is returning this :', budgetData);
      return budgetData;
    } catch (error) {
      console.error('Error fetching budget data:', error);
      return null; // Return null to indicate failure
    }
  }

  public async updateBudgetData(data: Partial<MyAppLogModel>): Promise<void> {
    try {
      await this.updateDocument<MyAppLogModel>(
        'budget/ni3RFtRqRuRWalX3gVBQ', // 'cu0mTrel1L44YumvywFA',
        data
      );
      console.log('updateBudgetData() updated successfully : ', data);
    } catch (error) {
      console.error('Error updating budget data:', error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }

  public async logTheExpenseEntry(
    budgetBeforeExpense: number,
    expense: number
  ): Promise<string> {
    const result: Promise<string> = this.createLogEntry({
      preExpenseBudget: budgetBeforeExpense,
      expenseEntered: expense,
    });
    return result;
  }
}
