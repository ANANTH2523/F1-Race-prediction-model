// This file provides services for interacting with the Google Gemini API.
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionData, DriverStatsEntry } from './types';
import { F1_2026_DRIVERS, F1_WDC_STANDINGS } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const driverStatsSchema = {
    type: Type.OBJECT,
    properties: {
        championshipPosition: { type: Type.INTEGER },
        points: { type: Type.INTEGER },
        recentForm: { type: Type.STRING },
        constructorPosition: { type: Type.INTEGER },
    },
    required: ["championshipPosition", "points", "recentForm", "constructorPosition"]
};

const driverStatsEntrySchema = {
    type: Type.OBJECT,
    properties: {
        driver: { type: Type.STRING },
        stats: driverStatsSchema,
    },
    required: ["driver", "stats"]
};

const predictionSchema = {
    type: Type.OBJECT,
    properties: {
        weather: {
            type: Type.OBJECT,
            properties: {
                condition: { type: Type.STRING },
                temperature: { type: Type.STRING },
                detail: { type: Type.STRING },
            },
            required: ["condition", "temperature", "detail"]
        },
        podium: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    position: { type: Type.INTEGER },
                    driver: { type: Type.STRING },
                    team: { type: Type.STRING },
                },
                required: ["position", "driver", "team"]
            }
        },
        fullResults: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    position: { type: Type.INTEGER },
                    driver: { type: Type.STRING },
                    team: { type: Type.STRING },
                    startingPosition: { type: Type.INTEGER },
                },
                required: ["position", "driver", "team", "startingPosition"]
            }
        },
        fastestLap: {
            type: Type.OBJECT,
            properties: {
                driver: { type: Type.STRING },
                team: { type: Type.STRING },
                time: { type: Type.STRING },
            },
            required: ["driver", "team", "time"]
        },
        driverOfTheDay: {
            type: Type.OBJECT,
            properties: {
                driver: { type: Type.STRING },
                team: { type: Type.STRING },
            },
            required: ["driver", "team"]
        },
        fastestPitstop: {
            type: Type.OBJECT,
            properties: {
                team: { type: Type.STRING },
                time: { type: Type.STRING },
            },
            required: ["team", "time"]
        },
        winProbabilities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    driver: { type: Type.STRING },
                    team: { type: Type.STRING },
                    probability: { type: Type.NUMBER },
                },
                required: ["driver", "team", "probability"]
            }
        },
        polePosition: {
            type: Type.OBJECT,
            properties: {
                driver: { type: Type.STRING },
                team: { type: Type.STRING },
                time: { type: Type.STRING },
            },
            required: ["driver", "team", "time"]
        },
        keyRivalries: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING },
                },
                required: ["drivers", "description"]
            }
        },
        teamStrategies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    team: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ["team", "description"]
            }
        },
        driverStats: {
            type: Type.ARRAY,
            items: driverStatsEntrySchema
        }
    },
    required: [
        "weather", "podium", "fullResults", "fastestLap", "driverOfTheDay",
        "fastestPitstop", "winProbabilities", "polePosition", "keyRivalries",
        "teamStrategies", "driverStats"
    ]
};

export const getRacePrediction = async (race: string, historicalData: string): Promise<PredictionData> => {
    
    const driverList = F1_2026_DRIVERS.join(', ');
    const wdcStandings = JSON.stringify(F1_WDC_STANDINGS, null, 2);

    const prompt = `
    Analyze the upcoming Formula 1 race at ${race} and provide a detailed prediction.

    Current Context:
    - 2026 F1 Grid: 11 teams, 22 drivers total including the new Cadillac F1 Team.
    - Driver Grid for the race: ${driverList}.
    - Current WDC Standings (2025 Season): ${wdcStandings}.
    - User-provided historical notes: "${historicalData || "None"}".

    Your task is to generate a comprehensive race prediction based on all available data, including historical performance at this circuit, current driver and team form, car characteristics, and potential weather conditions.
    
    **Detailed Instructions for Specific Fields:**

    - **keyRivalries**: Provide 2-3 specific rivalries to watch. For each, give a detailed explanation. Don't just say they are competitors. Explain *why* it's a key rivalry for this specific race, mentioning factors like past on-track incidents (especially at this circuit), current championship battles, or intense midfield competition for points. Your explanation should be specific and insightful.

    - **teamStrategies**: Predict the likely race strategy for 2-3 key teams. Be specific. Instead of saying 'they will manage their tires', describe the potential strategy in detail, such as 'a likely one-stop starting on Mediums and switching to Hards around lap 28-32 to defend track position' or 'an aggressive two-stop (Soft-Medium-Medium) to leverage their car's pace in clean air, using the undercut'. Justify your prediction based on the team's car performance, driver style, or historical choices at this track.

    Ensure all driver and team names in your JSON output match the official names provided in the constants. For driver stats, provide an entry for every driver in the race (all 22 drivers).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: predictionSchema,
            },
        });

        const predictionData: PredictionData = JSON.parse(response.text);
        
        // Data validation and cleanup
        if (predictionData.podium && predictionData.podium.length > 3) {
            predictionData.podium = predictionData.podium.slice(0, 3);
        }

        if (predictionData.winProbabilities) {
            predictionData.winProbabilities.sort((a, b) => b.probability - a.probability);
        }

        return predictionData;
    } catch (error: any) {
        console.error("Error fetching race prediction:", error);
        if (error.message && error.message.includes('500')) {
             throw new Error('The AI service is temporarily unavailable or experiencing high traffic. Please try again in a few moments.');
        }
        throw new Error(`Failed to get race prediction. The AI model may have returned an invalid format. Details: ${error.message}`);
    }
};