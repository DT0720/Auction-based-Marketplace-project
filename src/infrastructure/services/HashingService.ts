import { IHashingService } from "@/application/services/IHashingService";
import argon2 from "argon2";

export class HashingService implements IHashingService {
    async hash(value: string): Promise<string> {
      return await argon2.hash(value);
    }
  
    async compare(value: string, hash: string): Promise<boolean> {
      return await argon2.verify(value, hash);
    }
}