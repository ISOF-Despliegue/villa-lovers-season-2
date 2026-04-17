export const COLORS_PIE = ["#E8960A", "#38BDF8", "#A78BFA", "#22C55E", "#F87171"];
export const GENRES = ["Pop", "Hip-Hop", "Rock", "Electronic", "R&B", "Jazz", "Classical", "Indie", "Latin", "Country"];

export const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
export const fmtNum = (n) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : String(n);

export const ARTISTS = [
  { id: "a1", name: "Luna Echo", followers: 1240000, bio: "Electronic artist from Mexico City.", initials: "LE" },
  { id: "a2", name: "Coastal Drive", followers: 890000, bio: "Indie rock band.", initials: "CD" },
  { id: "a3", name: "Marcos Vidal", followers: 450000, bio: "Latin pop singer.", initials: "MV" },
  { id: "a4", name: "Nova Signal", followers: 320000, bio: "Synth-wave producer.", initials: "NS" },
];

export const TRACKS = [
  { id: "t1", title: "Neon Drift", artistId: "a1", artist: "Luna Echo", albumId: "al1", duration: 215, genre: "Electronic", plays: 1420000 },
  { id: "t2", title: "Hollow Roads", artistId: "a2", artist: "Coastal Drive", albumId: "al2", duration: 198, genre: "Indie", plays: 980000 },
  { id: "t3", title: "Cielito Azul", artistId: "a3", artist: "Marcos Vidal", albumId: "al3", duration: 222, genre: "Latin", plays: 760000 },
  { id: "t4", title: "Signal Lost", artistId: "a4", artist: "Nova Signal", albumId: "al4", duration: 187, genre: "Electronic", plays: 640000 },
  { id: "t5", title: "Midnight Fade", artistId: "a1", artist: "Luna Echo", albumId: "al1", duration: 234, genre: "Electronic", plays: 590000 },
  { id: "t6", title: "Open Water", artistId: "a2", artist: "Coastal Drive", albumId: "al2", duration: 210, genre: "Indie", plays: 480000 },
  { id: "t7", title: "Resonance", artistId: "a4", artist: "Nova Signal", albumId: "al4", duration: 195, genre: "Electronic", plays: 390000 },
  { id: "t8", title: "Brisa del Sur", artistId: "a3", artist: "Marcos Vidal", albumId: "al3", duration: 245, genre: "Latin", plays: 310000 },
  { id: "t9", title: "Glass City", artistId: "a1", artist: "Luna Echo", albumId: "al1", duration: 202, genre: "Electronic", plays: 280000 },
  { id: "t10", title: "Afterglow", artistId: "a2", artist: "Coastal Drive", albumId: "al2", duration: 218, genre: "Indie", plays: 240000 },
];

export const ALBUMS = [
  { id: "al1", title: "Luminous Fields", artistId: "a1", artist: "Luna Echo", year: 2024, genre: "Electronic", trackIds: ["t1","t5","t9"] },
  { id: "al2", title: "Shoreline Dreams", artistId: "a2", artist: "Coastal Drive", year: 2024, genre: "Indie", trackIds: ["t2","t6","t10"] },
  { id: "al3", title: "Tierra Nueva", artistId: "a3", artist: "Marcos Vidal", year: 2023, genre: "Latin", trackIds: ["t3","t8"] },
  { id: "al4", title: "Analog Future", artistId: "a4", artist: "Nova Signal", year: 2025, genre: "Electronic", trackIds: ["t4","t7"] },
];

export const USERS_MOCK = Array.from({ length: 15 }, (_, i) => ({
  id: `#${10001 + i}`,
  email: `user${10001 + i}@email.com`,
  username: `User Name`,
  role: i === 2 || i === 8 ? "admin" : i % 3 === 1 ? "artist" : "listener",
  status: i === 3 || i === 6 || i === 10 ? "suspended" : "active",
}));

export const FLAGGED_MOCK = [
  { id: "TRK-1001", type: "Track", artist: "Artist Name", reason: "Copyright infringement", date: "Apr 05, 2026" },
  { id: "TRK-1002", type: "Track", artist: "Artist Name", reason: "Explicit content", date: "Apr 05, 2026" },
  { id: "TRK-1003", type: "Track", artist: "Artist Name", reason: "Spam / duplicate", date: "Apr 05, 2026" },
];

export const ACTIVITY = [
  { user: "User Name", action: "Uploaded a track", date: "Apr 05, 2026", status: "Pending" },
  { user: "User Name", action: "Created an album", date: "Apr 05, 2026", status: "Approved" },
];

const mkMonths = (base, factor) =>
  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({
    m, v: Math.round(base + Math.sin(i / 2) * base * factor + i * base * 0.04)
  }));
export const trafficData = mkMonths(45, 0.4);
export const usersData = mkMonths(38000, 0.5);
export const pieData = [
  { name: "Pop", value: 34 }, { name: "Hip-Hop", value: 24 },
  { name: "Rock", value: 18 }, { name: "Electronic", value: 14 }, { name: "Other", value: 10 }
];