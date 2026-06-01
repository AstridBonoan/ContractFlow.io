export const AUTH_SESSION_KEY = "contractorflow_session";
export const AUTH_ACCOUNTS_KEY = "contractorflow_accounts";

export const DEMO_EMAIL = "contractor@demo.com";
export const DEMO_PASSWORD = "demo1234";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
}

interface StoredAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}

function uid() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeAccount(account: StoredAccount): StoredAccount {
  return {
    ...account,
    email: account.email.toLowerCase().trim(),
    password: account.password,
    fullName: account.fullName?.trim() || "Contractor",
  };
}

export function getDefaultAccounts(): StoredAccount[] {
  return [
    {
      id: "demo-contractor",
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      fullName: "Demo Contractor",
      companyName: "Summit Build Co.",
    },
  ];
}

function mergeWithDefaults(accounts: StoredAccount[]): StoredAccount[] {
  const defaults = getDefaultAccounts();
  const merged = [...accounts.map(normalizeAccount)];

  for (const fallback of defaults) {
    const index = merged.findIndex((a) => a.email === fallback.email);
    if (index === -1) {
      merged.push(fallback);
    }
  }

  return merged;
}

function persistAccounts(accounts: StoredAccount[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getAccounts(): StoredAccount[] {
  const defaults = getDefaultAccounts();

  if (typeof window === "undefined") return defaults;

  let accounts: StoredAccount[] = [];

  try {
    const raw = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        accounts = parsed.filter(
          (item): item is StoredAccount =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as StoredAccount).email === "string" &&
            typeof (item as StoredAccount).password === "string"
        );
      }
    }
  } catch {
    accounts = [];
  }

  const merged = mergeWithDefaults(accounts);
  persistAccounts(merged);
  return merged;
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
  return null;
}

export function setSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_SESSION_KEY);
  }
}

function accountToUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    companyName: account.companyName,
  };
}

/** Built-in demo login — always works in demo mode regardless of localStorage state. */
export function isDemoCredential(email: string, password: string): boolean {
  return (
    email.toLowerCase().trim() === DEMO_EMAIL &&
    password.trim() === DEMO_PASSWORD
  );
}

export function demoSignUp(input: {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}): AuthUser {
  if (isDemoCredential(input.email, input.password)) {
    throw new Error("This email is reserved for the demo account. Use Sign In instead.");
  }

  const accounts = getAccounts();
  const email = input.email.toLowerCase().trim();
  const password = input.password.trim();

  if (accounts.some((a) => a.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const account: StoredAccount = {
    id: uid(),
    email,
    password,
    fullName: input.fullName.trim(),
    companyName: input.companyName?.trim(),
  };
  accounts.push(account);
  persistAccounts(accounts);

  const user = accountToUser(account);
  setSession(user);
  return user;
}

export function demoSignIn(email: string, password: string): AuthUser {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPassword = password.trim();

  if (isDemoCredential(normalizedEmail, normalizedPassword)) {
    const demo = getDefaultAccounts()[0];
    const user = accountToUser(demo);
    const accounts = getAccounts();
    if (!accounts.some((a) => a.email === demo.email)) {
      persistAccounts(mergeWithDefaults(accounts));
    }
    setSession(user);
    return user;
  }

  const accounts = getAccounts();
  const account = accounts.find(
    (a) => a.email === normalizedEmail && a.password === normalizedPassword
  );
  if (!account) {
    throw new Error("Invalid email or password.");
  }

  const user = accountToUser(account);
  setSession(user);
  return user;
}

export function demoSignOut() {
  setSession(null);
}

/** Seed demo accounts in localStorage on app load. */
export function initAuthStore() {
  if (typeof window !== "undefined") {
    getAccounts();
  }
}
