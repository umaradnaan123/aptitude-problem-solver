export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOBlock {
  title: string;
  subtitle?: string;
  content: string[];
}

export const HOMEPAGE_SEO_CONTENT = {
  about: {
    title: "What is the Aptitude Problem Solver?",
    content: [
      "The Aptitude Problem Solver is an advanced, AI-powered interactive calculation and learning platform designed to help students, job seekers, and professionals master essential quantitative aptitude, logical reasoning, and verbal mathematical principles.",
      "Aptitude tests are the primary screening mechanism used globally by top-tier MNCs, engineering institutions, public sector undertakings (PSUs), banks, and civil services. Yet, thousands of candidates struggle with complex formulas, time management, and step-by-step problem-solving. This platform solves that exact problem by combining instant interactive calculators with an exhaustive, pedagogically structured formula bank and detailed step-by-step solution generators.",
      "Whether you are preparing for placement exams, government competitive exams (like UPSC, SSC, banking), management entrance tests (CAT, GMAT, GRE), or campus recruitment, our platform provides the math solvers and explanations needed to transition from conceptual confusion to mathematical mastery."
    ]
  },
  whyUse: {
    title: "Why Students and Job Aspirants Rely on Our Solver",
    content: [
      "Traditional learning resources like textbooks or static PDFs are passive; they show you a formula but don't let you experiment with different values. Online forums often display quick answers without showing the underlying mathematical derivations or step-by-step arithmetic operations.",
      "The Aptitude Problem Solver bridges this gap through active learning. Our platform offers real-time numerical calculators for compound interest, time & work, relative speed of trains, permutation and combination, and more. When you input your custom values, our engine doesn't just output a final answer—it dynamically generates the detailed calculation steps, showing you exactly how the variables interact, which conversions are applied (such as converting speed from km/h to m/s), and how to simplify the final equation.",
      "Key benefits of our platform include: (1) Instant step-by-step solutions that build conceptual clarity, (2) Progressive Web App (PWA) capability that runs smoothly offline, (3) A sleek dark-mode user interface designed to maximize focus, and (4) Direct alignment with the current exam patterns of top companies like TCS, Wipro, Infosys, Accenture, Wipro, and Capgemini."
    ]
  },
  features: {
    title: "Key Features & Capabilities",
    items: [
      {
        title: "Dynamic Mathematical Calculators",
        description: "Compute complex aptitude questions in real-time. Enter variables for Interest, Work, Time & Speed, or Probability, and receive instantly generated solutions with precise decimal breakdown."
      },
      {
        title: "Dynamic Step-by-Step Solvers",
        description: "Our solvers break down equations step-by-step, mimicking the pedagogy of a personal mathematics tutor. Ideal for learning the 'why' behind the calculations."
      },
      {
        title: "Comprehensive Formula Bank",
        description: "An organized library of essential rules, shortcuts, derivations, and quick-computation tricks for over 25 major topics. Stop memorizing—understand the structure."
      },
      {
        title: "Company-Wise Placement Prep",
        description: "Dedicated resources and questions tailored for campus recruitment tests of IT service giants and consultancies, including Wipro, Infosys, TCS, and Accenture."
      },
      {
        title: "Offline-First Support",
        description: "Fully cached functionality via service workers. Access calculators and formula banks on the go, even in low-bandwidth or offline environments."
      }
    ]
  },
  howItWorks: {
    title: "How It Works: 3 Simple Steps to Mastery",
    steps: [
      {
        step: "1",
        title: "Select a Topic or Calculator",
        description: "Browse our structured dashboard categories. Select a topic such as Simple Interest, Problems on Trains, or Time and Work based on your current study module."
      },
      {
        step: "2",
        title: "Input Variables",
        description: "Type in the values from your practice problem. The interactive input fields automatically show units (e.g. ₹, %, years, meters) to prevent formatting errors."
      },
      {
        step: "3",
        title: "View Steps & Export Reports",
        description: "Review the instantly generated mathematical steps. You can copy the solution to your clipboard, save the query to your history log, or export a detailed text report."
      }
    ]
  },
  faqs: [
    {
      question: "What is Quantitative Aptitude and why is it important?",
      answer: "Quantitative Aptitude refers to the ability to solve numerical and mathematical problems, analyze quantitative data, and make logical deductions. It forms a key part of competitive exams and job recruitment tests because it evaluates a candidate's mental sharpness, analytical capabilities, and critical thinking speed under time constraints."
    },
    {
      question: "How do the calculators help in placement preparation?",
      answer: "Instead of just showing static solutions, our calculators let you input any values from your practice papers and see the dynamic, step-by-step breakdown. This helps you identify where you went wrong in your hand calculations, understand the formula logic, and verify your answers instantly."
    },
    {
      question: "Can I use the Aptitude Solver offline?",
      answer: "Yes! Our platform is built as a Progressive Web App (PWA). Once you visit the site, the service worker caches the core modules, calculators, and formula sheets, allowing you to use all tools without an active internet connection."
    },
    {
      question: "Which companies' placement exams are covered here?",
      answer: "We provide targeted practice and conceptual frameworks for top IT service companies and global enterprises, including TCS (NQT), Wipro (NLTH), Infosys (System Engineer & Specialist Programmer), Accenture, Wipro, Capgemini, and Cognizant."
    },
    {
      question: "How do I calculate relative speed for train problems?",
      answer: "In train problems, if two objects move in the opposite direction, their relative speed is the sum of their individual speeds (S1 + S2). If they move in the same direction, their relative speed is the absolute difference between their speeds (|S1 - S2|). Our train calculator handles these conversions and calculations automatically."
    },
    {
      question: "Is there a limit to the history logs stored?",
      answer: "No, we use HTML5 LocalStorage to keep up to 50 of your recent calculations safe on your device. You can access, re-solve, or export them into a unified report at any time, even after refreshing your browser."
    }
  ]
};

export const CATEGORIES_SEO_CONTENT: Record<string, SEOBlock> = {
  "quantitative-aptitude": {
    title: "Quantitative Aptitude Preparation Guide",
    subtitle: "Master Math Shortcuts, Solved Examples, and Core Concepts",
    content: [
      "Quantitative Aptitude is the cornerstone of every competitive exam and campus recruitment drive. It encompasses mathematical fields including Arithmetic (Percentages, Profit & Loss, Simple & Compound Interest, Ratio & Proportion, Averages), Algebra, Geometry, Mensuration, and modern mathematics (Probability, Permutations & Combinations).",
      "To clear the cutoff of competitive exams like CAT, GMAT, GRE, or banking tests, pure accuracy is not enough—speed is critical. Standard textbook methods often involve long calculations that consume valuable minutes. Our Quantitative Aptitude module focuses on teaching you the underlying shortcuts and mental arithmetic tricks.",
      "For example, calculating compound interest compounded semi-annually or quarterly can quickly become tedious. Our platform shows you how to use effective interest rate percentage formulas to convert compound interest problems into simple multiplications. Explore our topic-specific guides to master these formulas, view detailed solved examples, and utilize interactive solvers to check your progress."
    ]
  },
  "logical-reasoning": {
    title: "Logical Reasoning & Placement Preparation",
    subtitle: "Crack Puzzles, Seating Arrangements, Blood Relations, and Syllogisms",
    content: [
      "Logical Reasoning tests non-verbal logic, spatial thinking, and relational analysis. It is highly prominent in IT company screening tests (TCS NQT, Wipro, Infosys) and management tests.",
      "Key topics include blood relations (constructing family trees), seating arrangements (circular and linear tracking), syllogisms (Venn diagram deductions), and direction sense tests. The secret to cracking logical reasoning is systematic grid charting or diagramming.",
      "Our reasoning prep module walks you through structuring family relations, representing circular seating setups, and establishing logical Venn diagrams. Study our solved examples to secure high scores in reasoning sections."
    ]
  },
  "verbal-ability": {
    title: "Verbal Ability & Reading Comprehension (VARC)",
    subtitle: "Enhance Grammar, Vocabulary, Reading Speeds, and Sentence Structure",
    content: [
      "Verbal Ability forms the third vital leg of placement exams. It checks your command over the English language, structural grammar, vocabulary, reading comprehension, and logical ordering of sentences (para-jumbles).",
      "Clearing verbal sections requires strong reading habits and familiarity with standard grammatical syntax (subject-verb agreement, active/passive voice, direct/indirect speech). In competitive exams like CAT and GRE, reading comprehension passages test your ability to extract themes, tone, and logical arguments from dense academic texts.",
      "Our verbal ability syllabus guide lists the high-yield grammatical rules, core roots for vocabulary expansion, and comprehension techniques. Build speed and accuracy to master the complete verbal aptitude syllabus."
    ]
  },
  "data-interpretation": {
    title: "Data Interpretation & Analysis (DI)",
    subtitle: "Interpret Tables, Bar Graphs, Pie Charts, and Caselets Efficiently",
    content: [
      "Data Interpretation evaluates your capability to read, process, and analyze complex graphical data. It is a critical component of banking exams, MBA entrance tests, and corporate case study rounds.",
      "Questions usually display data in the form of line graphs, bar charts, pie diagrams, or multi-dimensional tables. The math involved is basic arithmetic (averages, percentages, ratios), but the challenge lies in scanning large amounts of information and performing calculations quickly under time pressure.",
      "Our DI strategy module focuses on approximation techniques, shortcut calculation rules, and data extraction methods. Learn how to quickly estimate percentages and narrow down options without running full calculations."
    ]
  },
  "company-wise": {
    title: "Company-Wise Recruitment & Placement Prep",
    subtitle: "Crack TCS NQT, Infosys, Wipro NLTH, Accenture, and Capgemini Exams",
    content: [
      "Campus placements at major IT services and tech consulting firms follow structured exam patterns. Understanding these specific test architectures gives you a massive competitive advantage.",
      "TCS National Qualifier Test (NQT) emphasizes advanced quantitative and reasoning ability, featuring rigorous numerical sections and fill-in-the-blank questions. Wipro NLTH focuses on quantitative, logical, and coding abilities. Infosys tests are known for challenging logical reasoning puzzles and mathematical logic. Accenture requires a strong blend of quantitative math, cognitive reasoning, and pseudo-coding skills.",
      "Our company-wise recruitment guide lists the exact exam syllabus, number of questions, time limits, and historical cutoffs. Master the specific patterns to clear your target company's screening test with confidence."
    ]
  }
};

export const COMPANY_PREP_DATA = {
  tcs: {
    name: "TCS Aptitude & NQT Preparation",
    title: "TCS National Qualifier Test (NQT) - Complete Aptitude Syllabus & Patterns",
    desc: "Comprehensive preparation guide for TCS NQT quantitative and logical reasoning sections. Learn shortcuts, practice questions, and view solved templates.",
    wordCount: 1600,
    sections: [
      {
        title: "TCS NQT Exam Structure & Cutoffs",
        paragraphs: [
          "The TCS National Qualifier Test (NQT) is one of the largest campus recruitment tests in India, serving as the entry point for Ninja, Digital, and Prime development roles. The quantitative aptitude section is notoriously challenging, featuring no negative marking but adaptive difficulty—meaning the questions get harder as you answer correctly.",
          "Typically, the test consists of 20-25 questions to be solved in 30-40 minutes. Major topics include Number Systems, Percentages, Profit and Loss, Time-Speed-Distance, and Probability. In logical reasoning, expect questions on Clocks, Calendars, Data Sufficiency, and Seating Arrangements.",
          "To clear the TCS NQT cutoff (usually around 70-75% score), candidates must focus on accuracy and speed. Utilizing shortcuts, approximation methods, and understanding the core formulas are essential strategy pillars."
        ]
      },
      {
        title: "Key TCS Quantitative Aptitude Topics & Solved Examples",
        paragraphs: [
          "1. Number System & Divisibility: TCS frequently asks questions about unit digits, remainders, and LCM/HCF relations. For instance, finding the remainder of 2^31 divided by 5.",
          "Solved Example: Find the remainder when 3^21 is divided by 5.\n- Step 1: Write 3^21 as 3 * (3^2)^10 = 3 * 9^10.\n- Step 2: 9 can be written as (10 - 1). So, 9^10 is congruent to (-1)^10 = 1 modulo 5.\n- Step 3: Therefore, 3 * 9^10 is congruent to 3 * 1 = 3 modulo 5.\n- Answer: The remainder is 3.",
          "2. Probability and Permutations: Focus on card distribution, coin tosses, and team combinations. Our calculators help you verify the exact formula steps for these permutations."
        ]
      }
    ]
  },
  infosys: {
    name: "Infosys Aptitude & Reasoning Prep",
    title: "Infosys Recruitment Test - Quantitative Aptitude and Cryptarithmetic Guide",
    desc: "Master Infosys recruitment exams. Learn about mathematical puzzles, cryptarithmetic, logical deductions, and circular seating arrangements.",
    sections: [
      {
        title: "Infosys Exam Pattern Overview",
        paragraphs: [
          "Infosys recruitment exams are known for assessing deep logical reasoning and puzzle-solving skills. Unlike other IT recruitment tests, Infosys includes a dedicated section on Cryptarithmetic (alphametic puzzles where letters represent digits) and mathematical logic.",
          "The test pattern generally features 10-15 reasoning questions and 5 cryptarithmetic problems. The time limit is extremely tight, often requiring you to solve complex puzzles in less than 2 minutes each."
        ]
      },
      {
        title: "Cryptarithmetic Strategy",
        paragraphs: [
          "Cryptarithmetic puzzles require you to replace letters with unique digits (0-9) to satisfy an arithmetic sum. For example: SEND + MORE = MONEY.",
          "Tips to solve: (1) In SEND + MORE = MONEY, the letter M must be 1 because the sum of two 4-digit numbers can at most carry over a 1. (2) Look for boundaries and carryovers. (3) Systematically test digits based on odd/even properties and constraints."
        ]
      }
    ]
  },
  wipro: {
    name: "Wipro NLTH Aptitude Prep",
    title: "Wipro National Level Talent Hunt (NLTH) - Aptitude Syllabus & Strategy",
    desc: "Prepare for the Wipro Elite National Level Talent Hunt. Focus on quantitative aptitude, logical reasoning, and verbal comprehension.",
    sections: [
      {
        title: "Wipro Elite NLTH Test Details",
        paragraphs: [
          "Wipro's National Level Talent Hunt (NLTH) evaluates quantitative, analytical, and communication skills. The aptitude test comprises three sections: Quantitative Aptitude (16 questions), Logical Reasoning (14 questions), and Verbal Ability (18 questions).",
          "Arithmetic topics like Profit and Loss, Percentages, and Simple/Compound Interest dominate the quantitative section. Verbal ability includes active-passive conversions, error spotting, and prepositions."
        ]
      }
    ]
  },
  accenture: {
    name: "Accenture Cognitive Prep",
    title: "Accenture Cognitive Assessment - Aptitude and Coding Logic Prep",
    desc: "Achieve success in Accenture's cognitive evaluation. Study quantitative math, logic grids, and pseudo-code questions.",
    sections: [
      {
        title: "Accenture Exam Architecture",
        paragraphs: [
          "Accenture's hiring process features a comprehensive Cognitive and Technical assessment. The Cognitive portion tests critical thinking, abstract reasoning, and quantitative problem-solving. The Technical portion includes pseudo-code analysis and cloud/networking questions.",
          "Key topics for the cognitive assessment include series progression, logical matrices, network flows, and advanced percentage math."
        ]
      }
    ]
  }
};
