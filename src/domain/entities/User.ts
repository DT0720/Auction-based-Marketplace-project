/**
 * @class User
 * @classdesc Represents a user
 */

export class User {
  /**
     * @constructor
     * @param {number} user_id - The unique identifier of the user
     * @param {string} name - The name of the user
     * @param {string} email - The email address of the user
     * @param {string} password - The password of the user
     * @param {number} age - The age of the user
     * @param {number} gender - The gender of the user
     * @param {string | null} secondaryEmail - The secondary email address of the user
     * @param {string} type - The type of the user (e.g., admin, customer)
     * @param {string} phone - The phone number of the user
     * @param {string} photo - The photo URL of the user
     */
    constructor(
      public user_id: number,
      public name: string,
      public email: string,
      public password: string,
      public age: number,
      public gender: number,
      public secondaryEmail: string | null,
      public type: string,
      public phone: string,
      public photo: string, // Nullable blob to hold binary data
    ) {}
     /**
     * Creates a `User` instance from a JSON object
     * @param {any} data - The JSON object containing user data
     * @returns {User} - The User instance created from the JSON data
     */
  
    static fromJson(data : any) : User{
      return new User(
        data.user_id,
        data.name,
        data.email,
        data.password,
        data.age,
        data.gender,
        data.secondaryEmail,
        data.type,
        data.phone,
        data.photo
      );
    }
    
    toJson(): any {
      return {
        user_id: this.user_id,
        name: this.name,
        email: this.email,
        password: this.password,
        age: this.age,
        gender: this.gender,
        secondaryEmail: this.secondaryEmail,
        type: this.type,
        phone: this.phone,
        photo: this.photo,
      };
    }
    
}
  