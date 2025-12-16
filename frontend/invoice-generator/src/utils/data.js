import { BarChart2, FileText, Mail, Sparkles, LayoutDashboard, Plus, Users } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
      "Paste any text, email, or receipt, and let our AI instantly generate a complete, professional invoice for you.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your business finances, generated automatically by our AI analyst.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Automatically generate polite and effective payment reminder emails for overdue invoices with a single click.",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Easily manage all your invoices, track payments, and send reminders for overdue payments.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "This app saved me hours of work. I can now create and send invoices in minutes!",
    author: "Virat Kohli",
    title: "Freelance Designer",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=JD",
  },
  {
    quote: "The best invoicing app I have ever used. Simple, intuitive, and powerful.",
    author: "Mahendra Singh Dhoni",
    title: "Small Business Owner",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=JS",
  },
  {
    quote: "I love the dashboard and reporting features. It helps me keep track of my finances easily!",
    author: "Rohit Sharma",
    title: "Consultant",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=PJ",
  },
];

export const FAQS = [
  {
    question: "How does the AI invoice creation work?",
    answer:
      "Simply paste any text that contains invoice details—like an email, notes, or a list of items, or a work summary —and our AI will instantly parse it to pre-fill a new invoice for you, saving your time and effort"
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, you can try our platform for free for 14 days. If you want, we’ll help you set up your business details during the trial to get the most accurate results.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Of course. Our pricing scales with your company. You can upgrade or downgrade your plan at any time.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel your plan at any time and continue using the remaining days of your subscription without penalties.",
  },
  {
    question: "Can extra information be added to an invoice?",
    answer:
      "Yes. You can add notes, payment terms, tax information, discounts, and even attach files to your invoices.",
  },
  {
    question: "How does billing work?",
    answer:
      "Billing is done per workspace, not per individual account. You can upgrade one workspace without affecting others.",
  },
  {
    question: "How do I change my account email?",
    answer:
      "You can update your email anytime in the Profile Settings inside your dashboard.",
  },
];

export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "invoices/new", name: "Create Invoice", icon: Plus },
  { id: "profile", name: "Profile", icon: Users },
];

