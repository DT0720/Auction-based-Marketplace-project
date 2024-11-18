export class UserAuthException extends Error {

    public statusCode?: number;

    constructor(message: string, statusCode?: number) {
      super(message); // Pass the message to the parent Error class
      this.name = 'UserAuthException'; // Set the exception name
      if(statusCode) this.statusCode = statusCode;
      Object.setPrototypeOf(this, UserAuthException.prototype); // Restore the prototype chain
    }
}