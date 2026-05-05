import { HashResult } from "../entities/Hashes";

export abstract class HashRepository {
  abstract addCommunityHash(id: string, hash: string): Promise<number>;
  abstract getCommunityHashes(): Promise<HashResult[]>;
}
