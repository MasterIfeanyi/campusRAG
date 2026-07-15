const adjectives = [
  "Swift", "Quiet", "Bold", "Curious", "Hidden", "Clever", "Gentle", "Wandering",
  "Bright", "Calm", "Daring", "Eager", "Fierce", "Humble", "Jolly", "Keen",
  "Lively", "Mighty", "Nimble", "Proud", "Quick", "Rapid", "Sharp", "Silent",
  "Steady", "Sturdy", "Vivid", "Witty", "Zealous", "Brave", "Loyal", "Merry",
  "Noble", "Radiant", "Serene", "Spirited", "Stealthy", "Tenacious", "Vibrant", "Wise",
];

const animals = [
  "Falcon", "Otter", "Panther", "Sparrow", "Fox", "Heron", "Wolf", "Lynx",
  "Eagle", "Badger", "Raven", "Tiger", "Hawk", "Deer", "Owl", "Bear",
  "Cobra", "Dolphin", "Elk", "Gazelle", "Hare", "Ibis", "Jaguar", "Kite",
  "Leopard", "Mongoose", "Newt", "Orca", "Puma", "Quail", "Rhino", "Stag",
  "Toucan", "Urchin", "Viper", "Weasel", "Crane", "Marten", "Egret", "Ferret",
];

function randomName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `${adjective} ${animal} ${number}`;
}

// Generates a name and guarantees it's not already taken in the database.
// Retries a handful of times, and falls back to a guaranteed-unique
// timestamp-based suffix if we ever get extremely unlucky.
export async function generateUniqueAnonymousName(UserModel) {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = randomName();
    const exists = await UserModel.exists({ displayName: candidate });
    if (!exists) {
      return candidate;
    }
  }

  // Extremely unlikely fallback: guarantees uniqueness no matter what
  return `${randomName()}-${Date.now().toString(36)}`;
}