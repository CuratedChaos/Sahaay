const API_KEY = "AIzaSyCg31zY_uox15OvjjIfFgk3cv9KPCPQai4";
const MODEL = "models/gemini-2.5-flash";

export async function generateGeminiSummary(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Summarize this classroom session clearly in bullet points:\n\n${text}`
          }]
        }]
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Gemini request failed");
  }

  return data.candidates[0].content.parts[0].text;
}