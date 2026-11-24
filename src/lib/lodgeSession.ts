const sessionStorageKey = "galaxylodge-session";
const rememberedEmailStorageKey = "galaxylodge-remembered-email";

export type LodgeSession = {
  emailAddress: string;
};

/** Helper. Keeps the signed-in email for this browser tab only. The password is never stored. */
export function saveLodgeSession(session: LodgeSession): void {
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

/** Helper. Reads the tab session. Returns null when the value is missing or unreadable. */
export function readLodgeSession(): LodgeSession | null {
  const storedSession = sessionStorage.getItem(sessionStorageKey);
  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession) as LodgeSession;
    if (!parsedSession.emailAddress) {
      return null;
    }
    return parsedSession;
  } catch {
    return null;
  }
}

/** Helper. Clears the tab session on sign out. */
export function clearLodgeSession(): void {
  sessionStorage.removeItem(sessionStorageKey);
}

/** Helper. Remembers only the email when the login checkbox is ticked. */
export function rememberEmailAddress(emailAddress: string): void {
  localStorage.setItem(rememberedEmailStorageKey, emailAddress);
}

/** Helper. Drops the remembered email when the checkbox is cleared. */
export function forgetRememberedEmailAddress(): void {
  localStorage.removeItem(rememberedEmailStorageKey);
}

/** Helper. Prefills the login email on the next visit. */
export function readRememberedEmailAddress(): string {
  return localStorage.getItem(rememberedEmailStorageKey) ?? "";
}
