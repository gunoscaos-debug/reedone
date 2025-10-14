import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { database } from "./database";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  initialize(apiKey: string) {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      return true;
    } catch (error) {
      console.error("Failed to initialize AI service:", error);
      return false;
    }
  }

  async generateContent(prompt: string) {
    if (!this.model) {
      throw new Error("AI service not initialized");
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Failed to generate content:", error);
      throw error;
    }
  }

  async chat(messages: ChatMessage[]) {
    if (!this.model) {
      throw new Error("AI service not initialized");
    }

    try {
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
      });

      const result = await chat.sendMessage(messages[messages.length - 1].content);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Failed to chat:", error);
      throw error;
    }
  }

  async saveChat(title: string, messages: ChatMessage[]) {
    try {
      const chatHistory: ChatHistory = {
        id: Date.now().toString(),
        title,
        messages,
        timestamp: new Date()
      };

      await database.chatHistory.add(chatHistory);
      return chatHistory.id;
    } catch (error) {
      console.error("Failed to save chat:", error);
      throw error;
    }
  }

  async getChatHistory() {
    try {
      const history = await database.chatHistory.orderBy('timestamp').reverse().toArray();
      return history;
    } catch (error) {
      console.error("Failed to get chat history:", error);
      throw error;
    }
  }

  async getChat(id: string) {
    try {
      const chat = await database.chatHistory.get(id);
      return chat;
    } catch (error) {
      console.error("Failed to get chat:", error);
      throw error;
    }
  }

  async deleteChat(id: string) {
    try {
      await database.chatHistory.delete(id);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  }
}

// Instance singleton untuk layanan AI
export const aiService = new AIService();