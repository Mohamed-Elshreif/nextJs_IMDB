import { useState, useEffect } from "react";

import { database } from "../services/firebase";
import { UnformattedWatchlist, Watchlist } from "../types/watchlist/watchlist";
import { useAuth } from "./useAuth";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Watchlist[]>();
  const { user } = useAuth();

  useEffect(() => {
    const getData = async () => {
      const watchlistRef = await database.ref(`watchlists/${user?.id}`);
      watchlistRef.on("value", async (watchlist) => {
        const databaseWatchlist = await watchlist.val();
        const firebaseWatchlist: UnformattedWatchlist = databaseWatchlist ? databaseWatchlist.watchlist : {};
        const parsedQuestions = Object.entries(firebaseWatchlist).map(
          ([key, value]) => {
            return {
              id: key,
              backdrop_path: value.backdrop_path,
              item_id: value.id,
              isWatched: value.isWatched,
              poster_path: value.poster_path,
              type: value.type,
              title: value.title,
            };
          }
        );
        setWatchlist(parsedQuestions as any);
      })
    }
    getData();
  }, [user?.id]);
  return watchlist;
}
