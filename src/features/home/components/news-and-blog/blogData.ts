// Static blog post data for the "News and Blog" Home section preview.
// This is presentation-only configuration — no API or backend is involved.

import news1 from "@/assets/images/blog/news1.png";
import news2 from "@/assets/images/blog/news2.png";
import news3 from "@/assets/images/blog/news3.png";

export interface BlogPost {
  id: number;
  image: string;
  imageAlt: string;
  category: string;
  title: string;
  description: string;
  authorName: string;
  authorInitials: string;
  date: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    image: news1,
    imageAlt: "Team collaborating around a laptop",
    category: "News",
    title: "21 Job Interview Tips: How To Make a Great Impression",
    description:
      "Our mission is to create the world's most sustainable healthcare company by creating high-quality healthcare products in iconic, sustainable packaging.",
    authorName: "Sarah Harding",
    authorInitials: "SH",
    date: "06 September",
    readTime: "8 mins to read",
  },
  {
    id: 2,
    image: news2,
    imageAlt: "Professional woman with headset working at desk",
    category: "Events",
    title: "39 Strengths and Weaknesses To Discuss in a Job Interview",
    description:
      "Our mission is to create the world's most sustainable healthcare company by creating high-quality healthcare products in iconic, sustainable packaging.",
    authorName: "Steven Jobs",
    authorInitials: "SJ",
    date: "06 September",
    readTime: "6 mins to read",
  },
  {
    id: 3,
    image: news3,
    imageAlt: "Group of diverse professionals celebrating",
    category: "News",
    title: "Interview Question: Why Dont You Have a Degree?",
    description:
      "Learn how to respond if an interviewer asks you why you dont have a degree, and read example answers that can help you craft",
    authorName: "Wiliam Kend",
    authorInitials: "WK",
    date: "06 September",
    readTime: "9 mins to read",
  },
  {
    id: 4,
    image: news1,
    imageAlt: "Team collaborating around a laptop",
    category: "News",
    title: "How To Write a Great Resume That Gets You Hired",
    description:
      "A great resume is your first impression. Learn the key sections, formatting tips, and action words that help recruiters notice your application.",
    authorName: "Sarah Harding",
    authorInitials: "SH",
    date: "06 September",
    readTime: "5 mins to read",
  },
];
