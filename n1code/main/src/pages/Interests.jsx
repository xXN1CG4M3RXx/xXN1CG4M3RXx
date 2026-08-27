import { useEffect, useState } from "react";
import { fetchCachedData } from "../lib/cache";
import { Gamepad2, Film, Sparkles, Star, Trophy, ExternalLink } from "lucide-react";

const AnimeCard = ({ entry }) => {
  const media = entry.media;
  const title = media.title.english || media.title.romaji;
  const maxEps = media.episodes || "?";
  const progressPercent = media.episodes ? Math.round((entry.progress / media.episodes) * 100) : 0;

  return (
    <a
      key={entry.id}
      href={media.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glassmorphism rounded-xl overflow-hidden border border-slate-800 hover:border-sky-aqua-500/50 group flex flex-col transition-all hover-scale"
    >
      <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
        <img loading="lazy"
          src={media.coverImage.large}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 font-bold mb-1">
            <span>Ep {entry.progress} / {maxEps}</span>
            {media.averageScore && (
              <span className="text-emerald-400">★ {media.averageScore}%</span>
            )}
          </div>
          {media.episodes && (
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
        {media.genres && media.genres.length > 0 && (
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
  
  const [interestsData, setInterestsData] = useState({
    games: [],
    anime: [],
    anilistUsername: "",
    anilistSyncEnabled: true
  });
  const [loading, setLoading] = useState(true);

  // AniList Live Feed State
  const [anilistWatching, setAnilistWatching] = useState([]);
  const [anilistWatched, setAnilistWatched] = useState([]);
  const [visibleWatched, setVisibleWatched] = useState(10);
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
              anilistSyncEnabled: data.anilistSyncEnabled !== false
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
      setAnilistWatching([]);
      setAnilistWatched([]);
      return;
    }

    const fetchAniList = async () => {
      setAnilistLoading(true);
      try {
        const query = `
          query ($userName: String) {
            MediaListCollection(userName: $userName, type: ANIME, sort: [UPDATED_TIME_DESC]) {
              lists {
                entries {
                  id
                  progress
                  score
                  status
                  updatedAt
                  media {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      large
                    }
                    episodes
                    genres
                    averageScore
                    siteUrl
                  }
                }
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
        
        const allLists = resData?.data?.MediaListCollection?.lists || [];
        const flattenedEntries = allLists.flatMap(list => list.entries);
        
        // Filter and sort alphabetically by title
        const getTitle = (e) => e.media.title.english || e.media.title.romaji || "";
        
        const watching = flattenedEntries.filter(e => e.status === 'CURRENT').sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
        const watched = flattenedEntries.filter(e => e.status !== 'CURRENT').sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
        
        setAnilistWatching(watching);
        setAnilistWatched(watched);
      } catch (err) {
        console.error("Failed to fetch AniList live data:", err);
      } finally {
        setAnilistLoading(false);
      }
    };

    fetchAniList();
  }, [interestsData.anilistUsername, interestsData.anilistSyncEnabled]);

  // Filtered lists
  const filteredGames = interestsData.games.filter(game => {
    if (gameFilter === "playing") return game.status === "Currently Playing";
    if (gameFilter === "favorites") return game.status === "Favorite";
    return true;
  });

  const filteredAnime = interestsData.anime.filter(item => {
    if (animeFilter === "anime") return item.type === "Anime";
    if (animeFilter === "manga") return item.type === "Manga";
    return true;
  });

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
          {/* Sub-filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mr-2">Filter:</span>
              {["all", "playing", "favorites"].map((f) => (
                <button
                  key={f}
                  onClick={() => setGameFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    gameFilter === f
                      ? "bg-sky-aqua-500/20 text-sky-aqua-300 border border-sky-aqua-500/40"
                      : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {f === "playing" ? "Currently Playing" : f === "favorites" ? "All-Time Favorites" : "All Games"}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-500">
              {filteredGames.length} {filteredGames.length === 1 ? "title" : "titles"}
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="glassmorphism rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-aqua-500/40 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-xl"
              >
                {/* Banner / Poster */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  {game.bannerUrl ? (
                    <img loading="lazy"
                      src={game.bannerUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                      <Gamepad2 className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {game.status === "Currently Playing" ? (
                      <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Currently Playing
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Trophy className="w-3 h-3" />
                        Favorite
                      </span>
                    )}
                  </div>

                  {/* Platform */}
                  {game.platform && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                        {game.platform}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold font-display text-lg text-slate-100 group-hover:text-sky-aqua-300 transition-colors">
                        {game.title}
                      </h3>
                      {game.rating && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md shrink-0">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {game.rating}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(game.genre || '').split(',').map(g => g.trim()).filter(Boolean).map((g, i) => (
                        <span key={i} className="text-[10px] font-mono font-bold text-sky-aqua-400 bg-sky-aqua-500/10 border border-sky-aqua-500/20 px-2 py-0.5 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>

                    {game.notes && (
                      <p className="text-slate-400 text-sm font-light leading-relaxed">
                        {game.notes}
                      </p>
                    )}
                  </div>

                  {/* Footer with hours / rank */}
                  {(game.hours || game.rank) && (
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs font-mono text-slate-500">
                      {game.hours && (
                        <div className="flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-sky-aqua-500" />
                          <span className="text-slate-300">{game.hours}</span>
                        </div>
                      )}
                      {game.rank && (
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-slate-300 font-bold">{game.rank}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No games found under this filter.
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ANIME & MANGA TAB CONTENT */}
      {/* ======================================================== */}
      {activeTab === "anime" && (
        <div className="space-y-12 animate-fade-in">
          
          {/* Sub-filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mr-2">Filter:</span>
              {["all", "anime", "manga"].map((f) => (
                <button
                  key={f}
                  onClick={() => setAnimeFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    animeFilter === f
                      ? "bg-sky-aqua-500/20 text-sky-aqua-300 border border-sky-aqua-500/40"
                      : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {f === "all" ? "All Masterpieces" : f}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-500">
              {filteredAnime.length} {filteredAnime.length === 1 ? "entry" : "entries"}
            </div>
          </div>

          {/* Masterpieces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnime.map((item) => (
              <div
                key={item.id}
                className="glassmorphism rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-aqua-500/40 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-xl"
              >
                {/* Poster Container */}
                <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
                  {item.coverUrl ? (
                    <img loading="lazy"
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                      <Film className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-sky-aqua-500/20 text-sky-aqua-300 border border-sky-aqua-500/30 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                      {item.type}
                    </span>
                  </div>

                  {/* Score */}
                  {item.score && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.score}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold font-display text-xl text-slate-100 group-hover:text-sky-aqua-300 transition-colors mb-2">
                      {item.title}
                    </h3>

                    {item.favCharacter && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 bg-slate-900/60 py-1 px-2.5 rounded-lg border border-slate-800 w-fit">
                        <Sparkles className="w-3 h-3 text-sky-aqua-400" />
                        <span>Best Character:</span>
                        <strong className="text-slate-200">{item.favCharacter}</strong>
                      </div>
                    )}

                    {item.quote && (
                      <p className="text-slate-400 text-sm font-light italic leading-relaxed pl-3 border-l-2 border-sky-aqua-500/50">
                        "{item.quote}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ======================================================== */}
          {/* LIVE ANILIST INTEGRATION SECTION */}
          {/* ======================================================== */}
          {interestsData.anilistUsername && interestsData.anilistSyncEnabled && (
            <div className="mt-16 pt-10 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                    <h2 className="text-2xl font-bold font-display text-slate-100">Live AniList Activity</h2>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    Live updates of what I'm currently watching synced via AniList GraphQL API.
                  </p>
                </div>

                <a
                  href={`https://anilist.co/user/${interestsData.anilistUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-mono text-sky-aqua-400 hover:text-sky-aqua-300 bg-sky-aqua-500/10 hover:bg-sky-aqua-500/20 border border-sky-aqua-500/30 px-4 py-2 rounded-xl transition-all self-start sm:self-auto shadow-sm"
                >
                  <span>@{interestsData.anilistUsername} on AniList</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {anilistLoading ? (
                <div className="flex items-center justify-center p-12 text-slate-500">
                  <div className="w-8 h-8 border-3 border-sky-aqua-500/20 border-t-sky-aqua-500 rounded-full animate-spin mr-3" />
                  <span>Loading live anime list...</span>
                </div>
              ) : (anilistWatching.length === 0 && anilistWatched.length === 0) ? (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500">
                  No recent AniList activity found for this user.
                </div>
              ) : (
                <div className="space-y-12">
                  {anilistWatching.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">Currently Watching</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {anilistWatching.map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                      </div>
                    </div>
                  )}

                  {anilistWatched.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">Other Activity</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {anilistWatched.slice(0, visibleWatched).map(entry => <AnimeCard key={entry.id} entry={entry} />)}
                      </div>
                      
                      {visibleWatched < anilistWatched.length && (
                        <div className="mt-8 flex justify-center">
                          <button
                            onClick={() => setVisibleWatched(prev => prev + 10)}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-6 py-2 rounded-xl transition-all text-sm font-medium"
                          >
                            Load More
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
