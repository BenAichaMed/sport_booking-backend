import User from '../models/User.js';
const safeStringify = (obj) => {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return; // Circular reference found, discard key
      }
      cache.add(value);
    }
    return value;
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(safeStringify(error));
    res.status(500).json({ message: 'Server error' });
  }
};
