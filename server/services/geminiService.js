const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');

async function extractTextFromCV(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function generateCoverLetter(cvText, job) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = `
You are a professional career assistant.
Generate a personalized cover letter for the following job:
Job Title: ${job.title}
Company: ${job.company}
Description: ${job.description}

Based on the candidate's resume:
${cvText}

Generate a professional cover letter that highlights the candidate's relevant skills and experience for this position.
The cover letter should be well-structured, formal, and no more than 400 words.
`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro/generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      throw new Error('Invalid response from Gemini API');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate cover letter. Please try again later.');
  }
}

module.exports = { extractTextFromCV, generateCoverLetter };
