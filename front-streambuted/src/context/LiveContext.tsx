import { useMemo, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useArtistLive } from "../hooks/useArtistLive";
import { useLiveSocket } from "../hooks/useLiveSocket";
import { LiveContext, type LiveContextValue } from "./liveContextValue";

type LiveProviderProps = Readonly<{
  children: ReactNode;
}>;

export function LiveProvider({ children }: LiveProviderProps) {
  const { accessToken } = useAuth();
  const token = accessToken;
  const { socket, connectionState } = useLiveSocket(token);
  const artist = useArtistLive(socket);

  const value = useMemo<LiveContextValue>(
    () => ({
      token,
      socket,
      connectionState,
      artist,
    }),
    [token, socket, connectionState, artist]
  );

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}
