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
    addTimestamp: boolean
  ): Promise<string> {
    try {
      const entryRef = ref(this.database, path);
      const newEntryRef = push(entryRef); // Creates a new entry reference with a unique key

      const newData = addTimestamp
        ? {
            ...data,
            timeStamped: serverTimestamp(), // Add or overwrite timeStamped with the server timestamp
          }
        : data;

      await set(newEntryRef, newData);

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
}
