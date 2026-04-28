/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
    id: string;
    name: string;
    description: string;
    benefit: string;
    hairProblem: string;
    usage: string;
    ingredient: string;
    color: 'magenta' | 'blue';
  }
  
  export interface QuizQuestion {
    id: number;
    question: string;
    options: {
      label: string;
      value: string;
      missionId: string;
    }[];
  }
  
  export const PRODUCTS: Product[] = [
    {
      id: 'root-revitalizing-tonic',
      name: 'Cica Root Revitalizing Tonic',
      description: 'Deeply nourishes from the roots to significantly reduce hair fall.',
      benefit: 'Stronger roots, less hair fall.',
      hairProblem: 'Hair Fall / Weak Roots',
      usage: 'Daily Leave-In',
      ingredient: 'Cica Extract + Biotin',
      color: 'magenta'
    },
    {
      id: 'scalp-comfort-serum',
      name: 'Cica Scalp Comfort Serum',
      description: 'Soothes itchy and oily scalp while preventing dandruff.',
      benefit: 'Instant scalp comfort & freshness.',
      hairProblem: 'Scalp Discomfort',
      usage: 'Daily / Post-Wash',
      ingredient: 'Cica Extract + Zinc',
      color: 'blue'
    },
    {
      id: 'protein-repair-mask',
      name: 'Cica Protein Repair Mask',
      description: 'Intensive treatment to restore styling-damaged and frizzy hair.',
      benefit: 'Silky smooth & repaired hair.',
      hairProblem: 'Damaged Hair',
      usage: 'Weekly Deep Treatment',
      ingredient: 'Cica Extract + Silk Protein',
      color: 'magenta'
    }
  ];
  
  export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
      id: 1,
      question: "What's your biggest hair concern right now?",
      options: [
        { label: "My hair falls easily when I brush it", value: "fall", missionId: "root-revitalizing-tonic" },
        { label: "My scalp feels itchy or oily", value: "scalp", missionId: "scalp-comfort-serum" },
        { label: "My hair feels rough, dry, or split ends", value: "damage", missionId: "protein-repair-mask" }
      ]
    },
    {
      id: 2,
      question: "How does your scalp feel after a long day?",
      options: [
        { label: "Normal, no major issues", value: "normal", missionId: "root-revitalizing-tonic" },
        { label: "Oily or itchy, especially if I wear hijab", value: "itchy", missionId: "scalp-comfort-serum" },
        { label: "Dry and sensitive", value: "dry", missionId: "protein-repair-mask" }
      ]
    },
    {
      id: 3,
      question: "How often do you use styling tools (curler, dryer, straightener)?",
      options: [
        { label: "Rarely, I prefer natural hair", value: "rare", missionId: "root-revitalizing-tonic" },
        { label: "Occasionally for special events", value: "occasional", missionId: "scalp-comfort-serum" },
        { label: "Almost every day!", value: "daily", missionId: "protein-repair-mask" }
      ]
    }
  ];
  