export interface Formula {
  name: string;
  formula: string;
  description: string;
}

export interface InputField {
  id: string;
  name: string;
  placeholder: string;
  type: 'number' | 'text' | 'select';
  defaultValue: string;
  options?: string[]; // for select inputs
  unit?: string;
}

export interface SolvedExample {
  question: string;
  inputs: Record<string, number | string>;
  steps: string[];
  answer: string;
}

export interface Topic {
  id: string;
  name: string;
  category: 'quantitative' | 'word-problems' | 'math-logic' | 'finance' | 'reasoning';
  description: string;
  formulas: Formula[];
  inputs: InputField[];
  examples: SolvedExample[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const topicsData: Topic[] = [
  {
    id: "simple-interest",
    name: "Simple Interest",
    category: "finance",
    description: "Calculate interest on principal amount where the interest accumulated is always based on the initial principal.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Simple Interest (SI)",
        formula: "SI = (P × R × T) / 100",
        description: "Where P = Principal Amount, R = Rate of Interest per Annum, T = Time in Years."
      },
      {
        name: "Total Amount (A)",
        formula: "A = P + SI = P × (1 + R × T / 100)",
        description: "The total value of principal plus simple interest accrued."
      }
    ],
    inputs: [
      { id: "principal", name: "Principal Amount (P)", placeholder: "e.g. 5000", type: "number", defaultValue: "5000", unit: "₹" },
      { id: "rate", name: "Interest Rate (R)", placeholder: "e.g. 8.5", type: "number", defaultValue: "8.5", unit: "% per year" },
      { id: "time", name: "Time Period (T)", placeholder: "e.g. 3", type: "number", defaultValue: "3", unit: "years" }
    ],
    examples: [
      {
        question: "Find the simple interest on ₹8000 at 6% per annum for 2.5 years.",
        inputs: { principal: 8000, rate: 6, time: 2.5 },
        steps: [
          "Identify variables: P = ₹8000, R = 6%, T = 2.5 years.",
          "Apply the formula: SI = (P × R × T) / 100",
          "SI = (8000 × 6 × 2.5) / 100",
          "SI = 120000 / 100 = ₹1200",
          "Total Amount = P + SI = 8000 + 1200 = ₹9200."
        ],
        answer: "SI = ₹1200, Total Amount = ₹9200"
      }
    ]
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    category: "finance",
    description: "Calculate interest where the interest earned each period is added to the principal, so that interest also earns interest.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Total Amount (A)",
        formula: "A = P × (1 + R / (100 × n))^(n × T)",
        description: "Where n is the number of times interest is compounded per year (1 for annually, 2 for semi-annually, 4 for quarterly)."
      },
      {
        name: "Compound Interest (CI)",
        formula: "CI = A - P",
        description: "The total interest gained over the period."
      }
    ],
    inputs: [
      { id: "principal", name: "Principal Amount (P)", placeholder: "e.g. 10000", type: "number", defaultValue: "10000", unit: "₹" },
      { id: "rate", name: "Interest Rate (R)", placeholder: "e.g. 10", type: "number", defaultValue: "10", unit: "%" },
      { id: "time", name: "Time Period (T)", placeholder: "e.g. 2", type: "number", defaultValue: "2", unit: "years" },
      { id: "compounding", name: "Compounding Frequency (n)", placeholder: "", type: "select", defaultValue: "1", options: ["1", "2", "4", "12"] }
    ],
    examples: [
      {
        question: "Calculate the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually.",
        inputs: { principal: 10000, rate: 10, time: 2, compounding: "1" },
        steps: [
          "Identify variables: P = 10000, R = 10%, T = 2 years, n = 1.",
          "Apply amount formula: A = P × (1 + R/100)^T",
          "A = 10000 × (1 + 0.10)^2 = 10000 × (1.10)^2",
          "A = 10000 × 1.21 = ₹12100",
          "Calculate interest: CI = A - P = 12100 - 10000 = ₹2100."
        ],
        answer: "CI = ₹2100, Total Amount = ₹12100"
      }
    ]
  },
  {
    id: "problems-on-trains",
    name: "Problems on Trains",
    category: "word-problems",
    description: "Calculate speed, length, crossing times of trains passing bridges, platforms, poles, or other moving trains.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Basic Relation",
        formula: "Speed = Distance / Time",
        description: "General equation governing train motions."
      },
      {
        name: "Relative Speed (Same Direction)",
        formula: "Relative Speed = |S1 - S2|",
        description: "When two trains run in the same direction, subtract speeds."
      },
      {
        name: "Relative Speed (Opposite Direction)",
        formula: "Relative Speed = S1 + S2",
        description: "When two trains run in opposite directions, add speeds."
      },
      {
        name: "Conversion factor (km/h to m/s)",
        formula: "S (m/s) = S (km/h) × 5/18",
        description: "Multiply km/h speed by 5/18 to get speed in meters per second."
      }
    ],
    inputs: [
      { id: "lengthTrain", name: "Train Length", placeholder: "e.g. 200", type: "number", defaultValue: "200", unit: "meters" },
      { id: "speedTrain", name: "Train Speed", placeholder: "e.g. 72", type: "number", defaultValue: "72", unit: "km/h" },
      { id: "lengthObject", name: "Object Length (Bridge/Platform/Train)", placeholder: "e.g. 150", type: "number", defaultValue: "150", unit: "meters" },
      { id: "speedObject", name: "Object Speed (0 if stationary)", placeholder: "e.g. 0", type: "number", defaultValue: "0", unit: "km/h" },
      { id: "direction", name: "Relative Direction", placeholder: "", type: "select", defaultValue: "opposite", options: ["stationary", "same", "opposite"] }
    ],
    examples: [
      {
        question: "A train 120m long is running at 54 km/h. How long will it take to pass a stationary bridge of length 180m?",
        inputs: { lengthTrain: 120, speedTrain: 54, lengthObject: 180, speedObject: 0, direction: "stationary" },
        steps: [
          "Convert train speed to m/s: 54 km/h × 5/18 = 15 m/s.",
          "Total distance to cross = Length of Train + Length of Bridge = 120m + 180m = 300m.",
          "Time taken = Distance / Speed = 300m / 15 m/s = 20 seconds."
        ],
        answer: "Time = 20 seconds"
      }
    ]
  },
  {
    id: "time-and-distance",
    name: "Time and Distance",
    category: "word-problems",
    description: "Calculate values relating to speed, distance covered, average speed, and conversion rates.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Distance",
        formula: "D = S × T",
        description: "Distance = Speed × Time"
      },
      {
        name: "Average Speed (Equal Distances)",
        formula: "Avg Speed = (2 × S1 × S2) / (S1 + S2)",
        description: "Average speed when covering same distance with two different speeds."
      }
    ],
    inputs: [
      { id: "distance", name: "Distance", placeholder: "e.g. 300", type: "number", defaultValue: "300", unit: "km" },
      { id: "speed", name: "Speed", placeholder: "e.g. 60", type: "number", defaultValue: "60", unit: "km/h" },
      { id: "time", name: "Time", placeholder: "e.g. 5", type: "number", defaultValue: "5", unit: "hours" }
    ],
    examples: [
      {
        question: "A car covers 150 km in 3 hours. Find its speed in km/h and m/s.",
        inputs: { distance: 150, time: 3, speed: 0 },
        steps: [
          "Formula: Speed = Distance / Time = 150 / 3 = 50 km/h.",
          "Convert to m/s: 50 × 5/18 = 13.89 m/s."
        ],
        answer: "Speed = 50 km/h (13.89 m/s)"
      }
    ]
  },
  {
    id: "time-and-work",
    name: "Time and Work",
    category: "word-problems",
    description: "Determine individual efficiencies, combined rates, and days required to complete a task.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Combined Work Rate",
        formula: "1 / T = 1 / A + 1 / B",
        description: "Work rate of A and B working together."
      },
      {
        name: "Man-Days Equation",
        formula: "M1 × D1 × H1 / W1 = M2 × D2 × H2 / W2",
        description: "Used to solve chain-rule work problems where M = Men, D = Days, H = Hours, W = Work."
      }
    ],
    inputs: [
      { id: "daysA", name: "Days A needs alone", placeholder: "e.g. 10", type: "number", defaultValue: "10", unit: "days" },
      { id: "daysB", name: "Days B needs alone", placeholder: "e.g. 15", type: "number", defaultValue: "15", unit: "days" }
    ],
    examples: [
      {
        question: "A can do a piece of work in 10 days, and B can do it in 15 days. How long will they take working together?",
        inputs: { daysA: 10, daysB: 15 },
        steps: [
          "Rate of A = 1/10 work per day.",
          "Rate of B = 1/15 work per day.",
          "Combined Rate = 1/10 + 1/15 = (3 + 2) / 30 = 5/30 = 1/6.",
          "Time taken = 1 / (Combined Rate) = 6 days."
        ],
        answer: "Combined Time = 6 days"
      }
    ]
  },
  {
    id: "profit-and-loss",
    name: "Profit and Loss",
    category: "finance",
    description: "Determine Cost Price (CP), Selling Price (SP), Profit or Loss percentage, and discounts.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Profit Percentage",
        formula: "Profit % = ((SP - CP) / CP) × 100",
        description: "Applied when Selling Price (SP) is greater than Cost Price (CP)."
      },
      {
        name: "Loss Percentage",
        formula: "Loss % = ((CP - SP) / CP) × 100",
        description: "Applied when Cost Price (CP) is greater than Selling Price (SP)."
      },
      {
        name: "Selling Price given CP & Profit%",
        formula: "SP = CP × (100 + Profit%) / 100",
        description: "Find SP directly from CP and profit markup."
      }
    ],
    inputs: [
      { id: "costPrice", name: "Cost Price (CP)", placeholder: "e.g. 1200", type: "number", defaultValue: "1200", unit: "₹" },
      { id: "sellingPrice", name: "Selling Price (SP)", placeholder: "e.g. 1500", type: "number", defaultValue: "1500", unit: "₹" }
    ],
    examples: [
      {
        question: "A dealer buys a radio for ₹1200 and sells it for ₹1500. Calculate profit or loss percent.",
        inputs: { costPrice: 1200, sellingPrice: 1500 },
        steps: [
          "Identify SP = ₹1500 and CP = ₹1200.",
          "Since SP > CP, it is a Profit.",
          "Profit = SP - CP = 1500 - 1200 = ₹300.",
          "Profit % = (Profit / CP) × 100 = (300 / 1200) × 100 = 25%."
        ],
        answer: "Profit = ₹300, Profit Percent = 25%"
      }
    ]
  },
  {
    id: "percentage",
    name: "Percentage",
    category: "quantitative",
    description: "Basic percentage conversions, percentage increase/decrease, and calculations.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Percentage Value",
        formula: "Value = (P / 100) × Total",
        description: "Value corresponding to P percent of Total."
      },
      {
        name: "Percentage Increase",
        formula: "Inc % = ((New - Old) / Old) × 100",
        description: "Relative percentage change upwards."
      }
    ],
    inputs: [
      { id: "total", name: "Total Amount / Base Value", placeholder: "e.g. 800", type: "number", defaultValue: "800" },
      { id: "percentage", name: "Percentage Value", placeholder: "e.g. 25", type: "number", defaultValue: "25", unit: "%" }
    ],
    examples: [
      {
        question: "What is 25% of 800?",
        inputs: { total: 800, percentage: 25 },
        steps: [
          "Apply formula: Value = (Percentage / 100) × Total",
          "Value = (25 / 100) × 800",
          "Value = 0.25 × 800 = 200."
        ],
        answer: "200"
      }
    ]
  },
  {
    id: "problems-on-ages",
    name: "Problems on Ages",
    category: "word-problems",
    description: "Compute current, past, and future ages of multiple people based on ratio and linear equations.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Ratio Equation",
        formula: "(A - x) / (B - x) = R1 or (A + y) / (B + y) = R2",
        description: "Used to set up linear age equations."
      }
    ],
    inputs: [
      { id: "ratioCurrentA", name: "Current Ratio: Person A", placeholder: "e.g. 4", type: "number", defaultValue: "4" },
      { id: "ratioCurrentB", name: "Current Ratio: Person B", placeholder: "e.g. 5", type: "number", defaultValue: "5" },
      { id: "yearsDifference", name: "Years in future/past", placeholder: "e.g. 5", type: "number", defaultValue: "5" },
      { id: "ratioFutureA", name: "Future Ratio: Person A", placeholder: "e.g. 5", type: "number", defaultValue: "5" },
      { id: "ratioFutureB", name: "Future Ratio: Person B", placeholder: "e.g. 6", type: "number", defaultValue: "6" }
    ],
    examples: [
      {
        question: "Present ages of A and B are in the ratio 4:5. After 5 years, the ratio becomes 5:6. Find their present ages.",
        inputs: { ratioCurrentA: 4, ratioCurrentB: 5, yearsDifference: 5, ratioFutureA: 5, ratioFutureB: 6 },
        steps: [
          "Let present ages be 4x and 5x.",
          "After 5 years: (4x + 5) / (5x + 5) = 5 / 6",
          "Cross multiply: 6(4x + 5) = 5(5x + 5)",
          "24x + 30 = 25x + 25",
          "x = 5.",
          "Present Age of A = 4 × 5 = 20. Present Age of B = 5 × 5 = 25."
        ],
        answer: "Age A = 20 years, Age B = 25 years"
      }
    ]
  },
  {
    id: "calendar",
    name: "Calendar",
    category: "reasoning",
    description: "Determine the day of the week for any given date and calculate odd days.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Odd Days Rule",
        formula: "Days mod 7",
        description: "Odd days are remainder days after dividing by 7. 0 = Sunday, 1 = Monday, ..., 6 = Saturday."
      },
      {
        name: "Leap Year Rule",
        formula: "Year divisible by 4 (and not 100 unless divisible by 400)",
        description: "Leap years have 366 days (2 odd days); normal years have 365 days (1 odd day)."
      }
    ],
    inputs: [
      { id: "day", name: "Day (DD)", placeholder: "e.g. 15", type: "number", defaultValue: "15" },
      { id: "month", name: "Month (MM)", placeholder: "e.g. 8", type: "number", defaultValue: "8" },
      { id: "year", name: "Year (YYYY)", placeholder: "e.g. 1947", type: "number", defaultValue: "1947" }
    ],
    examples: [
      {
        question: "What day of the week was August 15, 1947?",
        inputs: { day: 15, month: 8, year: 1947 },
        steps: [
          "Using standard calendar anchor algorithms (Zeller's Congruence or Odd Days method):",
          "For Year 1947: completed years = 1946. Leap years in 1946 = 1946/4 = 486 leap years.",
          "Odd days calculations yield that August 15, 1947 falls on a Friday."
        ],
        answer: "Friday"
      }
    ]
  },
  {
    id: "clock",
    name: "Clock",
    category: "reasoning",
    description: "Compute the angle between hour and minute hands, or calculate time gains/losses.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Angle Formula",
        formula: "θ = |(30 × H) - (11/2 × M)|",
        description: "Angle θ between clock hands at H hours and M minutes. If angle > 180, reflex angle is 360 - θ."
      }
    ],
    inputs: [
      { id: "hour", name: "Hour (1-12)", placeholder: "e.g. 3", type: "number", defaultValue: "3" },
      { id: "minute", name: "Minute (0-59)", placeholder: "e.g. 40", type: "number", defaultValue: "40" }
    ],
    examples: [
      {
        question: "Find the angle between the hands of a clock at 3:40.",
        inputs: { hour: 3, minute: 40 },
        steps: [
          "Apply formula: θ = |30 × H - (11/2) × M|",
          "θ = |30 × 3 - (11/2) × 40|",
          "θ = |90 - 220| = |-130| = 130°."
        ],
        answer: "130°"
      }
    ]
  },
  {
    id: "average",
    name: "Average",
    category: "quantitative",
    description: "Calculate arithmetic mean, weighted average, and values of elements within groups.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Average Definition",
        formula: "Average = Sum of values / Count of values",
        description: "Standard mean calculation."
      }
    ],
    inputs: [
      { id: "numbersList", name: "Comma-separated numbers", placeholder: "e.g. 10, 20, 30, 40, 50", type: "text", defaultValue: "10,20,30,40,50" }
    ],
    examples: [
      {
        question: "Find the average of 10, 15, 20, 25, 30.",
        inputs: { numbersList: "10,15,20,25,30" },
        steps: [
          "Sum of numbers = 10 + 15 + 20 + 25 + 30 = 100.",
          "Total count = 5.",
          "Average = 100 / 5 = 20."
        ],
        answer: "Average = 20"
      }
    ]
  },
  {
    id: "partnership",
    name: "Partnership",
    category: "finance",
    description: "Determine profit-sharing distribution based on investment amounts and time periods.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Profit Sharing Ratio",
        formula: "Profit A : Profit B = (Investment A × Time A) : (Investment B × Time B)",
        description: "Profit is directly proportional to product of capital investment and time duration."
      }
    ],
    inputs: [
      { id: "investA", name: "Investment A", placeholder: "e.g. 12000", type: "number", defaultValue: "12000", unit: "₹" },
      { id: "timeA", name: "Investment Duration A", placeholder: "e.g. 12", type: "number", defaultValue: "12", unit: "months" },
      { id: "investB", name: "Investment B", placeholder: "e.g. 16000", type: "number", defaultValue: "16000", unit: "₹" },
      { id: "timeB", name: "Investment Duration B", placeholder: "e.g. 9", type: "number", defaultValue: "9", unit: "months" },
      { id: "totalProfit", name: "Total Annual Profit", placeholder: "e.g. 5600", type: "number", defaultValue: "5600", unit: "₹" }
    ],
    examples: [
      {
        question: "A invests ₹12,000 for 12 months, and B invests ₹16,000 for 9 months. If total profit is ₹5600, calculate each share.",
        inputs: { investA: 12000, timeA: 12, investB: 16000, timeB: 9, totalProfit: 5600 },
        steps: [
          "Equivalent monthly capitals:",
          "A's shares = 12000 × 12 = 144,000",
          "B's shares = 16000 × 9 = 144,000",
          "Ratio of profit = 144000 : 144000 = 1 : 1",
          "Therefore, both get equal share: ₹5600 / 2 = ₹2800 each."
        ],
        answer: "A's Share = ₹2800, B's Share = ₹2800"
      }
    ]
  },
  {
    id: "boats-and-streams",
    name: "Boats and Streams",
    category: "word-problems",
    description: "Solve problems regarding upstream speed, downstream speed, speed of boat in still water, and speed of the stream.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Downstream Speed (d)",
        formula: "d = u + v",
        description: "Speed of boat downstream (with stream). u = boat speed in still water, v = stream speed."
      },
      {
        name: "Upstream Speed (up)",
        formula: "up = u - v",
        description: "Speed of boat upstream (against stream). u = boat speed in still water, v = stream speed."
      },
      {
        name: "Boat Speed in Still Water (u)",
        formula: "u = (d + up) / 2",
        description: "Half the sum of downstream and upstream speeds."
      },
      {
        name: "Stream Speed (v)",
        formula: "v = (d - up) / 2",
        description: "Half the difference of downstream and upstream speeds."
      }
    ],
    inputs: [
      { id: "boatSpeed", name: "Boat Speed in Still Water (u)", placeholder: "e.g. 15", type: "number", defaultValue: "15", unit: "km/h" },
      { id: "streamSpeed", name: "Stream/Current Speed (v)", placeholder: "e.g. 3", type: "number", defaultValue: "3", unit: "km/h" }
    ],
    examples: [
      {
        question: "A boat moves at 15 km/h in still water. If the speed of the stream is 3 km/h, find the boat's speed downstream and upstream.",
        inputs: { boatSpeed: 15, streamSpeed: 3 },
        steps: [
          "Identify u = 15 km/h, v = 3 km/h.",
          "Downstream speed = u + v = 15 + 3 = 18 km/h.",
          "Upstream speed = u - v = 15 - 3 = 12 km/h."
        ],
        answer: "Downstream = 18 km/h, Upstream = 12 km/h"
      }
    ]
  },
  {
    id: "ratio-and-proportion",
    name: "Ratio and Proportion",
    category: "quantitative",
    description: "Solve ratios, fourth proportions, mean proportions, and distribute values between ratios.",
    difficulty: "Easy",
    formulas: [
      {
        name: "Fourth Proportional",
        formula: "d = (b × c) / a",
        description: "In ratio a:b :: c:d, 'd' is the fourth proportional."
      },
      {
        name: "Mean Proportional",
        formula: "Mean = √(a × b)",
        description: "Mean proportional between a and b is square root of their product."
      }
    ],
    inputs: [
      { id: "valA", name: "Value A", placeholder: "e.g. 4", type: "number", defaultValue: "4" },
      { id: "valB", name: "Value B", placeholder: "e.g. 8", type: "number", defaultValue: "8" },
      { id: "valC", name: "Value C", placeholder: "e.g. 12", type: "number", defaultValue: "12" }
    ],
    examples: [
      {
        question: "Find the mean proportional between 4 and 16.",
        inputs: { valA: 4, valB: 16, valC: 0 },
        steps: [
          "Apply formula: Mean = √(a × b)",
          "Mean = √(4 × 16) = √64 = 8."
        ],
        answer: "Mean Proportional = 8"
      }
    ]
  },
  {
    id: "probability",
    name: "Probability",
    category: "math-logic",
    description: "Calculate odds, sample space, event counts, card selections, dice throws, and coin flips.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Probability P(E)",
        formula: "P(E) = n(E) / n(S)",
        description: "Number of favorable outcomes n(E) divided by total size of sample space n(S)."
      }
    ],
    inputs: [
      { id: "favorable", name: "Favorable Outcomes n(E)", placeholder: "e.g. 3", type: "number", defaultValue: "3" },
      { id: "totalSpace", name: "Total Sample Space n(S)", placeholder: "e.g. 6", type: "number", defaultValue: "6" }
    ],
    examples: [
      {
        question: "A single die is rolled. Find the probability of getting an even number.",
        inputs: { favorable: 3, totalSpace: 6 },
        steps: [
          "Sample space S = {1, 2, 3, 4, 5, 6}, so n(S) = 6.",
          "Even numbers E = {2, 4, 6}, so n(E) = 3.",
          "Probability P(E) = n(E) / n(S) = 3/6 = 0.5 (or 50%)."
        ],
        answer: "P(E) = 0.5 (1/2)"
      }
    ]
  },
  {
    id: "permutations-and-combinations",
    name: "Permutation and Combination",
    category: "math-logic",
    description: "Determine arrangements (nPr) and selections (nCr) of elements.",
    difficulty: "Medium",
    formulas: [
      {
        name: "Permutations (nPr)",
        formula: "nPr = n! / (n - r)!",
        description: "Number of ways to arrange r items out of n distinct objects."
      },
      {
        name: "Combinations (nCr)",
        formula: "nCr = n! / (r! × (n - r)!)",
        description: "Number of ways to select r items out of n distinct objects."
      }
    ],
    inputs: [
      { id: "n", name: "Total Objects (n)", placeholder: "e.g. 7", type: "number", defaultValue: "7" },
      { id: "r", name: "Chosen Objects (r)", placeholder: "e.g. 3", type: "number", defaultValue: "3" }
    ],
    examples: [
      {
        question: "In how many ways can we choose 3 candidates from a pool of 7?",
        inputs: { n: 7, r: 3 },
        steps: [
          "Since order does not matter, use Combination: 7C3",
          "7C3 = 7! / (3! × 4!) = (7 × 6 × 5) / (3 × 2 × 1) = 35."
        ],
        answer: "35 ways"
      }
    ]
  },
  {
    id: "area",
    name: "Area",
    category: "quantitative",
    description: "Calculate areas and perimeters of geometric shapes like squares, rectangles, triangles, and circles.",
    difficulty: "Easy",
    formulas: [
      { name: "Rectangle Area", formula: "Area = l × w", description: "Length × Width" },
      { name: "Circle Area", formula: "Area = π × r²", description: "π × Radius squared (π ≈ 3.14159)" },
      { name: "Triangle Area", formula: "Area = 0.5 × b × h", description: "0.5 × Base × Height" }
    ],
    inputs: [
      { id: "valA", name: "Length / Base / Radius", placeholder: "e.g. 10", type: "number", defaultValue: "10" },
      { id: "valB", name: "Width / Height (0 for circle)", placeholder: "e.g. 5", type: "number", defaultValue: "5" }
    ],
    examples: [
      {
        question: "Find the area of a rectangle with length 10m and width 5m.",
        inputs: { valA: 10, valB: 5 },
        steps: [
          "Identify parameters: Length = 10, Width = 5.",
          "Apply formula: Area = Length × Width",
          "Calculate: Area = 10 × 5 = 50 sq. meters."
        ],
        answer: "Area = 50 sq. units"
      }
    ]
  },
  {
    id: "volume-and-surface-area",
    name: "Volume and Surface Area",
    category: "quantitative",
    description: "Determine volumes and surface areas of cylinders, spheres, cones, and cuboids.",
    difficulty: "Medium",
    formulas: [
      { name: "Sphere Volume", formula: "V = (4/3) × π × r³", description: "Volume of a sphere given radius." },
      { name: "Cylinder Volume", formula: "V = π × r² × h", description: "Volume of a cylinder given radius and height." },
      { name: "Cuboid Volume", formula: "V = l × w × h", description: "Volume of a rectangular cuboid." }
    ],
    inputs: [
      { id: "valA", name: "Length / Radius (r)", placeholder: "e.g. 7", type: "number", defaultValue: "7" },
      { id: "valB", name: "Width (w)", placeholder: "e.g. 4", type: "number", defaultValue: "4" },
      { id: "valC", name: "Height (h)", placeholder: "e.g. 10", type: "number", defaultValue: "10" }
    ],
    examples: [
      {
        question: "Find the volume of a cylinder with radius 7cm and height 10cm.",
        inputs: { valA: 7, valB: 0, valC: 10 },
        steps: [
          "Parameters: Radius = 7, Height = 10.",
          "Formula: V = π × r² × h",
          "V = 22/7 × 7² × 10 = 22 × 7 × 10 = 1540 cubic cm."
        ],
        answer: "Volume = 1540 cubic units"
      }
    ]
  },
  {
    id: "logarithms",
    name: "Logarithms",
    category: "math-logic",
    description: "Properties of logs, base changing calculations, and product rules.",
    difficulty: "Medium",
    formulas: [
      { name: "Product Rule", formula: "log_b(xy) = log_b(x) + log_b(y)", description: "Logarithm of a product is sum of logs." },
      { name: "Quotient Rule", formula: "log_b(x / y) = log_b(x) - log_b(y)", description: "Logarithm of a quotient is difference of logs." },
      { name: "Base Change Rule", formula: "log_b(x) = log_a(x) / log_a(b)", description: "Change base of logarithm." }
    ],
    inputs: [
      { id: "valA", name: "Argument Value (x)", placeholder: "e.g. 100", type: "number", defaultValue: "100" },
      { id: "valB", name: "Base (b)", placeholder: "e.g. 10", type: "number", defaultValue: "10" }
    ],
    examples: [
      {
        question: "Evaluate log_10(100).",
        inputs: { valA: 100, valB: 10 },
        steps: [
          "Log base 10 of 100 is power to which 10 must be raised to get 100.",
          "Since 10² = 100, log_10(100) = 2."
        ],
        answer: "log_10(100) = 2"
      }
    ]
  },
  {
    id: "hcf-and-lcm",
    name: "HCF and LCM",
    category: "quantitative",
    description: "Find the Highest Common Factor (HCF) and Least Common Multiple (LCM) of numbers.",
    difficulty: "Easy",
    formulas: [
      { name: "Product of Numbers Relation", formula: "Product = HCF × LCM", description: "For two numbers A and B: A × B = HCF(A,B) × LCM(A,B)." },
      { name: "LCM of Fractions", formula: "LCM = LCM of Numerators / HCF of Denominators", description: "Calculate LCM for fraction set." },
      { name: "HCF of Fractions", formula: "HCF = HCF of Numerators / LCM of Denominators", description: "Calculate HCF for fraction set." }
    ],
    inputs: [
      { id: "valA", name: "Number A", placeholder: "e.g. 12", type: "number", defaultValue: "12" },
      { id: "valB", name: "Number B", placeholder: "e.g. 18", type: "number", defaultValue: "18" }
    ],
    examples: [
      {
        question: "Find the HCF and LCM of 12 and 18.",
        inputs: { valA: 12, valB: 18 },
        steps: [
          "Factors of 12: 1, 2, 3, 4, 6, 12.",
          "Factors of 18: 1, 2, 3, 6, 9, 18.",
          "Highest Common Factor (HCF) = 6.",
          "LCM = (12 × 18) / HCF = 216 / 6 = 36."
        ],
        answer: "HCF = 6, LCM = 36"
      }
    ]
  },
  {
    id: "surds-and-indices",
    name: "Surds and Indices",
    category: "quantitative",
    description: "Simplify expressions containing indices, exponents, roots, and surds.",
    difficulty: "Easy",
    formulas: [
      { name: "Multiplication Rule", formula: "a^m × a^n = a^(m + n)", description: "Add exponents when multiplying bases." },
      { name: "Division Rule", formula: "a^m / a^n = a^(m - n)", description: "Subtract exponents when dividing bases." },
      { name: "Power Rule", formula: "(a^m)^n = a^(m × n)", description: "Multiply exponents for powers of powers." }
    ],
    inputs: [
      { id: "valA", name: "Base (a)", placeholder: "e.g. 2", type: "number", defaultValue: "2" },
      { id: "valB", name: "Exponent m", placeholder: "e.g. 3", type: "number", defaultValue: "3" },
      { id: "valC", name: "Exponent n", placeholder: "e.g. 4", type: "number", defaultValue: "4" }
    ],
    examples: [
      {
        question: "Evaluate 2³ × 2⁴.",
        inputs: { valA: 2, valB: 3, valC: 4 },
        steps: [
          "Same base rule: 2³ × 2⁴ = 2^(3+4) = 2⁷.",
          "Calculate: 2⁷ = 128."
        ],
        answer: "2⁷ = 128"
      }
    ]
  },
  {
    id: "pipes-and-cisterns",
    name: "Pipes and Cisterns",
    category: "word-problems",
    description: "Calculate fill times, empty times, and combined flow rates of cistern inlets and outlets.",
    difficulty: "Medium",
    formulas: [
      { name: "Combined Flow Rate", formula: "1 / T = 1 / A + 1 / B - 1 / C", description: "Flow rate of inlets A and B, and outlet C." }
    ],
    inputs: [
      { id: "daysA", name: "Inlet pipe A fill time", placeholder: "e.g. 6", type: "number", defaultValue: "6", unit: "hours" },
      { id: "daysB", name: "Inlet pipe B fill time", placeholder: "e.g. 8", type: "number", defaultValue: "8", unit: "hours" }
    ],
    examples: [
      {
        question: "Two pipes A and B can fill a cistern in 6 hours and 8 hours respectively. If opened together, how long to fill?",
        inputs: { daysA: 6, daysB: 8 },
        steps: [
          "Rate of A = 1/6, Rate of B = 1/8.",
          "Combined Rate = 1/6 + 1/8 = (4 + 3)/24 = 7/24.",
          "Time taken = 24/7 ≈ 3.43 hours."
        ],
        answer: "Time = 3.43 hours"
      }
    ]
  }
];
