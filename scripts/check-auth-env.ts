import {
  loadLocalEnv,
  missingRequiredAuthEnv,
  printAuthEnvStatus
} from "./auth-env";

loadLocalEnv();
printAuthEnvStatus();

const missing = missingRequiredAuthEnv();

if (missing.length > 0) {
  console.error(`Missing required auth env: ${missing.join(", ")}`);
  process.exit(1);
}
