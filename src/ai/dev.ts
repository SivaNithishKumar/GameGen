import { config } from 'dotenv';
config();

import '@/ai/flows/modify-code-based-on-chat.ts';
import '@/ai/flows/generate-starting-point-from-prompt.ts';
import '@/ai/flows/generate-game-assets.ts';
import '@/ai/flows/adjust-game-parameters.ts';
