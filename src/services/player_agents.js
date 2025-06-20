import { default as ai_random } from './ai/ai_random/player';
import { default as ai_easy } from './ai/ai_easy/player';
import { default as ai_custom } from './ai/ai_custom/player';
import { default as ai_chatgpt } from './ai/ai_chatgpt/player';

const player_agent_moves = {
    'human-loc': ()=>{},
    'human-rem': ()=>{},
    'ai-chatgpt': ai_chatgpt.move,
    'ai-random': ai_random.move,
    'ai-easy': ai_easy.move,
    'ai-hard': '',
    'ai-custom': ai_custom.move,
}

const player_agent_descriptions = {
    'human-loc': "Local human player",
    'human-rem': "Remote human player",
    'ai-chatgpt': ai_random.description,
    'ai-random': ai_random.description,
    'ai-easy': ai_easy.description,
    'ai-hard': '',
    'ai-custom': ai_custom.description,
}

export { player_agent_moves, player_agent_descriptions };
