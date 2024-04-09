// db.ts
import Dexie, { Table } from 'dexie';
import { Contact } from './components/App';

export class ContactsDexie extends Dexie {
  contacts!: Table<Contact, string>;

  constructor() {
    super('myDatabase');
    this.version(.1).stores({
      contacts: 'id, &name' // Primary key and indexed props
    });
  }
}

export const db = new ContactsDexie();