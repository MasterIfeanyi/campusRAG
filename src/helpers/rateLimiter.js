// Simple in-memory rate limiter.

const requestLog = new Map();

/**  So the whole function is really just: "find or create this person's index card,
 * check if their window expired and reset it if so, log this request against them,
 * then tell the caller whether they're still allowed through."
 *
 */

function checkLimit(identifier, { limit, windowMs }) {
// Grabs the current time, as a number (milliseconds since Jan 1, 1970)
  const now = Date.now();
  const key = identifier; // "look up this key."
  const entry = requestLog.get(key) || { count: 0, resetAt: now + windowMs }; // do we already have a record for this person?" If yes, we get their existing record; If no record exists - we create a brand new one

  // if their time has expired, wipe the slate clean and give them a fresh window starting now.
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  // Every time this function runs, it means someone made a request, so we bump their count up by 1 and save that updated card back
  entry.count += 1;
  requestLog.set(key, entry);

  return {
    allowed: entry.count <= limit, // are they still under the limit? Yes / No
    // how many requests they have left before hitting the limit (never shown as a negative number, thanks to Math.max(0, ...))
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt, // useful if you ever want to tell the user "try again in X seconds"
  };
}

// General API limiter — used across most routes
export function apiLimiter(identifier) {
  return checkLimit(`api:${identifier}`, { limit: 20, windowMs: 2 * 60 * 1000 }); // 20 per 2 min
}

// Limiter for submitting a review — costs an AI embedding call
export function submitReviewLimiter(identifier) {
  return checkLimit(`submit-review:${identifier}`, { limit: 5, windowMs: 60 * 1000 }); // 5 per min
}

// Limiter for asking a question — costs an embedding + a Gemma generation call
export function askQuestionLimiter(identifier) {
  return checkLimit(`ask-question:${identifier}`, { limit: 5, windowMs: 60 * 1000 }); // 10 per min
}

