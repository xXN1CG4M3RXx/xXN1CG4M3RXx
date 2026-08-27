import { useState, useEffect } from 'react';
import StatusMessage from './StatusMessage';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ImageManagerModal from './ImageManagerModal';
import { Gamepad2, Film, Sparkles, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

export default function InterestsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Modal State for image uploads
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState({ type: null, id: null }); // type: 'game'|'anime', id: string

  const [interests, setInterests] = useState({
    anilistUsername: '',
    anilistSyncEnabled: true,
    games: [],
    anime: []
  });

  useEffect(() => {
    const fetchInterests = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'settings', 'interests');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInterests({
            anilistUsername: data.anilistUsername || '',
            anilistSyncEnabled: data.anilistSyncEnabled !== false,
            games: data.games || [],
            anime: data.anime || []
          });
        }
      } catch (error) {
        console.error('Error fetching interests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'interests');
      // Strip undefined values which cause setDoc to crash
      const cleanInterests = JSON.parse(JSON.stringify(interests));
      await setDoc(docRef, cleanInterests);
      setStatus({ type: 'success', message: 'Changes saved successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error('Error saving interests:', error);
      setStatus({ type: 'error', message: 'Failed to save interests. Please check console.' });
    } finally {
      setSaving(false);
    }
  };

  // Image selection handler
  const openImageManager = (type, id) => {
    setActiveImageField({ type, id });
    setIsImageManagerOpen(true);
  };

  const handleImageSelected = (url) => {
    if (activeImageField.type === 'game') {
      updateGame(activeImageField.id, 'bannerUrl', url);
    } else if (activeImageField.type === 'anime') {
      updateAnime(activeImageField.id, 'coverUrl', url);
    }
  };

  // ===================== GAMES HANDLERS =====================
  const addGame = () => {
    setInterests(prev => ({
      ...prev,
      games: [
        ...prev.games,
        {
          id: Date.now().toString(),
          title: 'New Game',
          status: 'Currently Playing',
          platform: 'PC',
          genre: 'Action RPG',
          rating: '10/10',
          hours: '',
          rank: '',
          bannerUrl: '',
          notes: ''
        }
      ]
    }));
  };

  const removeGame = (id) => {
    setInterests(prev => ({
      ...prev,
      games: prev.games.filter(g => g.id !== id)
    }));
  };

  const updateGame = (id, field, value) => {
    setInterests(prev => ({
      ...prev,
      games: prev.games.map(g => g.id === id ? { ...g, [field]: value } : g)
    }));
  };

  const moveGame = (index, direction) => {
    const newGames = [...interests.games];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newGames.length) return;
    const temp = newGames[index];
    newGames[index] = newGames[targetIndex];
    newGames[targetIndex] = temp;
    setInterests(prev => ({ ...prev, games: newGames }));
  };

  // ===================== ANIME HANDLERS =====================
  const addAnime = () => {
    setInterests(prev => ({
      ...prev,
      anime: [
        ...prev.anime,
        {
          id: Date.now().toString(),
          title: 'New Anime / Manga',
          type: 'Anime',
          score: '10/10',
          favCharacter: '',
          coverUrl: '',
          quote: ''
        }
      ]
    }));
  };

  const removeAnime = (id) => {
    setInterests(prev => ({
      ...prev,
      anime: prev.anime.filter(a => a.id !== id)
    }));
  };

  const updateAnime = (id, field, value) => {
    setInterests(prev => ({
      ...prev,
      anime: prev.anime.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const moveAnime = (index, direction) => {
    const newAnime = [...interests.anime];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newAnime.length) return;
    const temp = newAnime[index];
    newAnime[index] = newAnime[targetIndex];
    newAnime[targetIndex] = temp;
    setInterests(prev => ({ ...prev, anime: newAnime }));
  };

  if (loading) return <div className="text-slate-400 p-8">Loading interests...</div>;

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      <ImageManagerModal
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        onSelect={handleImageSelected}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100 mb-2">Interests & Hobbies</h1>
          <p className="text-slate-400">Manage your gaming showcases, anime favorites, and live AniList sync.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="whitespace-nowrap bg-sky-aqua-600 hover:bg-sky-aqua-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-sky-aqua-500/20 flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status && <StatusMessage status={status} />}

      {/* AniList Sync Configuration Box */}
      <div className="glassmorphism rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Live AniList Integration</h2>
            <p className="text-xs text-slate-400">Syncs what you're currently watching directly via the public AniList API.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              AniList Username
            </label>
            <input
              type="text"
              value={interests.anilistUsername || ''}
              onChange={e => setInterests(prev => ({ ...prev, anilistUsername: e.target.value }))}
              placeholder="e.g. your_anilist_name"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-sky-aqua-500"
            />
            <p className="text-xs text-slate-500 mt-1.5">Leave blank if you don't want to sync an AniList profile.</p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="anilistToggle"
                checked={interests.anilistSyncEnabled}
                onChange={e => setInterests(prev => ({ ...prev, anilistSyncEnabled: e.target.checked }))}
                className="w-5 h-5 rounded border-slate-700 text-sky-aqua-600 focus:ring-sky-aqua-500 bg-slate-900"
              />
              <label htmlFor="anilistToggle" className="text-sm font-medium text-slate-200 cursor-pointer">
                Display live "Currently Watching" on the Interests page
              </label>
            </div>
            {interests.anilistUsername && (
              <a
                href={`https://anilist.co/user/${interests.anilistUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-aqua-400 hover:underline flex items-center gap-1 mt-2"
              >
                <span>Preview profile (anilist.co/user/{interests.anilistUsername})</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ===================== GAMING SHOWCASE ===================== */}
      <div className="glassmorphism rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-aqua-500/10 flex items-center justify-center text-sky-aqua-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Gaming Showcase</h2>
              <p className="text-xs text-slate-400">Manage currently playing games and all-time favorites.</p>
            </div>
          </div>
          <button
            onClick={addGame}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-4 py-2 rounded-xl transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>

        <div className="space-y-4">
          {interests.games.map((game, index) => (
            <div key={game.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 relative group">
              {/* Order Controls */}
              <div className="flex md:flex-col gap-1 items-center justify-center">
                <button
                  onClick={() => moveGame(index, -1)}
                  disabled={index === 0}
                  className="text-slate-500 hover:text-white disabled:opacity-20 p-1"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveGame(index, 1)}
                  disabled={index === interests.games.length - 1}
                  className="text-slate-500 hover:text-white disabled:opacity-20 p-1"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Banner Preview / Select */}
              <div className="w-full md:w-36 h-28 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shrink-0 relative group/img">
                {game.bannerUrl ? (
                  <img src={game.bannerUrl} alt={game.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">No Image</div>
                )}
                <button
                  onClick={() => openImageManager('game', game.id)}
                  className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-sky-aqua-300"
                >
                  Change
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Game Title</label>
                  <input
                    type="text"
                    value={game.title}
                    onChange={e => updateGame(game.id, 'title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={game.status || 'Currently Playing'}
                    onChange={e => updateGame(game.id, 'status', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  >
                    <option value="Currently Playing">Currently Playing</option>
                    <option value="Favorite">All-Time Favorite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Platform</label>
                  <input
                    type="text"
                    value={game.platform || ''}
                    onChange={e => updateGame(game.id, 'platform', e.target.value)}
                    placeholder="PC, PS5, Switch..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Genre</label>
                  <input
                    type="text"
                    value={game.genre || ''}
                    onChange={e => updateGame(game.id, 'genre', e.target.value)}
                    placeholder="Action RPG, FPS..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rating / Score</label>
                  <input
                    type="text"
                    value={game.rating || ''}
                    onChange={e => updateGame(game.id, 'rating', e.target.value)}
                    placeholder="10/10"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Playtime</label>
                  <input
                    type="text"
                    value={game.hours || ''}
                    onChange={e => updateGame(game.id, 'hours', e.target.value)}
                    placeholder="250 hrs"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rank</label>
                  <input
                    type="text"
                    value={game.rank || ''}
                    onChange={e => updateGame(game.id, 'rank', e.target.value)}
                    placeholder="Diamond / Unranked"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Banner Image URL</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={game.bannerUrl || ''}
                      onChange={e => updateGame(game.id, 'bannerUrl', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    />
                    <button
                      onClick={() => openImageManager('game', game.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <label className="block text-xs text-slate-400 mb-1">Personal Notes / Review</label>
                  <input
                    type="text"
                    value={game.notes || ''}
                    onChange={e => updateGame(game.id, 'notes', e.target.value)}
                    placeholder="Thoughts or favorite memories about this game..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeGame(game.id)}
                className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity self-start"
                title="Remove game"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {interests.games.length === 0 && (
            <p className="text-slate-500 text-center py-6 text-sm">No games added yet. Click "+ Add Game" to start.</p>
          )}
        </div>
      </div>

      {/* ===================== ANIME & MANGA SHOWCASE ===================== */}
      <div className="glassmorphism rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-aqua-500/10 flex items-center justify-center text-sky-aqua-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Anime & Manga Masterpieces</h2>
              <p className="text-xs text-slate-400">Showcase your all-time favorite anime, manga, and favorite characters.</p>
            </div>
          </div>
          <button
            onClick={addAnime}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-4 py-2 rounded-xl transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Anime/Manga</span>
          </button>
        </div>

        <div className="space-y-4">
          {interests.anime.map((item, index) => (
            <div key={item.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 relative group">
              {/* Order Controls */}
              <div className="flex md:flex-col gap-1 items-center justify-center">
                <button
                  onClick={() => moveAnime(index, -1)}
                  disabled={index === 0}
                  className="text-slate-500 hover:text-white disabled:opacity-20 p-1"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveAnime(index, 1)}
                  disabled={index === interests.anime.length - 1}
                  className="text-slate-500 hover:text-white disabled:opacity-20 p-1"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Poster Preview */}
              <div className="w-full md:w-28 h-36 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shrink-0 relative group/img">
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">No Image</div>
                )}
                <button
                  onClick={() => openImageManager('anime', item.id)}
                  className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-sky-aqua-300"
                >
                  Change
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => updateAnime(item.id, 'title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select
                    value={item.type || 'Anime'}
                    onChange={e => updateAnime(item.id, 'type', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  >
                    <option value="Anime">Anime</option>
                    <option value="Manga">Manga</option>
                    <option value="Movie">Movie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Score / Rating</label>
                  <input
                    type="text"
                    value={item.score || ''}
                    onChange={e => updateAnime(item.id, 'score', e.target.value)}
                    placeholder="10/10"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Favorite Character</label>
                  <input
                    type="text"
                    value={item.favCharacter || ''}
                    onChange={e => updateAnime(item.id, 'favCharacter', e.target.value)}
                    placeholder="e.g. Rintaro Okabe, Fern"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cover Image URL</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={item.coverUrl || ''}
                      onChange={e => updateAnime(item.id, 'coverUrl', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    />
                    <button
                      onClick={() => openImageManager('anime', item.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Review Quote / Impact</label>
                  <textarea
                    rows={2}
                    value={item.quote || ''}
                    onChange={e => updateAnime(item.id, 'quote', e.target.value)}
                    placeholder="Why is this a masterpiece to you? Memorable quote or impact..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500 resize-none"
                  />
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeAnime(item.id)}
                className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity self-start"
                title="Remove anime"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {interests.anime.length === 0 && (
            <p className="text-slate-500 text-center py-6 text-sm">No anime added yet. Click "+ Add Anime/Manga" to start.</p>
          )}
        </div>
      </div>
    </div>
  );
}
