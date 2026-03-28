export const getPublicApiBase = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getPublicApiBase()}${path}`, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number };
};

export type PublicEvent = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  registration_link?: string | null;
  image_url?: string | null;
};

export type PublicWorkshop = {
  id: number;
  title: string;
  description: string;
  date: string;
  level?: string | null;
  location?: string | null;
};

export type PublicAnnouncement = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export type PublicResource = {
  id: number;
  title: string;
  description: string;
  category: string;
  link: string;
};

export type PublicTeamMember = {
  id: number;
  name: string;
  description: string;
  role: string;
  skills: string[];
  photo_url?: string | null;
};

export type PublicGalleryItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
};

export type PublicStats = {
  events: number;
  workshops: number;
  members: number;
  announcements: number;
};

export const getPublicEvents = async (limit = 12, page = 1) => {
  return fetchJson<PaginatedResponse<PublicEvent>>(`/api/events?page=${page}&limit=${limit}`);
};

export const getPublicWorkshops = async (limit = 12, page = 1) => {
  return fetchJson<PaginatedResponse<PublicWorkshop>>(`/api/workshops?page=${page}&limit=${limit}`);
};

export const getPublicAnnouncements = async () => {
  return fetchJson<PublicAnnouncement[]>("/api/announcements");
};

export const getPublicResources = async (limit = 12, page = 1) => {
  return fetchJson<PaginatedResponse<PublicResource>>(`/api/resources?page=${page}&limit=${limit}`);
};

export const getPublicTeamMembers = async () => {
  return fetchJson<PublicTeamMember[]>("/api/team-members");
};

export const getPublicGallery = async () => {
  return fetchJson<PublicGalleryItem[]>("/api/gallery");
};

export const getPublicStats = async () => {
  return fetchJson<PublicStats>("/api/stats");
};
