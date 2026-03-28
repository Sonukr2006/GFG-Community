import { authHeaders, getApiBase } from "@/lib/auth";

async function apiJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...authHeaders()
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }

  return res.json() as Promise<T>;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number };
};

export type EventInput = {
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  registration_link?: string;
  image_url?: string;
};

export type EventItem = EventInput & { id: number };

export function getEvents(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "all") query.set("status", params.status);
  return apiJson<PaginatedResponse<EventItem>>(`/api/events?${query.toString()}`);
}

export function createEvent(payload: EventInput) {
  return apiJson<EventItem>("/api/events", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateEvent(id: number, payload: EventInput) {
  return apiJson<EventItem>(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteEvent(id: number) {
  return apiJson<{ message: string }>(`/api/events/${id}`, {
    method: "DELETE"
  });
}

export type WorkshopInput = {
  title: string;
  description: string;
  date: string;
  level?: string;
  location?: string;
};

export type WorkshopItem = WorkshopInput & { id: number };

export function getWorkshops(params: {
  page: number;
  limit: number;
  search?: string;
  level?: string;
}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.level && params.level !== "all") query.set("level", params.level);
  return apiJson<PaginatedResponse<WorkshopItem>>(`/api/workshops?${query.toString()}`);
}

export function createWorkshop(payload: WorkshopInput) {
  return apiJson<WorkshopItem>("/api/workshops", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateWorkshop(id: number, payload: WorkshopInput) {
  return apiJson<WorkshopItem>(`/api/workshops/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteWorkshop(id: number) {
  return apiJson<{ message: string }>(`/api/workshops/${id}`, {
    method: "DELETE"
  });
}

export type ResourceInput = {
  title: string;
  description: string;
  category: string;
  link: string;
};

export type ResourceItem = ResourceInput & { id: number };

export function getResources(params: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "all") query.set("category", params.category);
  return apiJson<PaginatedResponse<ResourceItem>>(`/api/resources?${query.toString()}`);
}

export function createResource(payload: ResourceInput) {
  return apiJson<ResourceItem>("/api/resources", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateResource(id: number, payload: ResourceInput) {
  return apiJson<ResourceItem>(`/api/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteResource(id: number) {
  return apiJson<{ message: string }>(`/api/resources/${id}`, {
    method: "DELETE"
  });
}

export type AnnouncementInput = {
  title: string;
  description: string;
};

export type AnnouncementItem = AnnouncementInput & { id: number };

export function getAnnouncements() {
  return apiJson<AnnouncementItem[]>("/api/announcements");
}

export function createAnnouncement(payload: AnnouncementInput) {
  return apiJson<AnnouncementItem>("/api/announcements", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateAnnouncement(id: number, payload: AnnouncementInput) {
  return apiJson<AnnouncementItem>(`/api/announcements/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteAnnouncement(id: number) {
  return apiJson<{ message: string }>(`/api/announcements/${id}`, {
    method: "DELETE"
  });
}

export type TeamMemberInput = {
  name: string;
  description: string;
  role: string;
  skills: string[];
  photo_url?: string;
};

export type TeamMemberItem = TeamMemberInput & { id: number };

export function getTeamMembers() {
  return apiJson<TeamMemberItem[]>("/api/team-members");
}

export function createTeamMember(payload: TeamMemberInput) {
  return apiJson<TeamMemberItem>("/api/team-members", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTeamMember(id: number, payload: TeamMemberInput) {
  return apiJson<TeamMemberItem>(`/api/team-members/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteTeamMember(id: number) {
  return apiJson<{ message: string }>(`/api/team-members/${id}`, {
    method: "DELETE"
  });
}

export type ContactMessageItem = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export function getContactMessages(params: { page: number; limit: number }) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  return apiJson<PaginatedResponse<ContactMessageItem>>(`/api/contact-messages?${query.toString()}`);
}

export function deleteContactMessage(id: number) {
  return apiJson<{ message: string }>(`/api/contact-messages/${id}`, {
    method: "DELETE"
  });
}

export type GalleryItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
};

export function getGallery() {
  return apiJson<GalleryItem[]>("/api/gallery");
}

export type MemberInput = {
  login_id: string;
  name: string;
  description?: string;
  password: string;
};

export type MemberItem = {
  id: number;
  login_id: string;
  name: string;
  description: string;
  created_at: string;
};

export type CurrentUser = MemberItem & {
  role: "admin" | "leader" | "member";
};

export function getCurrentUser() {
  return apiJson<CurrentUser>("/api/me");
}

export function getMembers() {
  return apiJson<MemberItem[]>("/api/members");
}

export function createMember(payload: MemberInput) {
  return apiJson<MemberItem>("/api/members", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteMember(id: number) {
  return apiJson<{ message: string }>(`/api/members/${id}`, {
    method: "DELETE"
  });
}

export function getLeaders() {
  return apiJson<MemberItem[]>("/api/leaders");
}

export function createLeader(payload: MemberInput) {
  return apiJson<MemberItem>("/api/leaders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteLeader(id: number) {
  return apiJson<{ message: string }>(`/api/leaders/${id}`, {
    method: "DELETE"
  });
}
