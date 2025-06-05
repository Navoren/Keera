"use client";
 
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Particles } from "@/components/magicui/particles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
} from "lucide-react";


const faqs = [
  {
    question: "What is Keera?",
    answer:
      "Keera is a powerful project management platform designed to help teams plan, organize, and track their work with ease. It blends a clean, intuitive interface with robust features to improve workflows and enhance productivity.",
  },
  {
    question: "How does Keera compare to other project management tools?",
    answer:
      "Keera stands out by offering a smooth blend of simplicity, flexibility, and powerful functionality. Unlike many tools, it supports both agile and traditional project management styles, making it adaptable for diverse teams and project needs.",
  },
  {
    question: "Is Keera suitable for small teams?",
    answer:
      "Yes, Keera is built to be scalable and flexible. It works perfectly for small teams and seamlessly scales as your team or organization grows. Its user-friendly design ensures that teams of all sizes can get started quickly and work efficiently.",
  },
  {
    question: "What key features does Keera offer?",
    answer:
      "Keera includes a wide range of features like visual Kanban boards, advanced sprint planning tools, detailed reporting for data-driven decisions, customizable workflows, time tracking, and built-in collaboration tools. All features work in harmony to create a comprehensive project management experience.",
  },
  {
    question: "Can Keera handle multiple projects at once?",
    answer:
      "Absolutely. Keera is designed to manage several projects simultaneously. You can easily navigate between projects and get an overview of all ongoing work, making it a great fit for teams handling multiple clients or initiatives.",
  },
  {
    question: "Is Keera easy to learn for new users?",
    answer:
      "Keera is packed with powerful features, yet it's designed to be beginner-friendly. Thanks to its intuitive layout, guided onboarding, and detailed documentation, new users can get up and running in no time.",
  },
];



const features = [
  {
    title: "Smart Kanban Boards",
    description:
      "Easily map out your workflow and keep tasks organized with our user-friendly Kanban boards, designed to boost team clarity and efficiency.",
    icon: Layout,
  },
  {
    title: "Advanced Sprint Planning",
    description:
      "Effectively organize and manage your sprints to help teams stay aligned, focused, and on track for timely deliveries.",
    icon: Calendar,
  },
  {
    title: "Insightful Analytics & Reports",
    description:
      "Track progress and performance through rich, customizable reports that turn data into actionable insights.",
    icon: BarChart,
  },
];


export default function Home() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");
 
  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);
 
  return (
    <>
      <section id="hero" className=""> 
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg ">
      <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-8xl font-semibold leading-none">
        Orgainze your projects with <span className="underline decoration-indigo-500/30">Keera</span>
      </span>
      <span className="pointer-events-none z-10 mt-4 text-center text-lg text-muted-foreground">
        A Jira clone for managing your projects, tasks, and teams.
      </span>
        <div className="flex items-center justify-center gap-3 text-center mt-4">
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
            <Link className="flex justify-center items-center" href="/onboarding">Get Started <ChevronRight /></Link>
          </Button>
          <Button>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={500}
        ease={80}
        color={color}
        refresh
      />
    </div>
      </section>
      <section id="features" className="py-18 "> 
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <feature.icon className="h-8 w-8 text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="faq" className="py-18 ">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
      <section id="get-started" className="relative py-24 bg-transparent overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <Particles
      className="w-full h-full"
      quantity={50}
      ease={80}
      color={color}
      refresh
    />
  </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col text-center mb-12">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
              Get Started with Keera
            </h2>
            <p className="text-sm font-light"> Experience the power of Keera for free. Sign up today and transform the way you manage your projects and teams. </p>
          </div>
    
          
    <div className="flex justify-center">
      <Link href="/onboarding">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg px-6 py-3 text-lg font-semibold cursor-pointer">
          Start Your Free Trial
        </Button>
      </Link>
    </div>
  </div>
</section>

    </>
  );
}
