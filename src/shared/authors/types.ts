export interface AuthorSummary {
  id: number;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  users_userprofile?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar_src?: string | null;
  } | null;
}

export function getAuthorName(author: AuthorSummary) {
  const profile = author.users_userprofile;
  const name = [
    profile?.firstname?.trim() || author.first_name?.trim(),
    profile?.lastname?.trim() || author.last_name?.trim(),
  ]
    .filter(Boolean)
    .join(' ');
  return name || author.username?.trim() || `Автор №${author.id}`;
}
