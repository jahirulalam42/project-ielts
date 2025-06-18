export interface Option {
  label: string;
  value: string;
}

export interface Blank {
  blank_number: number;
  input_type: string;
  answer: string;
}

export type QuestionType =
  | "true_false_not_given"
  | "fill_in_the_blanks"
  | "mcq"
  | "matching_headings"
  | "paragraph_matching"
  | "multiple_mcq"
  | "passage_fill_in_the_blanks"
  | "summary_fill_in_the_blanks"
  | "fill_in_the_blanks_with_subtitle";

export interface Question {
  question_number?: any;
  question_numbers?: number[];
  question: string;
  questions: any;
  answer?: string | string[];
  options?: Option[];
  input_type: string;
  min_selection?: number;
  max_selection?: number;
  correct_mapping?: string[];
  instruction?: string;
  text?: string;
  blanks?: Blank[];
  passage?: string;
  answers?: string[];
  title: string;
  subtitle: string;
  extra: any;
}

export interface Passage {
  title: string;
  instructions: string;
  passage_title: string;
  passage_subtitle: string;
  passage: any;
  image: string;
  questions: Record<string, Question[]>[];
  passageType: "type1" | "type2";
}

export interface ReadingTest {
  title: string;
  type: "academic" | "general";
  duration: number;
  parts: Passage[];
}

export const questionTypes: QuestionType[] = [
  "true_false_not_given",
  "fill_in_the_blanks",
  "mcq",
  "matching_headings",
  "paragraph_matching",
  "multiple_mcq",
  "passage_fill_in_the_blanks",
  "summary_fill_in_the_blanks",
  "fill_in_the_blanks_with_subtitle",
]; 