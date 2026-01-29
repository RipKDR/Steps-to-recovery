const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const root = path.resolve(__dirname, '..');
const envPaths = [
  path.join(root, 'apps', 'mobile', '.env.local'),
  path.join(root, 'apps', 'mobile', '.env'),
];

let loadedFromFile = false;
let loadedPath = '';
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const parsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
    loadedFromFile = true;
    loadedPath = envPath;
    break;
  }
}

const required = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'];
const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === '');

if (missing.length > 0) {
  const hint = loadedFromFile
    ? 'Check apps/mobile/.env values.'
    : 'Create apps/mobile/.env from apps/mobile/.env.example.';
  console.error(`[validate-env] Missing required variables: ${missing.join(', ')}.`);
  console.error(`[validate-env] ${hint}`);
  process.exit(1);
}

const source = loadedFromFile ? loadedPath : 'process.env';
console.log(`[validate-env] OK (${source})`);
