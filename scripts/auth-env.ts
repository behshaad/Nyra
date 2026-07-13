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
      key: "NEXT_PUBLIC_SUPABASE_URL",
      present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      required: true
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
      required: true
    },
    {
      key: "DATABASE_URL",
      present: Boolean(process.env.DATABASE_URL),
      required: true
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      present: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
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
