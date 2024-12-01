/**
 * @class UserAuthException
 * @classdesc Custom exception class for user authentication errors
 * @extends {Error}
 */
export class UserAuthException extends Error {

    public statusCode?: number;
     /**
     * @constructor
     * @param {string} message - The error message
     * @param {number} [statusCode] - The optional status code for the error
     */

    constructor(message: string, statusCode?: number) {
      super(message); // Pass the message to the parent Error class
      this.name = 'UserAuthException'; // Set the exception name
      if(statusCode) this.statusCode = statusCode;
      Object.setPrototypeOf(this, UserAuthException.prototype); // Restore the prototype chain
    }
}