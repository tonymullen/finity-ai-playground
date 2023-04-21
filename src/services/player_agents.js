import { default as ai_random } from './ai/ai_random/player';
import { default as ai_easy } from './ai/ai_easy/player';
import { default as ai_custom } from './ai/ai_custom/player';

const player_agents = {
    'human-loc': ()=>{},
    'human-rem': ()=>{},
    'ai-random': ai_random,
    'ai-easy': ai_easy,
    'ai-hard': '',
    'ai-custom': ai_custom,
}

export default player_agents;