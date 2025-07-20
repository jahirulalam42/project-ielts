export type QuestionGroup = FillBlanksGroup | MCQGroup | MapGroup;

export interface ListeningTest {
  title: string;
  type: "academic" | "general";
  duration: number;
  audioUrl: string;
  cloudinaryPublicId?: string;
  audioDuration?: number;
  audioFormat?: string;
  audioSize?: number;
  parts: TestPart[];
}

export interface TestPart {
  title: string;
  questions: QuestionGroup[];
}

// Fill in the Blanks Type
export interface FillBlanksGroup {
  fill_in_the_blanks_with_subtitle: {
    title?: string;
    subtitle?: string;
    extra: string[];
    questions: {
      question_number: number;
      answer: string;
      input_type: string;
    }[];
  }[];
}

export interface FillQuestion {
  question_number: number;
  answer: string;
  input_type: string;
}

// MCQ Type
export interface MCQGroup {
  mcq: MCQItem[];
}

export interface MCQItem {
  question_number: number;
  question: string;
  answer: string;
  options: {
    label: string;
    value: string;
  }[];
  input_type: string;
  min_selection: number;
  max_selection: number;
}

// Map Type
export interface MapGroup {
  map: MapItem[];
}

export interface MapItem {
  title: string;
  image: string;
  labels: string[];
  questions: {
    question_number: number;
    question: string;
    answer: string;
    input_type: string;
    min_selection: number;
    max_selection: number;
  }[];
}

export interface MapQuestion {
  question_number: number;
  question: string;
  answer: string;
  input_type: string;
  min_selection: number;
  max_selection: number;
}

// Fill in the Blanks Type
export interface FillBlanksItem {
  title?: string;
  subtitle?: string;
  extra: string[];
  questions: {
    question_number: number;
    answer: string;
    input_type: string;
  }[];
}
