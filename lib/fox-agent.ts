/**
 * Fox Voice Agent - Conversational AI Pipeline
 * 
 * This module implements the complete conversation loop:
 * 1. Speech-to-Text (Whisper)
 * 2. LLM Processing (GPT-4)
 * 3. Text-to-Speech (OpenAI TTS)
 * 4. Audio streaming via LiveKit
 */

import OpenAI from 'openai';

// System prompt for the Fox character
export const FOX_SYSTEM_PROMPT = `You are Foxy, a friendly, knowledgeable AI sales guide representing Vulpine Homes - a premium cabinet refacing company serving the Phoenix, Arizona metro area.

Your personality:
- Warm, conversational, and enthusiastic about kitchen transformations
- Sales-oriented but never pushy - guide users naturally toward consultation
- Speak concisely and naturally, like a helpful design consultant
- Professional yet approachable

Key facts about Vulpine Homes:
- We specialize in cabinet refacing (not full replacements) - saves 50%+ vs traditional remodeling
- We serve the entire Phoenix metro area including Scottsdale, Mesa, Chandler, Gilbert, Tempe, Glendale, Peoria, Surprise, Avondale, Goodyear, and surrounding communities
- Our process takes just 3-5 days, not weeks like traditional remodels
- We offer premium door styles: Shaker Classic, Shaker Slide, Fusion Shaker, Fusion Slide, and Slab
- We have 13+ finish options including solid colors and wood grains
- Designer hardware in multiple finishes: Chrome, Satin Nickel, Matte Black, Rose Gold
- We provide free in-home consultations with 3D design visualization
- Our online Kitchen Visualizer lets homeowners preview their new kitchen instantly

Conversation guidelines:
- Keep responses brief (1-2 sentences max) for natural spoken conversation
- Always guide users toward either:
  1. Trying the Kitchen Visualizer to see their options
  2. Booking a free in-home consultation
- If asked about pricing, explain we provide accurate quotes during free consultations
- Stay focused on cabinet refacing, installations, and kitchen design
- Do not discuss services outside our Phoenix service area
- Do not provide generic home improvement advice unrelated to cabinets

Example greeting: "Hey there! I'm Foxy from Vulpine Homes. I'd love to help you explore your dream kitchen. What brings you here today?"`;

// Greeting message that plays when the user first connects
export const FOX_GREETING = "Hey! I'm Foxy from Vulpine Homes. Ready to transform your Phoenix kitchen? Let's talk cabinets!";

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FoxAgentConfig {
  openaiApiKey: string;
  model?: string;
  ttsVoice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  ttsModel?: string;
}

export class FoxConversationManager {
  private openai: OpenAI;
  private conversationHistory: ConversationMessage[];
  private config: FoxAgentConfig;
  
  constructor(config: FoxAgentConfig) {
    this.config = {
      model: 'gpt-4o-mini',
      ttsVoice: 'nova', // Friendly, warm female voice
      ttsModel: 'tts-1',
      ...config
    };
    
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
    
    this.conversationHistory = [
      { role: 'system', content: FOX_SYSTEM_PROMPT }
    ];
  }
  
  /**
   * Transcribe audio to text using Whisper
   */
  async transcribe(audioBuffer: Buffer, mimeType: string = 'audio/webm'): Promise<string> {
    try {
      // Use OpenAI's toFile helper for Node.js compatibility
      const { toFile } = await import('openai/uploads');
      const audioFile = await toFile(audioBuffer, 'audio.webm', { type: mimeType });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
      });
      
      return transcription.text;
    } catch (error) {
      console.error('[FoxAgent] Transcription error:', error);
      throw error;
    }
  }
  
  /**
   * Generate a response using the LLM
   */
  async generateResponse(userMessage: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.config.model!,
        messages: this.conversationHistory,
        max_tokens: 150, // Keep responses concise for natural conversation
        temperature: 0.8,
      });
      
      const assistantMessage = completion.choices[0]?.message?.content || 
        "I'm sorry, I didn't catch that. Could you say that again?";
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });
      
      // Keep conversation history manageable (last 20 messages + system prompt)
      if (this.conversationHistory.length > 21) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-20)
        ];
      }
      
      return assistantMessage;
    } catch (error) {
      console.error('[FoxAgent] LLM error:', error);
      return "I'm having a little trouble thinking right now. Can you try that again?";
    }
  }
  
  /**
   * Convert text to speech audio
   */
  async synthesizeSpeech(text: string): Promise<Buffer> {
    try {
      const response = await this.openai.audio.speech.create({
        model: this.config.ttsModel!,
        voice: this.config.ttsVoice!,
        input: text,
        response_format: 'mp3',
        speed: 1.0,
      });
      
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('[FoxAgent] TTS error:', error);
      throw error;
    }
  }
  
  /**
   * Generate the greeting audio
   */
  async generateGreeting(): Promise<Buffer> {
    return this.synthesizeSpeech(FOX_GREETING);
  }
  
  /**
   * Complete conversation turn: transcribe -> generate -> synthesize
   */
  async processConversationTurn(audioBuffer: Buffer): Promise<{
    transcript: string;
    response: string;
    audio: Buffer;
  }> {
    const transcript = await this.transcribe(audioBuffer);
    const response = await this.generateResponse(transcript);
    const audio = await this.synthesizeSpeech(response);
    
    return { transcript, response, audio };
  }
  
  /**
   * Reset conversation history
   */
  resetConversation() {
    this.conversationHistory = [
      { role: 'system', content: FOX_SYSTEM_PROMPT }
    ];
  }
  
  /**
   * Get current conversation history (for debugging)
   */
  getHistory(): ConversationMessage[] {
    return [...this.conversationHistory];
  }
}

// Singleton instance manager for server-side conversations
const conversationManagers = new Map<string, FoxConversationManager>();

export function getOrCreateConversationManager(
  sessionId: string, 
  openaiApiKey: string
): FoxConversationManager {
  let manager = conversationManagers.get(sessionId);
  
  if (!manager) {
    manager = new FoxConversationManager({ openaiApiKey });
    conversationManagers.set(sessionId, manager);
  }
  
  return manager;
}

export function removeConversationManager(sessionId: string) {
  conversationManagers.delete(sessionId);
}
