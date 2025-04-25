import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); 

export async function getCompanyOverview(domain) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide a detailed overview of the company associated with the domain "${domain}" in 5-6 sentences. Include the following details: the company's full name, its primary industry, a brief history, the number of employees, company locations (headquarters and major offices), key products or services, notable achievements, and any recent developments. Ensure the information is concise, accurate, and well-structured. If exact data (e.g., employee count or locations) is unavailable, provide an estimated range or note that the information is not publicly available.`;

    const result = await model.generateContent(prompt);
    console.log("Result", result);
    const overview = await result.response.text();
    console.log("Overview", overview);

    // console.log(overview);
    return overview;
  } catch (error) {
    console.error("Error fetching company overview:", error);
    if (error.status === 429) {
      console.log("Rate limit hit. Waiting 10 seconds...");
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      return getCompanyOverview(domain); // Retry
    }
    throw error;
  }
}