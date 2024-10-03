import { createHmac, randomBytes } from 'node:crypto';

export class Password {
  // Method to hash a password and return both the hashed password and the salt
  static async toHash(password: string) {
    const salt = randomBytes(32).toString('hex'); // Generate a salt
    const hashedPassword = createHmac('sha256', salt) // Hash the password with the salt
      .update(password)
      .digest('hex');

    return `${hashedPassword}.${salt}`; // Return both hash and salt
  }

  // Method to compare a supplied password with the stored password
  static async comparePassword(
    storedPassword: string,
    suppliedPassword: string
  ) {
    const [hashedPassword, salt] = storedPassword.split('.'); // Split the stored password to get the hash and salt
    const suppliedHashedPassword = createHmac('sha256', salt) // Hash the supplied password with the stored salt
      .update(suppliedPassword)
      .digest('hex');

    return hashedPassword === suppliedHashedPassword; // Compare the hashed passwords
  }
}
