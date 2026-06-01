export const AUTH_SESSION_KEY = "contractorflow_session";
export const AUTH_ACCOUNTS_KEY = "contractorflow_accounts";

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

function getAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return getDefaultAccounts();
  try {
    const raw = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw) as StoredAccount[];
  } catch {
    /* fall through */
  }
  const defaults = getDefaultAccounts();
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(defaults));
  return defaults;
}

function getDefaultAccounts(): StoredAccount[] {
  return [
    {
      id: "demo-contractor",
      email: "contractor@demo.com",
      password: "demo1234",
      fullName: "Demo Contractor",
      companyName: "Summit Build Co.",
    },
  ];
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

export function demoSignUp(input: {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}): AuthUser {
  const accounts = getAccounts();
  const email = input.email.toLowerCase().trim();
  if (accounts.some((a) => a.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const account: StoredAccount = {
    id: uid(),
    email,
    password: input.password,
    fullName: input.fullName.trim(),
    companyName: input.companyName?.trim(),
  };
  accounts.push(account);
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));

  const user: AuthUser = {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    companyName: account.companyName,
  };
  setSession(user);
  return user;
}

export function demoSignIn(email: string, password: string): AuthUser {
  const accounts = getAccounts();
  const account = accounts.find(
    (a) => a.email === email.toLowerCase().trim() && a.password === password
  );
  if (!account) {
    throw new Error("Invalid email or password.");
  }
  const user: AuthUser = {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    companyName: account.companyName,
  };
  setSession(user);
  return user;
}

export function demoSignOut() {
  setSession(null);
}
