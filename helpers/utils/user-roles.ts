import { readFileSync } from 'fs';
import { join } from 'path';

type TestUser = {
  username: string;
  password: string;
  role: string;
  permission?: string;
};

const DEFAULT_SITE = 'new-cortex';

function normalize(value?: string) {
  return value?.trim().toLowerCase();
}

function getSiteName(site?: string) {
  return normalize(site ?? process.env.SITE ?? DEFAULT_SITE) ?? DEFAULT_SITE;
}

function loadUsers(site?: string): TestUser[] {
  const resolvedSite = getSiteName(site);
  const path = join(__dirname, '..', '..', 'data', resolvedSite, 'login', 'users.json');

  try {
    return JSON.parse(readFileSync(path, 'utf8')) as TestUser[];
  } catch (error) {
    throw new Error(`Cannot load users for site "${resolvedSite}" from ${path}: ${error}`);
  }
}

export function getAvailableRoles(site?: string): string[] {
  const users = loadUsers(site);
  const roles = new Set<string>();

  for (const user of users) {
    if (user.role) {
      roles.add(normalize(user.role)!);
    }
    if (user.permission) {
      roles.add(normalize(user.permission)!);
    }
  }

  return Array.from(roles).filter(Boolean);
}

export function getUsersForRole(role?: string, site?: string): TestUser[] {
  const users = loadUsers(site);
  if (!role) {
    return users;
  }

  const normalizedRole = normalize(role);
  return users.filter((user) => {
    const normalizedUserRole = normalize(user.role);
    const normalizedPermission = normalize(user.permission);

    return (
      normalizedUserRole === normalizedRole ||
      normalizedPermission === normalizedRole
    );
  });
}

export function findUserByRole(role: string, site?: string): TestUser | undefined {
  return getUsersForRole(role, site)[0];
}

export function getUserByRole(role?: string, fallbackRole = 'super', site?: string): TestUser {
  const selectedRole = normalize(role ?? process.env.USER_ROLE ?? fallbackRole)!;
  const selectedSite = getSiteName(site);
  const user = findUserByRole(selectedRole, selectedSite);

  if (!user) {
    const available = getAvailableRoles(selectedSite).join(', ');
    throw new Error(
      `No user found for role "${selectedRole}" on site "${selectedSite}". Available roles: ${available}`
    );
  }

  return user;
}
