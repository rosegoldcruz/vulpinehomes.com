import { NextRequest, NextResponse } from "next/server";
import { 
  FoxConversationManager, 
  FOX_GREETING,
  getOrCreateConversationManager,
  removeConversationManager 
} from "@/lib/fox-agent";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Content-Type": "application/json",
} as const;

/**
 * POST /api/fox-conversation
 * 
 * Handles conversation turns with the Fox AI agent.
 * 
 * Request body:
 * - action: "greeting" | "transcribe" | "respond" | "full-turn" | "end"
 * - sessionId: unique session identifier
 * - audio?: base64-encoded audio data (for transcribe/full-turn)
 * - text?: text message (for respond without audio)
 * 
 * Response:
 * - transcript?: transcribed text from audio
 * - response?: AI-generated response text
 * - audio?: base64-encoded MP3 audio of the response
 * - success: boolean
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, audio, text } = body;
    
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required", success: false },
        { status: 400, headers: noStoreHeaders }
      );
    }
    
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured", success: false },
        { status: 500, headers: noStoreHeaders }
      );
    }
    
    const manager = getOrCreateConversationManager(sessionId, openaiKey);
    
    switch (action) {
      case "greeting": {
        // Generate greeting audio for initial connection
        const greetingAudio = await manager.generateGreeting();
        const audioBase64 = greetingAudio.toString("base64");
        
        return NextResponse.json({
          success: true,
          response: FOX_GREETING,
          audio: audioBase64,
          audioFormat: "mp3",
        }, { headers: noStoreHeaders });
      }
      
      case "transcribe": {
        // Transcribe audio only
        if (!audio) {
          return NextResponse.json(
            { error: "Audio data is required for transcription", success: false },
            { status: 400, headers: noStoreHeaders }
          );
        }
        
        const audioBuffer = Buffer.from(audio, "base64");
        const transcript = await manager.transcribe(audioBuffer);
        
        return NextResponse.json({
          success: true,
          transcript,
        }, { headers: noStoreHeaders });
      }
      
      case "respond": {
        // Generate response from text
        if (!text) {
          return NextResponse.json(
            { error: "Text is required for response generation", success: false },
            { status: 400, headers: noStoreHeaders }
          );
        }
        
        const response = await manager.generateResponse(text);
        const responseAudio = await manager.synthesizeSpeech(response);
        const audioBase64 = responseAudio.toString("base64");
        
        return NextResponse.json({
          success: true,
          response,
          audio: audioBase64,
          audioFormat: "mp3",
        }, { headers: noStoreHeaders });
      }
      
      case "full-turn": {
        // Complete conversation turn: audio -> transcript -> response -> audio
        if (!audio) {
          return NextResponse.json(
            { error: "Audio data is required for full conversation turn", success: false },
            { status: 400, headers: noStoreHeaders }
          );
        }
        
        const audioBuffer = Buffer.from(audio, "base64");
        const result = await manager.processConversationTurn(audioBuffer);
        const audioBase64 = result.audio.toString("base64");
        
        return NextResponse.json({
          success: true,
          transcript: result.transcript,
          response: result.response,
          audio: audioBase64,
          audioFormat: "mp3",
        }, { headers: noStoreHeaders });
      }
      
      case "end": {
        // End session and cleanup
        removeConversationManager(sessionId);
        
        return NextResponse.json({
          success: true,
          message: "Session ended",
        }, { headers: noStoreHeaders });
      }
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}`, success: false },
          { status: 400, headers: noStoreHeaders }
        );
    }
  } catch (error) {
    console.error("[fox-conversation] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error", success: false },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
