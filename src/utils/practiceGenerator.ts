export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: string; // "A" | "B" | "C" | "D"
  solution: string[];
  explanation: string;
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generatePracticeQuestions = (
  topicId: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-Level',
  count: number
): PracticeQuestion[] => {
  const questions: PracticeQuestion[] = [];

  for (let qIdx = 0; qIdx < count; qIdx++) {
    let questionText = "";
    let solutionSteps: string[] = [];
    let explanationText = "";
    let options: string[] = [];

    // Scale numbers based on difficulty
    const scale = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 1.5 : difficulty === 'Hard' ? 2.5 : 3.5;

    if (topicId === "simple-interest") {
      const p = Math.round((getRandomInt(1000, 10000) * scale) / 100) * 100;
      const r = getRandomInt(4, 15);
      const t = getRandomInt(1, 6);
      const si = (p * r * t) / 100;

      questionText = `Find the simple interest on a principal amount of ₹${p} at an annual interest rate of ${r}% for a time period of ${t} years.`;
      solutionSteps = [
        `Identify parameters: Principal (P) = ₹${p}, Rate (R) = ${r}%, Time (T) = ${t} years.`,
        `Apply simple interest formula: SI = (P × R × T) / 100`,
        `Substitute: SI = (${p} × ${r} × ${t}) / 100`,
        `Calculate: SI = ${p * r * t} / 100 = ₹${si}`
      ];
      explanationText = "Simple interest is calculated solely on the principal amount, remaining constant each year.";

      // Generate options
      const correctOptionVal = `₹${si}`;
      const wrong1 = `₹${si + 100}`;
      const wrong2 = `₹${Math.max(100, si - 100)}`;
      const wrong3 = `₹${si * 1.1}`;
      options = [correctOptionVal, wrong1, wrong2, wrong3];

    } else if (topicId === "compound-interest") {
      const p = Math.round((getRandomInt(2000, 15000) * scale) / 100) * 100;
      const r = 10; // Fixed at 10% to make it neat
      const t = getRandomInt(2, 3);
      const amount = p * Math.pow(1.10, t);
      const ci = Math.round(amount - p);

      questionText = `Determine the compound interest on a sum of ₹${p} for ${t} years at 10% per annum compounded annually.`;
      solutionSteps = [
        `Variables: Principal (P) = ₹${p}, Rate (R) = 10%, Time (T) = ${t} years.`,
        `Compound Interest Amount formula: A = P × (1 + R/100)^T`,
        `Substitute: A = ${p} × (1.10)^${t}`,
        `A = ₹${Math.round(amount)}`,
        `Compound Interest: CI = A - P = ${Math.round(amount)} - ${p} = ₹${ci}`
      ];
      explanationText = "Compound interest adds the interest earned in previous periods back to the principal for subsequent cycles.";

      const correctOptionVal = `₹${ci}`;
      const wrong1 = `₹${ci + 250}`;
      const wrong2 = `₹${Math.max(50, ci - 250)}`;
      const wrong3 = `₹${Math.round(p * r * t / 100)}`; // simple interest as bait
      options = [correctOptionVal, wrong1, wrong2, wrong3];

    } else if (topicId === "problems-on-trains") {
      const speedKmh = getRandomInt(45, 90);
      const speedMs = speedKmh * 5 / 18;
      const trainLen = getRandomInt(100, 300);
      const bridgeLen = getRandomInt(150, 400);
      const totalDist = trainLen + bridgeLen;

      // Ensure neat integer output by picking speeds that divide nicely or rounding the time
      const timeSec = Math.round((totalDist / speedMs) * 10) / 10;

      questionText = `A train ${trainLen} meters long is running at a speed of ${speedKmh} km/h. How much time will it take to cross a platform of length ${bridgeLen} meters?`;
      solutionSteps = [
        `Determine total distance: Length of Train (${trainLen}m) + Length of Platform (${bridgeLen}m) = ${totalDist}m.`,
        `Convert speed from km/h to m/s: ${speedKmh} km/h × 5/18 = ${speedMs.toFixed(2)} m/s.`,
        `Formula: Time = Distance / Speed`,
        `Calculate: Time = ${totalDist} / ${speedMs.toFixed(2)} = ${timeSec} seconds.`
      ];
      explanationText = "When crossing a platform, the train covers a distance equal to the sum of its own length and the platform length.";

      const correctOptionVal = `${timeSec} seconds`;
      const wrong1 = `${Math.round(timeSec * 1.3)} seconds`;
      const wrong2 = `${Math.round(timeSec * 0.7)} seconds`;
      const wrong3 = `${Math.round(trainLen / speedMs)} seconds`; // only train length
      options = [correctOptionVal, wrong1, wrong2, wrong3];

    } else if (topicId === "time-and-work") {
      const aDays = getRandomInt(6, 15);
      // Ensure combined is neat or float
      const bDays = aDays * 2;
      const combined = Math.round((aDays * bDays / (aDays + bDays)) * 10) / 10;

      questionText = `A can complete a piece of work in ${aDays} days, and B can complete the same work in ${bDays} days. In how many days can they complete the work if they work together?`;
      solutionSteps = [
        `Rate of A = 1/${aDays} of work per day.`,
        `Rate of B = 1/${bDays} of work per day.`,
        `Combined work rate = 1/${aDays} + 1/${bDays} = (${aDays} + ${bDays}) / (${aDays} × ${bDays})`,
        `Calculate: T = (${aDays} × ${bDays}) / (${aDays} + ${bDays}) = ${combined} days.`
      ];
      explanationText = "Efficiencies or daily work rates are additive when individuals work together.";

      const correctOptionVal = `${combined} days`;
      const wrong1 = `${aDays + bDays} days`;
      const wrong2 = `${Math.round((aDays + bDays) / 2)} days`;
      const wrong3 = `${(combined * 1.5).toFixed(1)} days`;
      options = [correctOptionVal, wrong1, wrong2, wrong3];

    } else if (topicId === "profit-and-loss") {
      const cp = getRandomInt(10, 100) * 10;
      const profitPct = getRandomInt(5, 25);
      const sp = cp * (1 + profitPct / 100);

      questionText = `An article is purchased for ₹${cp} and sold at a profit of ${profitPct}%. What is the selling price of the article?`;
      solutionSteps = [
        `Identify values: CP = ₹${cp}, Profit Percent = ${profitPct}%.`,
        `Formula for Selling Price: SP = CP × (100 + Profit%) / 100`,
        `Substitute: SP = ${cp} × (100 + ${profitPct}) / 100`,
        `Calculate: SP = ${cp} × 1.${profitPct} = ₹${sp}`
      ];
      explanationText = "Profit is always calculated on the cost price (CP) unless specified otherwise.";

      const correctOptionVal = `₹${sp}`;
      const wrong1 = `₹${cp + profitPct}`; // basic mistake
      const wrong2 = `₹${sp - 40}`;
      const wrong3 = `₹${sp + 40}`;
      options = [correctOptionVal, wrong1, wrong2, wrong3];

    } else {
      // General fallbacks for other topics
      const num1 = getRandomInt(20, 80);
      const num2 = getRandomInt(10, 30);
      const ans = num1 + num2;

      questionText = `If standard quantities A and B represent values ${num1} and ${num2} respectively, determine their cumulative linear sum under standard aptitude parameters.`;
      solutionSteps = [
        `Identify inputs: A = ${num1}, B = ${num2}.`,
        `Calculate Sum: A + B = ${num1} + ${num2} = ${ans}.`
      ];
      explanationText = "Basic quantitative validation of linear parameters.";

      const correctOptionVal = `${ans}`;
      const wrong1 = `${ans + getRandomInt(5, 10)}`;
      const wrong2 = `${ans - getRandomInt(5, 10)}`;
      const wrong3 = `${num1 * num2}`;
      options = [correctOptionVal, wrong1, wrong2, wrong3];
    }

    // De-duplicate options and shuffle
    const uniqueOptions = Array.from(new Set(options));
    while (uniqueOptions.length < 4) {
      const backupVal = `${getRandomInt(50, 1000)}`;
      if (!uniqueOptions.includes(backupVal)) {
        uniqueOptions.push(backupVal);
      }
    }

    const shuffled = shuffleArray(uniqueOptions);
    const correctLetter = ["A", "B", "C", "D"][shuffled.indexOf(options[0])];

    questions.push({
      id: `${topicId}-${qIdx}-${getRandomInt(1000, 9999)}`,
      question: questionText,
      options: shuffled,
      correctOption: correctLetter,
      solution: solutionSteps,
      explanation: explanationText
    });
  }

  return questions;
};
