export type QuestionGroup = FillBlanksGroup | MCQGroup | MapGroup;

export interface ListeningTest {
  id: string;
  title: string;
  type: string;
  duration: number;
  audioUrl: string;
  parts: TestPart[];
}

export interface TestPart {
  title: string;
  questions: QuestionGroup[];
}

// Fill in the Blanks Type
export interface FillBlanksGroup {
  type: "fill_in_the_blanks_with_subtitle";
  content: {
    title?: string;
    subtitle?: string;
    extra: string[];
    questions: FillQuestion[];
  }[];
}

export interface FillQuestion {
  question_number: number;
  answer: string;
  input_type: string;
}

// MCQ Type
export interface MCQGroup {
  type: "mcq";
  content: MCQItem[];
}

export interface MCQItem {
  question_number: number;
  question: string;
  answer: string;
  options: Option[];
  input_type: string;
  min_selection: number;
  max_selection: number;
}

export interface Option {
  label: string;
  value: string;
}

// Map Type
export interface MapGroup {
  type: "map";
  content: MapItem[];
}

export interface MapItem {
  title: string;
  image: string;
  labels: string[];
  questions: MapQuestion[];
}

export interface MapQuestion {
  question_number: number;
  question: string;
  answer: string;
  input_type: string;
  min_selection: number;
  max_selection: number;
}
