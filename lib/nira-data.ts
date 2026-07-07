import {
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  CheckCircle2,
  Crown,
  FileText,
  Flame,
  Gem,
  GraduationCap,
  Library,
  MessageCircleQuestion,
  PencilLine,
  Sparkles,
  Trophy,
  Volume2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StudyArea = "Learn" | "Flashcards" | "Admin" | "Analytics";

export type LessonQuestion = {
  id: string;
  prompt: string;
  helper: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type SkillNode = {
  title: string;
  description: string;
  state: "complete" | "current" | "locked";
  xp: number;
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const coursePath: SkillNode[] = [
  {
    title: "Greetings",
    description: "Say hello, introduce yourself, and ask simple questions.",
    state: "complete",
    xp: 120
  },
  {
    title: "Family",
    description: "Talk about family members with Persian-first grammar notes.",
    state: "current",
    xp: 80
  },
  {
    title: "Food",
    description: "Order food, read simple menus, and practice articles.",
    state: "locked",
    xp: 0
  },
  {
    title: "Travel",
    description: "Use real phrases for stations, tickets, and directions.",
    state: "locked",
    xp: 0
  }
];

export const lessonQuestions: LessonQuestion[] = [
  {
    id: "q1",
    prompt: "Choose the best Persian meaning for: Ich heiße Sara.",
    helper: "A1 introductions",
    options: ["من سارا هستم.", "من سارا را دوست دارم.", "سارا کجاست؟"],
    answer: "من سارا هستم.",
    explanation:
      "'Ich heiße ...' is the natural German phrase for saying your name."
  },
  {
    id: "q2",
    prompt: "Complete the sentence: Das ist ___ Bruder.",
    helper: "Possessive pronouns",
    options: ["mein", "meine", "einen"],
    answer: "mein",
    explanation:
      "'Bruder' is masculine, so the nominative possessive form is 'mein'."
  },
  {
    id: "q3",
    prompt: "Put the words in the natural order: komme / Iran / aus / Ich",
    helper: "German sentence order",
    options: ["Ich komme aus Iran", "Aus ich Iran komme", "Komme ich Iran aus"],
    answer: "Ich komme aus Iran",
    explanation:
      "The verb usually takes the second position in a simple German sentence."
  }
];

export const flashcards = [
  { front: "die Familie", back: "خانواده", due: "Today", strength: 88 },
  { front: "der Bruder", back: "برادر", due: "Today", strength: 74 },
  { front: "heißen", back: "نام داشتن", due: "Tomorrow", strength: 91 }
];

export const adminQueue = [
  { item: "A1 Unit 2 vocabulary", status: "Review", owner: "Content Editor" },
  { item: "Family checkpoint", status: "Draft", owner: "German Reviewer" },
  { item: "Audio for greetings", status: "Published", owner: "Admin" }
];

export const strengths = [
  { label: "Vocabulary", value: 82 },
  { label: "Grammar", value: 68 },
  { label: "Reading", value: 74 },
  { label: "Consistency", value: 91 }
];

export const featureCards: Feature[] = [
  {
    icon: GraduationCap,
    title: "CEFR learning path",
    description:
      "A guided path from A1 upward, split into small skills that always tell learners what to study next."
  },
  {
    icon: Brain,
    title: "Persian-first teaching",
    description:
      "Grammar explanations, feedback, and examples are designed around Persian-speaking learners."
  },
  {
    icon: Library,
    title: "Smart flashcards",
    description:
      "Vocabulary turns into review cards automatically, with personal cards for learner-owned memory."
  },
  {
    icon: Sparkles,
    title: "Human-reviewed AI",
    description:
      "AI assists admins with drafts, but educational content stays reviewed and controlled by humans."
  },
  {
    icon: ChartNoAxesCombined,
    title: "Meaningful analytics",
    description:
      "Progress focuses on study consistency, weak areas, flashcards, and completed learning goals."
  },
  {
    icon: Crown,
    title: "Trustworthy premium",
    description:
      "Premium unlocks deeper learning value without hearts, ads, forced waiting, or punishments."
  }
];

export const stats = [
  { icon: Flame, value: "12", label: "day streak" },
  { icon: Trophy, value: "840", label: "XP earned" },
  { icon: CheckCircle2, value: "18", label: "skills done" },
  { icon: Gem, value: "A1", label: "current level" }
];

export const resourceCards = [
  { icon: Volume2, title: "Native audio", label: "Pronunciation" },
  { icon: FileText, title: "Exam-style PDFs", label: "Resources" },
  { icon: PencilLine, title: "Writing prompts", label: "Practice" },
  { icon: MessageCircleQuestion, title: "Mistake feedback", label: "Review" },
  { icon: BookOpen, title: "Grammar notes", label: "Persian guide" }
];
