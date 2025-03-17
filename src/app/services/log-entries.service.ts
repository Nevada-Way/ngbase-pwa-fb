import { Injectable } from '@angular/core';
import { MyAppLogModel } from '../models/log.model';
import { FirestoreService } from './firestore.service';
import { Firestore, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LogEntriesService extends FirestoreService {
  ///////////////////////////////////////////////////////////////////
  // This service is focused on app specific CRUD methods        //
  // In this sepcific service the methods are for CRUD           //
  // to manage the log entries (crteate,read, update, delete logs) //
  ///////////////////////////////////////////////////////////////////

  // The reason the methods in FirestoreService are 'protected'
  // is so that we can seperate them from the app (Seperation of concerns).
  //
  // That way if we ever want to switch from Firebase to
  // another data source (even local filesystem) we just need to
  // extend this class LogEntriesService by another service
  // that has identical method name and arguments (interface).

  constructor(firestore: Firestore) {
    super(firestore); //Calling the base class constructor
  }

  /**
   * Adds a new log entry to the specified Firestore collection.
   *
   * This method creates a new log entry object with the provided user ID, log message,
   * and current timestamp, and then adds it to the Firestore collection named by
   * the input params.
   * It utilizes the generic `createDocument` method from firestore.service.ts file.
   *
   * @param collectionName The name of the Firestore collection to add the log entry to.
   * @param userIdNumber The user ID number associated with the log entry.
   * @param logMessage The message content of the log entry.
   * @returns A Promise that resolves with the ID of the newly created log entry document.
   */
  public async addNewLogEntry(
    collectionName: string,
    userIdNumber: number,
    logMessage: string
    //addTimestamp: boolean
  ): Promise<string> {
    const logObject: MyAppLogModel = {
      logUserIdNumber: userIdNumber,
      logMessage: logMessage,
      logTimestamp: Timestamp.now(), // Add or overwrite timeLogged with the timestamp
    };

    const result: Promise<string> = this.createDocument(
      collectionName,
      logObject,
      false // true to auto create a timestamp, otherwise no timestamp
    );
    return result;
  }

  /**
   * Retrieves a log item by its document ID.
   *
   * This method fetches a specific log item from Firestore using the provided document ID.
   * It utilizes the inherited `getDocument` method from `FirestoreService`.
   *
   * @param docItemId The document ID of the log item to retrieve.
   * @returns A Promise that resolves with the `MyAppLogModel` if found, or `null` if not found or an error occurs.
   * @throws Errors logged to the console if there are issues retrieving the document.
   */
  public async getLogItemById(
    docItemId: string
  ): Promise<MyAppLogModel | null> {
    try {
      const logItemDoc =
        /*We use 'this' because this class 'DataAccessService' extends FirestoreService */
        await this.getDocument<MyAppLogModel>(docItemId); // old example: 'budget/ni3RFtRqRuRWalX3gVBQ'

      console.log('getLogItemById() is returning this :', logItemDoc);
      return logItemDoc;
    } catch (error) {
      console.error('Error trying to get a doc using getLogItemById:', error);
      return null; // Return null to indicate failure
    }
  }

  /**
   * Updates an existing log item in Firestore.
   *
   * This method updates the log item with the specified document ID using the provided
   * partial data. It automatically adds or updates the `logTimestamp` field with the
   * current timestamp. It utilizes the `updateDocument` method to perform the Firestore update.
   *
   * If the update succeeds then this method returns a Promise void.
   * The only other option if not successful is an error.
   *
   * To invoke this method use an async method with
   * try { await this.deleteDocument(docPath); ... }
   * catch (error) { console.log.. or whatever action for error case }
   *
   *
   * @param docItemId The document ID of the log item to update.
   * @param newItemData The partial data to update the log item with.
   * @returns A void Promise that resolves when the update is successful.
   * @throws An error if the update fails.
   */
  public async updateLogItem(
    docItemId: string,
    newItemData: Partial<MyAppLogModel>
  ): Promise<void> {
    newItemData.logTimestamp = Timestamp.now();
    try {
      await this.updateDocument<MyAppLogModel>(
        docItemId /* 'budget/ni3RFtRqRuRWalX3gVBQ' */,
        newItemData
      );
      console.log('updateLogItem() updated successfully : ', newItemData);
    } catch (error) {
      console.error(`Error updating log item id "${docItemId}" :`, error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }

  /**
   * Deletes a log item by its document ID.
   *
   * This method attempts to delete a log item from Firestore using the provided document ID.
   * It utilizes the `deleteDocument` method to perform the Firestore operation.
   * If it succeeds it returns a void, so having the async await in the calling method
   * finish waiting means update was successful.
   *
   * The only other option if not successful is an error.
   *
   * To invoke it use an async method with
   * try { await this.deleteDocument(docPath); ... }
   * catch (error) { console.log.. or whatever action for error case }
   *
   * @param docItemId The document ID of the log item to delete.
   * @returns A Promise that resolves with `void` if the deletion is successful, or `null` if an error occurs.
   * @throws Errors logged to the console if there are issues deleting the document.
   */
  public async deleteLogItem(docItemId: string): Promise<void | null> {
    try {
      const deletedItemReply = await this.deleteDocument(docItemId);

      console.log('deleteLogEntry() is returning this :', deletedItemReply);
      return deletedItemReply;
    } catch (error) {
      console.error('Error trying to get a doc using getLogItemById:', error);
      return null; // Return null to indicate failure
    }
  }
}
