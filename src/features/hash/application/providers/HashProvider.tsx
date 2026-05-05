import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";

import { HashRepositoryImp } from "../../infrastructure/repository/HashRepository";
import { HashDatasourceImp } from "../../infrastructure/datasources/HashDatasource";
import { HashResult } from "../../domain/entities/Hashes";

interface HashStateContextType {
  hashes: HashResult[];
}

interface HashActionsContextType {
  addCommunityHash: (id: string, hash: string) => void;
  getCommunityHashes: () => Promise<HashResult[]>;
}

// Contextos separados
const HashStateContext = createContext<HashStateContextType | undefined>(
  undefined,
);
const HashActionsContext = createContext<HashActionsContextType | undefined>(
  undefined,
);

// Providers para los contextos
export const HashStateProvider: React.FC<{
  children: React.ReactNode;
  value: HashStateContextType;
}> = ({ children, value }) => (
  <HashStateContext.Provider value={value}>
    {children}
  </HashStateContext.Provider>
);

export const HashActionsProvider: React.FC<{
  children: React.ReactNode;
  value: HashActionsContextType;
}> = ({ children, value }) => (
  <HashActionsContext.Provider value={value}>
    {children}
  </HashActionsContext.Provider>
);

// Hooks para consumir los contextos
export const useHashState = (): HashStateContextType => {
  const context = useContext(HashStateContext);

  if (!context)
    throw new Error("useHashState must be used within HashStateProvider");

  return context;
};

export const useHashActions = (): HashActionsContextType => {
  const context = useContext(HashActionsContext);

  if (!context)
    throw new Error("useHashActions must be used within HashActionsProvider");

  return context;
};

export const HashProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hashDatasource = new HashDatasourceImp();
  const hashRepository = new HashRepositoryImp(hashDatasource);
  const [hashes, setHashes] = useState<HashResult[]>([]);

  const addCommunityHash = useCallback(
    async (id: string, hash: string) => {
      const { toast } = await import("@heroui/react");
      toast.promise(hashRepository.addCommunityHash(id, hash), {
        error: "Error al añadir el torrent",
        loading: "Añadiendo el torrent",
        success(data) {
          return data > 0
            ? "Torrent añadido"
            : data === -1
              ? "Error al añadir el torrent"
              : "El torrent ya existe";
        },
      })
    },
    [hashRepository],
  );

  const getCommunityHashes = useCallback(async () => {
    const data = await hashRepository.getCommunityHashes()

    setHashes(data);

    return data;
  }, [hashRepository]);

  // Valores memoizados para los contextos separados
  const hashStateValue = useMemo(
    () => ({
      hashes,
    }),
    [hashes],
  );

  const hashActionsValue = useMemo(
    () => ({
      addCommunityHash,
      getCommunityHashes,
    }),
    [addCommunityHash, getCommunityHashes],
  );

  return (
    <HashStateProvider value={hashStateValue}>
      <HashActionsProvider value={hashActionsValue}>
        {children}
      </HashActionsProvider>
    </HashStateProvider>
  );
};
