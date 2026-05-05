import { HashResult } from "../../domain/entities/Hashes";
import { HashRepository } from "../../domain/repository/HashRepository";
import { HashDatasource } from "../../domain/datasources/HashDatasource";

export class HashRepositoryImp extends HashRepository {
  constructor(private readonly datasource: HashDatasource) {
    super();
  }

  addCommunityHash(id: string, hash: string): Promise<number> {
    return this.datasource.addCommunityHash(id, hash);
  }
  getCommunityHashes(): Promise<HashResult[]> {
    return this.datasource.getCommunityHashes();
  }
}
