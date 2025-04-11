const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateInterviewQuestions(jobDetails) {
    try {
      const prompt = `Generate a set of interview questions based on the following job details:
      
Title: ${jobDetails.title}
Description: ${jobDetails.description}
Required Skills: ${jobDetails.skills.join(', ')}
Experience Level: ${jobDetails.experienceLevel}

Please generate:
1. 3 technical questions specific to the required skills
2. 2 behavioral questions relevant to the role
3. 2 problem-solving questions related to the job responsibilities

For each question, provide:
- Question text
- Expected answer points or evaluation criteria
- Difficulty level (beginner/intermediate/advanced)
- Type (technical/behavioral/problem-solving)
- Maximum points (1-10)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const formattedQuestions = this.parseGeneratedQuestions(response.text());
      
      return formattedQuestions;
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error('Failed to generate interview questions');
    }
  }

  parseGeneratedQuestions(rawText) {
    // This is a basic parser - enhance based on actual Gemini output format
    const questions = [];
    const sections = rawText.split(/\d+\./g).filter(Boolean);
    
    sections.forEach(section => {
      const lines = section.trim().split('\n').filter(Boolean);
      if (lines.length >= 2) {
        const question = {
          type: this.determineQuestionType(section),
          question: lines[0].trim(),
          points: this.extractPoints(section) || 5,
          explanation: lines.slice(1).join('\n').trim(),
          options: [], // For multiple choice questions if needed
          level: this.determineQuestionLevel(section) || 'intermediate'
        };
        questions.push(question);
      }
    });

    return questions;
  }

  determineQuestionType(text) {
    if (text.toLowerCase().includes('technical')) return 'technical';
    if (text.toLowerCase().includes('behavioral')) return 'behavioral';
    return 'problem-solving';
  }

  determineQuestionLevel(text) {
    if (text.toLowerCase().includes('beginner')) return 'beginner';
    if (text.toLowerCase().includes('advanced')) return 'advanced';
    return 'intermediate';
  }

  extractPoints(text) {
    const pointsMatch = text.match(/(\d+)\s*points?/i);
    return pointsMatch ? parseInt(pointsMatch[1]) : null;
  }
}

module.exports = new GeminiService(); 