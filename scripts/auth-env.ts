import { config } from "dotenv";

export type AuthEnvStatus = {
  key: string;
  present: boolean;
  required: boolean;
};

export function loadLocalEnv() {
  config({ path: ".env", quiet: true });
  config({ path: ".env.local", override: true, quiet: true });
}

export function getAuthEnvStatus(): AuthEnvStatus[] {
  return [
    {
      key: "DATABASE_URL",
      present: Boolean(process.env.DATABASE_URL),
      required: true
    },
    {
      key: "NEXTAUTH_SECRET",
      present: Boolean(process.env.NEXTAUTH_SECRET),
      required: true
    },
    {
      key: "NEXTAUTH_URL",
      present: Boolean(process.env.NEXTAUTH_URL),
      required: false
    },
    {
      key: "GOOGLE_CLIENT_ID",
      present: Boolean(process.env.GOOGLE_CLIENT_ID),
      required: false
    },
    {
      key: "GOOGLE_CLIENT_SECRET",
      present: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      required: false
    },
    {
      key: "RESEND_API_KEY",
      present: Boolean(process.env.RESEND_API_KEY),
      required: false
    },
    {
      key: "AUTH_EMAIL_FROM",
      present: Boolean(process.env.AUTH_EMAIL_FROM),
      required: false
    }
  ];
}

export function missingRequiredAuthEnv() {
  return getAuthEnvStatus()
    .filter((entry) => entry.required && !entry.present)
    .map((entry) => entry.key);
}

export function printAuthEnvStatus() {
  for (const entry of getAuthEnvStatus()) {
    const requirement = entry.required ? "required" : "optional";
    const state = entry.present ? "set" : "missing";

    console.log(`${entry.key}: ${state} (${requirement})`);
  }
}
