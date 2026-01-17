// src/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { membersHandlers } from './usersHandlers.js';
import { listsHandlers } from './listsHandlers.js';
import { itemsHandlers } from './itemsHandlers.js';

// Combine all handlers
export const worker = setupWorker(
  ...membersHandlers,
  ...listsHandlers,
  ...itemsHandlers
);

