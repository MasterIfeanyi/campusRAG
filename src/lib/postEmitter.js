import { EventEmitter } from "events";

// Global singleton EventEmitter to prevent duplicate instances during Next.js hot reloads in dev
const globalForEmitter = globalThis;

export const postEmitter = globalForEmitter.postEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEmitter.postEmitter = postEmitter;
}
