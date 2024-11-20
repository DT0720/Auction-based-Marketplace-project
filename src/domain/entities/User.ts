export class User {
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
  