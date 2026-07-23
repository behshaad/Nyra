const strictSslAliases = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseConnectionString(connectionString: string) {
  try {
    const url = new globalThis.URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");

    if (sslMode && strictSslAliases.has(sslMode)) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}
