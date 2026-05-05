import { HashResult } from "../entities/Hashes";

export abstract class HashDatasource {
  abstract addCommunityHash(id: string, hash: string): Promise<number>;
  abstract getCommunityHashes(): Promise<HashResult[]>;
}
