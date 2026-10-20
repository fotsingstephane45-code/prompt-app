import { PenLine, Image as ImageIcon, Code, BarChart3, Briefcase } from 'lucide-react'

export const CATEGORIES = {
  'Rédaction': { icon: PenLine, bg: '#ede7f6', fg: '#6b4fa0' },
  'Créativité': { icon: ImageIcon, bg: '#fbe6e0', fg: '#c0563f' },
  'Développement': { icon: Code, bg: '#e0ebf7', fg: '#3a6ea5' },
  'Marketing': { icon: BarChart3, bg: '#e0efe6', fg: '#2b6b4f' },
  'Productivité': { icon: Briefcase, bg: '#f7ebd3', fg: '#a8731a' },
}

export const CATEGORY_NAMES = Object.keys(CATEGORIES)