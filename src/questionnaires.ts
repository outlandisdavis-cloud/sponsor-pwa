// src/questionnaires.ts — validated instrument definitions + scoring
export type QuestionnaireId = 'PHQ9' | 'GAD7' | 'PACS' | 'HALT'

export interface Question { id: string; text: string; options: { label: string; value: number }[] }

export const QUESTIONNAIRES: Record<QuestionnaireId, { name: string; questions: Question[]; score: (answers: number[]) => number }> = {
  PHQ9: {
    name: 'PHQ-9 (Depression)',
    questions: Array.from({ length: 9 }, (_, i) => ({
      id: `q${i + 1}`,
      text: [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling/staying asleep, or sleeping too much',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself',
        'Trouble concentrating',
        'Moving/speaking slowly or being fidgety',
        'Thoughts that you would be better off dead or of hurting yourself',
      ][i],
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    })),
    score: (a) => a.reduce((s, v) => s + v, 0),
  },
  GAD7: {
    name: 'GAD-7 (Anxiety)',
    questions: Array.from({ length: 7 }, (_, i) => ({
      id: `q${i + 1}`,
      text: `Anxiety item ${i + 1}`,
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    })),
    score: (a) => a.reduce((s, v) => s + v, 0),
  },
  PACS: {
    name: 'PACS (Craving)',
    questions: [
      { id: 'q1', text: 'How strong was your craving?', options: [{ label: 'None', value: 0 }, { label: 'Mild', value: 1 }, { label: 'Moderate', value: 2 }, { label: 'Strong', value: 3 }, { label: 'Extreme', value: 4 }] },
    ],
    score: (a) => a.reduce((s, v) => s + v, 0),
  },
  HALT: {
    name: 'HALT Check',
    questions: [
      { id: 'H', text: 'Hungry?', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }] },
      { id: 'A', text: 'Angry?', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }] },
      { id: 'L', text: 'Lonely?', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }] },
      { id: 'T', text: 'Tired?', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }] },
    ],
    score: (a) => a.reduce((s, v) => s + v, 0),
  },
}

export function phq9Item9(answers: number[]): boolean {
  // PHQ-9 item 9 is the 9th question (index 8)
  return (answers[8] ?? 0) >= 1
}
