import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

export function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

export function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing users file:", error);
    return false;
  }
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find((user) => user.email === email);
}

export function getUserByPhone(phone) {
  const users = getUsers();
  return users.find((user) => user.phone === phone);
}

export function getUserById(userId) {
  const users = getUsers();
  return users.find((user) => user.id === userId);
}

export function createUser(userData) {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    onboardingCompleted: false,
  };
  users.push(newUser);
  if (saveUsers(users)) {
    return newUser;
  }
  return null;
}

export function updateUser(userId, updates) {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return null;
  }
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  if (saveUsers(users)) {
    return users[userIndex];
  }
  return null;
}
