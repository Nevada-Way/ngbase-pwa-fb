import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  push,
  set,
  serverTimestamp,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RealtimeDbService {
  constructor(
    private database: Database /* Database is the name of FB RTDB */
  ) {}

  /**
   * Creates a new entry in a Realtime Database path.
   *
   * This function adds a new entry to the specified Realtime Database path.
   * It allows the option to automatically add a timestamp to the entry.
   *
   * @template T The type of the entry data.
   * @param path The Realtime Database path to add the entry to.
   * @param data The data for the new entry.
   * @param addTimestamp A boolean indicating whether to add a timestamp to the entry.
   * @returns A Promise that resolves with the key of the newly created entry.
   * @throws An error if the entry creation fails.
   */
  protected async createEntry<T>(
    path: string,
    data: T,
    addTimestamp: boolean, // Controls wether to add a timestamp to the entry
    useFbCustomId: boolean // Controls wether to use the 'path' as is or to use FB auto gen ID
  ): Promise<string> {
    try {
      // STEP-1: Do or Dont add a timestamp to the data entry
      // Reacting to the addTimestamp boolean wether to add a timestamp to the data entry or not
      const newData = addTimestamp
        ? {
            ...data,
            timeStamped: serverTimestamp(), // Add or overwrite timeStamped with the server timestamp
          }
        : data; //Case we dont opt for timestampo so the original input data is used

      // STEP-2: Create a placeholder reference to the inputed path
      const entryRef = ref(this.database, path);

      // STEP-3: Create the entry in the database
      let newEntryRef;
      if (useFbCustomId) {
        // STEP-3A : Case where we want FB to use its own uniqueID
        // Case where no unique id was in the function methos input so now we
        // will let Firebase create a unique key using the push() method.
        newEntryRef = push(entryRef); // Creates a new entry reference with a unique Firebase key
        await set(newEntryRef, newData);
      } else {
        // STEP-3B : Case where a custom ID is provided, so we use set() to create the entry with the custom ID
        // We create a new entry reference with the id in the inputed 'path' oarameter
        console.log('In option 3B, using The path is : ', path);
        newEntryRef = entryRef;
      }

      const newEntryKey = newEntryRef.key;

      if (!newEntryKey) {
        throw new Error(
          'Could not retrieve entry key from Realtime Database even though the entry was created successfully.'
        );
      }

      return newEntryKey;
    } catch (error) {
      console.error('Error creating Realtime Database entry:', error);
      throw error;
    }
  }

  protected async updateEntry<T>(path: string, data: T): Promise<void> {
    try {
      const entryRef = ref(this.database, path);
      await set(entryRef, data);
    } catch (error) {
      console.error('Error updating Realtime Database entry:', error);
      throw error;
    }
  }
}
