import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generatePersonalizedQuiz(subject: string, difficulty: string, previousPerformance: string) {
  const prompt = `
    Generate a 5-question multiple choice quiz for a student in ${subject} at ${difficulty} level.
    The student's previous performance was: ${previousPerformance}.
    Adjust the specificity and complexity based on this.
    Return ONLY a JSON array of objects with the following schema:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": number (index 0-3)
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini failed to generate quiz:", error);
    throw error;
  }
}

export async function matchStudyBuddy(studentA: any, allStudents: any[]) {
    const prompt = `
        Given student A: ${JSON.stringify(studentA)}
        And a list of potential buddies: ${JSON.stringify(allStudents)}
        Match Student A with the best buddy based on complementary strengths and weaknesses.
        Return the ID of the best match and a one-sentence reason.
        Return ONLY JSON: {"matchId": "string", "reason": "string"}
    `;
    
    try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini failed to match buddy:", error);
        throw error;
    }
}
