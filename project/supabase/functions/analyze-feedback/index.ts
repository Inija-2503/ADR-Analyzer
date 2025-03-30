import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Extended symptom map with multiple keywords (synonyms)
const symptomsMap = {
  headache: {
    disease: "Medication-Induced Headache",
    recommendation:
      "Consider switching to Acetaminophen or reducing current medication dosage",
    keywords: ["headache", "head pain", "ache in head"],
  },
  nausea: {
    disease: "Drug-Induced Nausea",
    recommendation:
      "Take medication with food, consider anti-nausea medication like Ondansetron",
    keywords: ["nausea", "vomiting", "throwing up", "queasy"],
  },
  rash: {
    disease: "Drug Allergy",
    recommendation:
      "Discontinue medication and consult healthcare provider. Antihistamines may help.",
    keywords: ["rash", "skin redness", "itching", "hives"],
  },
  dizziness: {
    disease: "Medication Side Effect",
    recommendation:
      "Monitor blood pressure, consider dose adjustment",
    keywords: ["dizzy", "dizziness", "lightheaded", "faint"],
  },
  fatigue: {
    disease: "Drug-Induced Fatigue",
    recommendation:
      "Adjust medication timing, consider dose reduction",
    keywords: ["fatigue", "tired", "weak", "exhausted"],
  },
};

function analyzeSymptoms(subject: string, symptoms: string) {
  const combinedText = (subject + " " + symptoms).toLowerCase();

  for (const key in symptomsMap) {
    const { keywords, disease, recommendation } =
      symptomsMap[key as keyof typeof symptomsMap];

    const match = keywords.some((kw) => combinedText.includes(kw));
    if (match) {
      return { disease, recommendation };
    }
  }

  return {
    disease: "Unspecified Reaction",
    recommendation:
      "Please consult your healthcare provider for a detailed evaluation.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, symptoms } = await req.json();
    const analysis = analyzeSymptoms(subject, symptoms);

    return new Response(JSON.stringify(analysis), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to analyze symptoms" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
