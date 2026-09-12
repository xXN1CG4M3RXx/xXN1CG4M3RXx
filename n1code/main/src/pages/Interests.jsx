import { useEffect, useState } from "react";
import { fetchCachedData } from "../lib/cache";
import { Gamepad2, Film, Sparkles, Star, Trophy, ExternalLink, PlayCircle } from "lucide-react";


import { sanitizeUrl } from "../lib/sanitize";

const SteamCard = ({ game }) => {
  const hours = game.playtime_forever !== undefined ? (game.playtime_forever / 60).toFixed(1) : (game.hours || 0);
  const imgUrl = game.isManual ? game.img_icon_url : `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;
  const fallbackImgUrl = game.isManual ? game.img_icon_url : `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

  return (
    <div className="glassmorphism rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 group flex flex-col transition-all hover-scale bg-slate-900/50">
      <div className="aspect-[460/215] w-full bg-slate-950 overflow-hidden relative">
        <img loading="lazy"
          src={imgUrl}
          alt={game.name}
          onError={(e) => { e.target.src = fallbackImgUrl; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
        {game.isFavorite && (
          <div className="absolute top-1.5 right-1.5 text-amber-400 drop-shadow-md text-lg z-10 leading-none">★</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-slate-200 line-clamp-1 mb-1" title={game.name}>{game.name}</h3>
        <p className="text-xs text-blue-400">{hours} hrs</p>
      </div>
    </div>
  );
};

const AnimeCard = ({ entry }) => {
  const media = entry.media || {};
  const title = media.title?.english || media.title?.romaji || "";
  const maxEps = media.episodes || "?";
  const progressPercent = media.episodes && entry.progress ? Math.round((entry.progress / media.episodes) * 100) : 0;

  return (
    <a
      key={entry.id}
      href={sanitizeUrl(media.siteUrl || "#")}
      target="_blank"
      rel="noopener noreferrer"
      className="glassmorphism rounded-xl overflow-hidden border border-slate-800 hover:border-sky-aqua-500/50 group flex flex-col transition-all hover-scale"
    >
      <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
        <img loading="lazy"
          src={media.coverImage?.large}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        {entry.isFavorite && (
          <div className="absolute top-1.5 right-1.5 text-amber-400 drop-shadow-md text-xl z-10 leading-none">★</div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 font-bold mb-1">
            <span>{entry.status === 'COMPLETED' ? 'Done' : `Ep ${entry.progress || '?'} / ${maxEps}`}</span>
            {media.averageScore && (
              <span className="text-emerald-400">★ {media.averageScore}%</span>
            )}
          </div>
          {media.episodes && entry.status !== 'COMPLETED' && (
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-aqua-400 h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1" title={title}>{title}</h3>
        {entry.manualDetails?.quote && (
          <p className="text-[10px] text-slate-400 line-clamp-2 italic mb-1">"{entry.manualDetails.quote}"</p>
        )}
        {entry.manualDetails?.favCharacter && (
          <p className="text-[10px] text-sky-aqua-400 line-clamp-1">Best: {entry.manualDetails.favCharacter}</p>
        )}
        {!entry.manualDetails && media.genres && media.genres.length > 0 && (
          <p className="text-[10px] text-slate-500 line-clamp-1">{media.genres.slice(0, 2).join(', ')}</p>
        )}
      </div>
    </a>
  );
};


export default function Interests() {
  const [activeTab, setActiveTab] = useState("gaming"); // "gaming" | "anime"
  const [gameFilter, setGameFilter] = useState("all"); // "all" | "playing" | "favorites"
  const [animeFilter, setAnimeFilter] = useState("all"); // "all" | "anime" | "manga"
  const [animeSort, setAnimeSort] = useState("name"); // "name" | "myRating" | "overallRating"
  const [gameSort, setGameSort] = useState("name"); // "name" | "playtime"
  
  const [steamGames, setSteamGames] = useState([]);
  const [steamLoading, setSteamLoading] = useState(false);
  const [visibleSteam, setVisibleSteam] = useState(10);

  
  const [interestsData, setInterestsData] = useState({
    games: [],
    anime: [],
    anilistUsername: "",
    anilistSyncEnabled: true,
    steamId: "",
    steamSyncEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [steamError, setSteamError] = useState(null);

  // AniList Live Feed State
  const [anilistWatchingAnime, setAnilistWatchingAnime] = useState([]);
  const [anilistWatchedAnime, setAnilistWatchedAnime] = useState([]);
  const [anilistReadingManga, setAnilistReadingManga] = useState([]);
  const [anilistReadManga, setAnilistReadManga] = useState([]);
  const [anilistFavoriteAnimeIds, setAnilistFavoriteAnimeIds] = useState(new Set());
  const [anilistFavoriteMangaIds, setAnilistFavoriteMangaIds] = useState(new Set());
  
  const [visibleAnime, setVisibleAnime] = useState(10);
  const [visibleManga, setVisibleManga] = useState(10);
  const [anilistLoading, setAnilistLoading] = useState(false);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const handleData = (data) => {
          if (data) {
            setInterestsData({
              games: data.games || [],
              anime: data.anime || [],
              anilistUsername: data.anilistUsername || "",
              anilistSyncEnabled: data.anilistSyncEnabled !== false,
              steamId: data.steamId || "",
              steamSyncEnabled: data.steamSyncEnabled !== false
            });
          }
        };
        const data = await fetchCachedData("interests", handleData);
        handleData(data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  // Fetch AniList live data if username is configured
  useEffect(() => {
    if (!interestsData.anilistUsername || !interestsData.anilistSyncEnabled) {
      setAnilistWatchingAnime([]);
      setAnilistWatchedAnime([]);
      setAnilistReadingManga([]);
      setAnilistReadManga([]);
      return;
    }

    const fetchAniList = async () => {
      setAnilistLoading(true);
      try {
        const query = `
          query ($userName: String) {
            anime: MediaListCollection(userName: $userName, type: ANIME) {
              lists {
                entries {
                  id progress score status updatedAt
                  media {
                    id title { romaji english }
                    coverImage { large }
                    episodes genres averageScore siteUrl
                  }
                }
              }
            }
            manga: MediaListCollection(userName: $userName, type: MANGA) {
              lists {
                entries {
                  id progress score status updatedAt
                  media {
                    id title { romaji english }
                    coverImage { large }
                    episodes: chapters genres averageScore siteUrl
                  }
                }
              }
            }
            User(name: $userName) {
              favourites {
                anime(page: 1, perPage: 50) { nodes { id } }
                manga(page: 1, perPage: 50) { nodes { id } }
              }
            }
          }
        `;

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { userName: interestsData.anilistUsername.trim() }
          })
        });

        const resData = await response.json();
        
        const animeLists = resData?.data?.anime?.lists || [];
        const mangaLists = resData?.data?.manga?.lists || [];
        const flatAnime = animeLists.flatMap(list => list.entries);
        const flatManga = mangaLists.flatMap(list => list.entries);
        
        const favAnime = resData?.data?.User?.favourites?.anime?.nodes?.map(n => n.id) || [];
        const favManga = resData?.data?.User?.favourites?.manga?.nodes?.map(n => n.id) || [];
        setAnilistFavoriteAnimeIds(new Set(favAnime));
        setAnilistFavoriteMangaIds(new Set(favManga));

        setAnilistWatchingAnime(flatAnime.filter(e => e.status === 'CURRENT'));
        setAnilistWatchedAnime(flatAnime.filter(e => e.status !== 'CURRENT'));
        
        setAnilistReadingManga(flatManga.filter(e => e.status === 'CURRENT'));
        setAnilistReadManga(flatManga.filter(e => e.status !== 'CURRENT'));
      } catch (err) {
        console.error("Failed to fetch AniList live data:", err);
      } finally {
        setAnilistLoading(false);
      }
    };

    fetchAniList();
  }, [interestsData.anilistUsername, interestsData.anilistSyncEnabled]);

  // Fetch Steam live data
  useEffect(() => {
    if (!interestsData.steamId || !interestsData.steamSyncEnabled) {
      setSteamGames([]);
      return;
    }

    const fetchSteam = async () => {
      setSteamLoading(true);
      setSteamError(null);
      try {
        const response = await fetch(`/api/steam?steamId=${interestsData.steamId.trim()}`);
        const data = await response.json();
        if (!response.ok) {
           throw new Error(data.error || "Failed to fetch steam games");
        }
        setSteamGames(data);
      } catch (err) {
        console.error("Failed to fetch Steam live data:", err);
        setSteamError(err.message);
      } finally {
        setSteamLoading(false);
      }
    };

    fetchSteam();
  }, [interestsData.steamId, interestsData.steamSyncEnabled]);


  // Filtered lists
  const filteredGames = interestsData.games.filter(game => {
    if (gameFilter === "playing") return game.status === "Currently Playing";
    if (gameFilter === "favorites") return game.status === "Favorite";
    return true;
  }).sort((a, b) => {
    if (gameSort === "playtime") return (Number(b.hours) || 0) - (Number(a.hours) || 0);
    return (a.title || "").localeCompare(b.title || "");
  });

  const filteredAnime = interestsData.anime.filter(item => {
    if (animeFilter === "anime") return item.type === "Anime";
    if (animeFilter === "manga") return item.type === "Manga";
    return true;
  }).sort((a, b) => {
    if (animeSort === "myRating") {
      const aScore = parseFloat(a.score) || 0;
      const bScore = parseFloat(b.score) || 0;
      return bScore - aScore;
    }
    return (a.title || "").localeCompare(b.title || "");
  });

  const getSortedAniList = (list, isFavSet) => {
    const getTitle = (e) => e.media?.title?.english || e.media?.title?.romaji || "";
    return [...list].map(e => ({
       ...e,
       isFavorite: e.isFavorite || (isFavSet && isFavSet.has(e.media?.id))
    })).sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      if (animeSort === "myRating") return (b.score || 0) - (a.score || 0);
      if (animeSort === "overallRating") return (b.media?.averageScore || 0) - (a.media?.averageScore || 0);
      return getTitle(a).localeCompare(getTitle(b));
    });
  };
  
  const mapManualAnime = (type, targetStatus) => {
    return (interestsData.anime || [])
      .filter(a => (a.type || 'Anime') === type && (a.status || 'COMPLETED') === targetStatus)
      .map(a => ({
         id: `manual-${a.id}`,
         progress: '?',
         score: a.score,
         status: a.status || 'COMPLETED',
         isFavorite: a.isFavorite || false,
         manualDetails: a,
         media: {
           title: { english: a.title, romaji: a.title },
           coverImage: { large: a.coverUrl || '/placeholder.png' },
           averageScore: parseFloat(a.score) * 10 || null,
           siteUrl: '#'
         }
      }));
  };

  const sortedWatchingAnime = getSortedAniList([...anilistWatchingAnime, ...mapManualAnime('Anime', 'CURRENT')], anilistFavoriteAnimeIds);
  const sortedWatchedAnime = getSortedAniList([...anilistWatchedAnime, ...mapManualAnime('Anime', 'COMPLETED')], anilistFavoriteAnimeIds);
  const sortedDroppedAnime = getSortedAniList([...mapManualAnime('Anime', 'DROPPED')], anilistFavoriteAnimeIds);
  const sortedPlanningAnime = getSortedAniList([...mapManualAnime('Anime', 'PLANNING')], anilistFavoriteAnimeIds);

  const sortedReadingManga = getSortedAniList([...anilistReadingManga, ...mapManualAnime('Manga', 'CURRENT')], anilistFavoriteMangaIds);
  const sortedReadManga = getSortedAniList([...anilistReadManga, ...mapManualAnime('Manga', 'COMPLETED')], anilistFavoriteMangaIds);
  
  const getSortedSteam = () => {
    const manualGames = (interestsData.games || []).map(g => ({
      appid: `manual-${g.id}`,
      name: g.title,
      playtime_forever: (parseFloat(g.hours) || 0) * 60,
      img_icon_url: g.bannerUrl,
      isManual: true,
      isFavorite: g.status === 'Favorite'
    }));
    
    // Merge, ensuring favorites are pushed to top
    return [...steamGames, ...manualGames].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      if (gameSort === "name") return (a.name || "").localeCompare(b.name || "");
      return b.playtime_forever - a.playtime_forever;
    });
  };
  const sortedSteam = getSortedSteam();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-sky-aqua-500/10 flex items-center justify-center border border-sky-aqua-500/20 text-sky-aqua-400 mb-6 shadow-lg shadow-sky-aqua-500/10">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 font-display">
          Lounge & <span className="gradient-text">Interests</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-lg font-light leading-relaxed">
          Beyond software engineering: exploring virtual worlds, competitive gaming, and anime storytelling.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-900/70 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setActiveTab("gaming")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === "gaming"
                ? "bg-gradient-to-r from-sky-aqua-600 to-baltic-blue-600 text-white shadow-lg shadow-sky-aqua-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Gaming Hub</span>
          </button>
          
          <button
            onClick={() => setActiveTab("anime")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === "anime"
                ? "bg-gradient-to-r from-sky-aqua-600 to-baltic-blue-600 text-white shadow-lg shadow-sky-aqua-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Anime & Manga</span>
          </button>
        </div>
      </div>

            {/* ======================================================== */}
      {/* GAMING TAB CONTENT */}
      {/* ======================================================== */}
      {activeTab === "gaming" && (
        <div className="space-y-10 animate-fade-in">
          {/* Steam & Manual Games Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-5 h-5 text-sky-aqua-400" />
              <h3 className="text-xl font-bold font-display text-slate-100">Library & Favorites</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedSteam.slice(0, visibleSteam).map(game => <SteamCard key={game.appid} game={game} />)}
            </div>
            
            {visibleSteam < sortedSteam.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleSteam(prev => prev + 12)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-6 py-2 rounded-xl transition-all text-sm font-medium"
                >
                  Load More Games
                </button>
              </div>
            )}
            
            {sortedSteam.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                No games added yet. Configure Steam sync or add manual games via the admin panel.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ANIME TAB CONTENT */}
      {/* ======================================================== */}
      {activeTab === "anime" && (
        <div className="space-y-12 animate-fade-in pt-4">
          <div className="space-y-16">
            {/* ANIME SECTION */}
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-5 h-5 text-sky-aqua-400" />
                <h3 className="text-xl font-bold font-display text-slate-100">Anime</h3>
              </div>
              
              {sortedWatchingAnime.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Currently Watching</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedWatchingAnime.map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                  </div>
                </div>
              )}

              {sortedPlanningAnime.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Planning to Watch</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedPlanningAnime.map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                  </div>
                </div>
              )}

              {sortedWatchedAnime.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Completed</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedWatchedAnime.slice(0, visibleAnime).map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                  </div>
                  
                  {visibleAnime < sortedWatchedAnime.length && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setVisibleAnime(prev => prev + 10)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-6 py-2 rounded-xl transition-all text-sm font-medium"
                      >
                        Load More Anime
                      </button>
                    </div>
                  )}
                </div>
              )}

              {sortedDroppedAnime.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dropped</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedDroppedAnime.map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                  </div>
                </div>
              )}
            </div>

            {/* MANGA SECTION */}
            <div className="space-y-8 pt-8 border-t border-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 flex items-center justify-center bg-emerald-500/10 rounded text-emerald-400 border border-emerald-500/20">M</div>
                <h3 className="text-xl font-bold font-display text-slate-100">Manga & Light Novels</h3>
              </div>
              
              {sortedReadingManga.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Currently Reading</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedReadingManga.map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                  </div>
                </div>
              )}

              {sortedReadManga.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Completed</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedReadManga.slice(0, visibleManga).map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                  </div>
                  
                  {visibleManga < sortedReadManga.length && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setVisibleManga(prev => prev + 10)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-6 py-2 rounded-xl transition-all text-sm font-medium"
                      >
                        Load More Manga
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {sortedWatchingAnime.length === 0 && sortedPlanningAnime.length === 0 && sortedWatchedAnime.length === 0 && sortedReadingManga.length === 0 && sortedReadManga.length === 0 && (
               <div className="text-center py-16 text-slate-500">
                No anime or manga found. Configure AniList sync or add items via the admin panel.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
