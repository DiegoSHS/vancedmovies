import { HashResult } from "../../domain/entities/Hashes";
import { HashDatasource } from "../../domain/datasources/HashDatasource";

export class HashDatasourceImp extends HashDatasource {
  async addCommunityHash(id: string, hash: string): Promise<number> {
    try {
      const { ApiClient } = await import("@/utils/ApiClient");
      const url = `${import.meta.env.VITE_NEST_BACKEND_URL}/save_hash`;
      const result = await ApiClient.post<number>({
        path: url,
        body: {
          name: id,
          hash,
        },
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        overrideBaseURL: true,
      });

      if (result.error !== null) return -1;

      return result.data;
    } catch (e) {
      console.log("Error añadiendo el hash", e);

      return -1;
    }
  }
  async getCommunityHashes(): Promise<HashResult[]> {
    try {
      const { ApiClient } = await import("@/utils/ApiClient");
      const url = `${import.meta.env.VITE_NEST_BACKEND_URL}/get_hashes`;
      const result = await ApiClient.get<HashResult[]>({
        path: url,
        overrideBaseURL: true,
      });

      if (result.error !== null) return [];

      return result.data;
    } catch (e) {
      console.log("Error consiguiendo los hash", e);

      return [];
    }
  }
}
