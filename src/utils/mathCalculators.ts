export interface CalculationResult {
  answer: string;
  steps: string[];
  formula: string;
  visualBreakdown?: { label: string; value: string | number }[];
}

// Factorial helper
const fact = (num: number): number => {
  if (num < 0) return 0;
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) result *= i;
  return result;
};

// Zeller's Congruence for Calendar Day
const getWeekdayName = (day: number, month: number, year: number): { dayName: string; steps: string[] } => {
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const steps: string[] = [];

  let q = day;
  let m = month;
  let y = year;

  // In Zeller's: January and February are counted as months 13 and 14 of the previous year
  if (m === 1 || m === 2) {
    m += 12;
    y -= 1;
  }

  steps.push(`Adjusted date for Zeller's Congruence: Day = ${q}, Month = ${m}, Year = ${y} (Since Jan/Feb are treated as 13/14th month of previous year).`);

  const K = y % 100;
  const J = Math.floor(y / 100);

  steps.push(`Calculate components: Year of Century (K) = ${y} % 100 = ${K}, Zero-based Century (J) = floor(${y} / 100) = ${J}.`);

  // Formula: h = (q + floor(13*(m+1)/5) + K + floor(K/4) + floor(J/4) - 2*J) mod 7
  const mTerm = Math.floor((13 * (m + 1)) / 5);
  const kTerm = Math.floor(K / 4);
  const jTerm = Math.floor(J / 4);
  const rawH = q + mTerm + K + kTerm + jTerm - 2 * J;

  steps.push(`Zeller's Formula: h = (q + floor(13*(m+1)/5) + K + floor(K/4) + floor(J/4) - 2*J) mod 7`);
  steps.push(`Substituting terms: h = (${q} + ${mTerm} + ${K} + ${kTerm} + ${jTerm} - 2*${J}) = ${rawH}`);

  let h = rawH % 7;
  if (h < 0) {
    h += 7;
    steps.push(`Adjust negative remainder: h = ${rawH} % 7 = ${h}`);
  } else {
    steps.push(`Modulo 7 of the sum: h = ${rawH} % 7 = ${h}`);
  }

  // Zeller's output: 0 = Saturday, 1 = Sunday, 2 = Monday, ..., 6 = Friday
  // Map to standard output: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const zellerMap: Record<number, number> = {
    0: 6, // Saturday
    1: 0, // Sunday
    2: 1, // Monday
    3: 2, // Tuesday
    4: 3, // Wednesday
    5: 4, // Thursday
    6: 5  // Friday
  };

  const finalIndex = zellerMap[h];
  const dayName = weekdayNames[finalIndex];
  steps.push(`h = ${h} corresponds to ${dayName} (where Zeller's 0=Saturday, 1=Sunday, etc.).`);

  return { dayName, steps };
};

export const solveAptitudeProblem = (topicId: string, inputs: Record<string, string | number>): CalculationResult => {
  const steps: string[] = [];

  switch (topicId) {
    case "simple-interest": {
      const P = Number(inputs.principal) || 0;
      const R = Number(inputs.rate) || 0;
      const T = Number(inputs.time) || 0;

      const SI = (P * R * T) / 100;
      const A = P + SI;

      steps.push(`Step 1: Identify given variables: Principal (P) = ₹${P}, Rate (R) = ${R}%, Time (T) = ${T} years.`);
      steps.push(`Step 2: Apply Simple Interest formula: SI = (P × R × T) / 100`);
      steps.push(`Step 3: Calculate: SI = (${P} × ${R} × ${T}) / 100 = ₹${SI.toFixed(2)}`);
      steps.push(`Step 4: Calculate Total Amount: A = P + SI = ${P} + ${SI.toFixed(2)} = ₹${A.toFixed(2)}`);

      return {
        answer: `SI = ₹${SI.toFixed(2)}, Total Amount = ₹${A.toFixed(2)}`,
        steps,
        formula: "SI = (P × R × T) / 100",
        visualBreakdown: [
          { label: "Principal", value: `₹${P}` },
          { label: "Rate", value: `${R}%` },
          { label: "Time", value: `${T} Years` },
          { label: "Simple Interest", value: `₹${SI.toFixed(2)}` },
          { label: "Total Amount", value: `₹${A.toFixed(2)}` }
        ]
      };
    }

    case "compound-interest": {
      const P = Number(inputs.principal) || 0;
      const R = Number(inputs.rate) || 0;
      const T = Number(inputs.time) || 0;
      const n = Number(inputs.compounding) || 1;

      const ratePerPeriod = R / (100 * n);
      const totalPeriods = n * T;
      const A = P * Math.pow(1 + ratePerPeriod, totalPeriods);
      const CI = A - P;

      const compMap: Record<number, string> = { 1: "annually", 2: "semi-annually", 4: "quarterly", 12: "monthly" };
      steps.push(`Step 1: Identify values: P = ₹${P}, R = ${R}%, T = ${T} years, compounding frequency = ${compMap[n] || "n=" + n}.`);
      steps.push(`Step 2: Apply Amount formula: A = P × (1 + R / (100 × n))^(n × T)`);
      steps.push(`Step 3: Calculate rate per compounding period: R_p = ${R} / (100 × ${n}) = ${ratePerPeriod.toFixed(4)}`);
      steps.push(`Step 4: Calculate total periods: N = ${n} × ${T} = ${totalPeriods}`);
      steps.push(`Step 5: Compute Amount: A = ${P} × (1 + ${ratePerPeriod.toFixed(4)})^${totalPeriods} = ₹${A.toFixed(2)}`);
      steps.push(`Step 6: Compute Compound Interest: CI = A - P = ${A.toFixed(2)} - ${P} = ₹${CI.toFixed(2)}`);

      return {
        answer: `CI = ₹${CI.toFixed(2)}, Total Amount = ₹${A.toFixed(2)}`,
        steps,
        formula: "A = P × (1 + R / (100 × n))^(n × T)",
        visualBreakdown: [
          { label: "Principal", value: `₹${P}` },
          { label: "Compound Interest", value: `₹${CI.toFixed(2)}` },
          { label: "Total Amount", value: `₹${A.toFixed(2)}` }
        ]
      };
    }

    case "problems-on-trains": {
      const lenTrain = Number(inputs.lengthTrain) || 0;
      const speedTrainKmh = Number(inputs.speedTrain) || 0;
      const lenObj = Number(inputs.lengthObject) || 0;
      const speedObjKmh = Number(inputs.speedObject) || 0;
      const dir = String(inputs.direction);

      const totalDist = lenTrain + lenObj;
      steps.push(`Step 1: Total Distance to cover = Train Length (${lenTrain}m) + Object Length (${lenObj}m) = ${totalDist} meters.`);

      // Convert speeds to m/s
      const sTrainMs = speedTrainKmh * (5 / 18);
      steps.push(`Step 2: Convert Train Speed to m/s: ${speedTrainKmh} km/h × 5/18 = ${sTrainMs.toFixed(2)} m/s.`);

      let relativeSpeedMs = sTrainMs;
      if (dir === "same") {
        const sObjMs = speedObjKmh * (5 / 18);
        relativeSpeedMs = Math.abs(sTrainMs - sObjMs);
        steps.push(`Step 3: Same Direction. Relative Speed = |Train Speed - Object Speed| = |${sTrainMs.toFixed(2)} - ${sObjMs.toFixed(2)}| = ${relativeSpeedMs.toFixed(2)} m/s.`);
      } else if (dir === "opposite") {
        const sObjMs = speedObjKmh * (5 / 18);
        relativeSpeedMs = sTrainMs + sObjMs;
        steps.push(`Step 3: Opposite Direction. Relative Speed = Train Speed + Object Speed = ${sTrainMs.toFixed(2)} + ${sObjMs.toFixed(2)} = ${relativeSpeedMs.toFixed(2)} m/s.`);
      } else {
        steps.push(`Step 3: Object is stationary. Relative Speed = Train Speed = ${sTrainMs.toFixed(2)} m/s.`);
      }

      if (relativeSpeedMs <= 0) {
        return {
          answer: "Infinite / No crossing (speeds are equal and same direction)",
          steps: [...steps, "Relative speed is zero, trains will never cross each other."],
          formula: "Time = Distance / Relative Speed"
        };
      }

      const timeSec = totalDist / relativeSpeedMs;
      steps.push(`Step 4: Apply formula: Time = Distance / Speed = ${totalDist} / ${relativeSpeedMs.toFixed(2)} = ${timeSec.toFixed(2)} seconds.`);

      return {
        answer: `Crossing Time = ${timeSec.toFixed(2)} seconds`,
        steps,
        formula: "Time = (Length of Train + Length of Object) / Relative Speed",
        visualBreakdown: [
          { label: "Total Distance", value: `${totalDist} meters` },
          { label: "Relative Speed", value: `${(relativeSpeedMs * 18/5).toFixed(1)} km/h (${relativeSpeedMs.toFixed(2)} m/s)` },
          { label: "Crossing Time", value: `${timeSec.toFixed(2)} Seconds` }
        ]
      };
    }

    case "time-and-distance": {
      const dist = Number(inputs.distance) || 0;
      const speed = Number(inputs.speed) || 0;
      const time = Number(inputs.time) || 0;

      if (dist === 0 && speed > 0 && time > 0) {
        const calculatedDist = speed * time;
        steps.push(`Step 1: Distance is missing. Use formula: Distance = Speed × Time`);
        steps.push(`Step 2: Calculate: Distance = ${speed} km/h × ${time} hours = ${calculatedDist.toFixed(2)} km.`);
        return {
          answer: `Distance = ${calculatedDist.toFixed(2)} km`,
          steps,
          formula: "Distance = Speed × Time"
        };
      } else if (speed === 0 && dist > 0 && time > 0) {
        const calculatedSpeed = dist / time;
        steps.push(`Step 1: Speed is missing. Use formula: Speed = Distance / Time`);
        steps.push(`Step 2: Calculate: Speed = ${dist} km / ${time} hours = ${calculatedSpeed.toFixed(2)} km/h.`);
        steps.push(`Step 3: Convert to m/s: ${calculatedSpeed.toFixed(2)} × 5/18 = ${(calculatedSpeed * 5/18).toFixed(2)} m/s.`);
        return {
          answer: `Speed = ${calculatedSpeed.toFixed(2)} km/h (${(calculatedSpeed * 5/18).toFixed(2)} m/s)`,
          steps,
          formula: "Speed = Distance / Time"
        };
      } else if (time === 0 && dist > 0 && speed > 0) {
        const calculatedTime = dist / speed;
        const hours = Math.floor(calculatedTime);
        const mins = Math.round((calculatedTime - hours) * 60);
        steps.push(`Step 1: Time is missing. Use formula: Time = Distance / Speed`);
        steps.push(`Step 2: Calculate: Time = ${dist} km / ${speed} km/h = ${calculatedTime.toFixed(2)} hours.`);
        steps.push(`Step 3: Format: ${hours} hours and ${mins} minutes.`);
        return {
          answer: `Time = ${calculatedTime.toFixed(2)} hours (${hours}h ${mins}m)`,
          steps,
          formula: "Time = Distance / Speed"
        };
      } else {
        return {
          answer: "Please leave exactly one variable empty (0) to calculate it.",
          steps: ["Input validation failed. Set one field to 0 to trigger calculation."],
          formula: "Distance = Speed × Time"
        };
      }
    }

    case "time-and-work": {
      const A = Number(inputs.daysA) || 0;
      const B = Number(inputs.daysB) || 0;

      if (A <= 0 || B <= 0) {
        return {
          answer: "Invalid Inputs",
          steps: ["Please enter positive number of days for A and B."],
          formula: "1/T = 1/A + 1/B"
        };
      }

      const rateA = 1 / A;
      const rateB = 1 / B;
      const combinedRate = rateA + rateB;
      const timeTogether = 1 / combinedRate;

      steps.push(`Step 1: Work rate of A = 1 / ${A} per day.`);
      steps.push(`Step 2: Work rate of B = 1 / ${B} per day.`);
      steps.push(`Step 3: Combined work rate = 1/${A} + 1/${B} = (${A} + ${B}) / (${A} × ${B}) = ${combinedRate.toFixed(4)} per day.`);
      steps.push(`Step 4: Time taken together = 1 / Combined Rate = ${timeTogether.toFixed(2)} days.`);

      return {
        answer: `Combined Time = ${timeTogether.toFixed(2)} days`,
        steps,
        formula: "Combined Time (T) = (A × B) / (A + B)",
        visualBreakdown: [
          { label: "A's Efficiency", value: `${(rateA * 100).toFixed(1)}% / day` },
          { label: "B's Efficiency", value: `${(rateB * 100).toFixed(1)}% / day` },
          { label: "Combined Days", value: `${timeTogether.toFixed(2)} Days` }
        ]
      };
    }

    case "profit-and-loss": {
      const CP = Number(inputs.costPrice) || 0;
      const SP = Number(inputs.sellingPrice) || 0;

      if (CP <= 0) {
        return {
          answer: "Invalid Cost Price",
          steps: ["Cost Price must be greater than zero."],
          formula: "Profit/Loss Calculations"
        };
      }

      if (SP > CP) {
        const profit = SP - CP;
        const profitPercent = (profit / CP) * 100;
        steps.push(`Step 1: Compare SP and CP: SP (₹${SP}) > CP (₹${CP}) ⇒ Profit.`);
        steps.push(`Step 2: Calculate Profit: SP - CP = ${SP} - ${CP} = ₹${profit.toFixed(2)}`);
        steps.push(`Step 3: Calculate Profit Percentage: (Profit / CP) × 100 = (${profit.toFixed(2)} / ${CP}) × 100 = ${profitPercent.toFixed(2)}%`);
        return {
          answer: `Profit = ₹${profit.toFixed(2)} (${profitPercent.toFixed(2)}% Profit)`,
          steps,
          formula: "Profit% = ((SP - CP) / CP) × 100",
          visualBreakdown: [
            { label: "Cost Price (CP)", value: `₹${CP}` },
            { label: "Selling Price (SP)", value: `₹${SP}` },
            { label: "Net Profit", value: `₹${profit.toFixed(2)}` },
            { label: "Profit Percentage", value: `${profitPercent.toFixed(2)}%` }
          ]
        };
      } else if (CP > SP) {
        const loss = CP - SP;
        const lossPercent = (loss / CP) * 100;
        steps.push(`Step 1: Compare SP and CP: CP (₹${CP}) > SP (₹${SP}) ⇒ Loss.`);
        steps.push(`Step 2: Calculate Loss: CP - SP = ${CP} - ${SP} = ₹${loss.toFixed(2)}`);
        steps.push(`Step 3: Calculate Loss Percentage: (Loss / CP) × 100 = (${loss.toFixed(2)} / ${CP}) × 100 = ${lossPercent.toFixed(2)}%`);
        return {
          answer: `Loss = ₹${loss.toFixed(2)} (${lossPercent.toFixed(2)}% Loss)`,
          steps,
          formula: "Loss% = ((CP - SP) / CP) × 100",
          visualBreakdown: [
            { label: "Cost Price (CP)", value: `₹${CP}` },
            { label: "Selling Price (SP)", value: `₹${SP}` },
            { label: "Net Loss", value: `₹${loss.toFixed(2)}` },
            { label: "Loss Percentage", value: `${lossPercent.toFixed(2)}%` }
          ]
        };
      } else {
        steps.push(`SP equals CP. No Profit, No Loss.`);
        return {
          answer: "No Profit, No Loss (0%)",
          steps,
          formula: "SP = CP"
        };
      }
    }

    case "percentage": {
      const total = Number(inputs.total) || 0;
      const percentage = Number(inputs.percentage) || 0;

      const value = (percentage / 100) * total;
      steps.push(`Step 1: Apply percentage formula: Value = (Percent / 100) × Base`);
      steps.push(`Step 2: Calculate: (${percentage} / 100) × ${total} = ${value.toFixed(2)}`);

      return {
        answer: `${percentage}% of ${total} = ${value.toFixed(2)}`,
        steps,
        formula: "Value = (P / 100) × Total"
      };
    }

    case "problems-on-ages": {
      const curA = Number(inputs.ratioCurrentA) || 0;
      const curB = Number(inputs.ratioCurrentB) || 0;
      const yearsDiff = Number(inputs.yearsDifference) || 0;
      const futA = Number(inputs.ratioFutureA) || 0;
      const futB = Number(inputs.ratioFutureB) || 0;

      steps.push(`Step 1: Let the current age of A and B be ${curA}x and ${curB}x.`);
      steps.push(`Step 2: Set up equation for ages after ${yearsDiff} years: (${curA}x + ${yearsDiff}) / (${curB}x + ${yearsDiff}) = ${futA} / ${futB}`);

      // (curA*x + yearsDiff)*futB = (curB*x + yearsDiff)*futA
      // curA*futB*x + yearsDiff*futB = curB*futA*x + yearsDiff*futA
      // x * (curA*futB - curB*futA) = yearsDiff * (futA - futB)
      const lhsCoefficient = curA * futB - curB * futA;
      const rhsConstant = yearsDiff * (futA - futB);

      if (lhsCoefficient === 0) {
        return {
          answer: "Consistent ratio mismatch or invalid entries.",
          steps: [...steps, "The coefficients lead to division by zero, check ratio consistency."],
          formula: "Ages linear equation solver"
        };
      }

      const x = rhsConstant / lhsCoefficient;
      steps.push(`Step 3: Cross multiply and solve for x: x = (${yearsDiff} × (${futA} - ${futB})) / (${curA} × ${futB} - ${curB} × ${futA}) = ${x.toFixed(2)}`);

      const ageA = curA * x;
      const ageB = curB * x;

      steps.push(`Step 4: Compute current ages: A = ${curA} × ${x.toFixed(2)} = ${ageA.toFixed(1)} years. B = ${curB} × ${x.toFixed(2)} = ${ageB.toFixed(1)} years.`);

      return {
        answer: `A's Age = ${ageA.toFixed(1)} yrs, B's Age = ${ageB.toFixed(1)} yrs`,
        steps,
        formula: "(ratioA * x + diff) / (ratioB * x + diff) = ratioFutureA / ratioFutureB",
        visualBreakdown: [
          { label: "Common factor (x)", value: x.toFixed(2) },
          { label: "Age of Person A", value: `${ageA.toFixed(1)} Years` },
          { label: "Age of Person B", value: `${ageB.toFixed(1)} Years` }
        ]
      };
    }

    case "calendar": {
      const d = Number(inputs.day) || 1;
      const m = Number(inputs.month) || 1;
      const y = Number(inputs.year) || 2000;

      const zeller = getWeekdayName(d, m, y);
      return {
        answer: `Weekday: ${zeller.dayName}`,
        steps: zeller.steps,
        formula: "Zeller's Congruence"
      };
    }

    case "clock": {
      const h = Number(inputs.hour) || 12;
      const m = Number(inputs.minute) || 0;

      const angleHour = 30 * h + 0.5 * m;
      const angleMin = 6 * m;
      let angle = Math.abs(angleHour - angleMin);

      steps.push(`Step 1: Calculate angle of Hour Hand from 12 o'clock anchor: (30 × H) + (0.5 × M) = (30 × ${h}) + (0.5 × ${m}) = ${angleHour}°`);
      steps.push(`Step 2: Calculate angle of Minute Hand from 12 o'clock anchor: 6 × M = 6 × ${m} = ${angleMin}°`);
      steps.push(`Step 3: Compute difference: |Hour Angle - Minute Angle| = |${angleHour} - ${angleMin}| = ${angle}°`);

      if (angle > 180) {
        const reflex = 360 - angle;
        steps.push(`Step 4: Angle is reflex (>180°). Fetch primary interior angle: 360° - ${angle}° = ${reflex}°`);
        angle = reflex;
      }

      return {
        answer: `Angle = ${angle}°`,
        steps,
        formula: "θ = |(30 × H) - (11/2 × M)|"
      };
    }

    case "average": {
      const listStr = String(inputs.numbersList || "");
      const numbers = listStr.split(",").map(n => Number(n.trim())).filter(n => !isNaN(n));

      if (numbers.length === 0) {
        return {
          answer: "Empty numbers list",
          steps: ["Please enter valid comma-separated values."],
          formula: "Avg = Sum / Count"
        };
      }

      const sum = numbers.reduce((acc, curr) => acc + curr, 0);
      const avg = sum / numbers.length;

      steps.push(`Step 1: Parse and clean inputs: [${numbers.join(", ")}]`);
      steps.push(`Step 2: Calculate sum of list: ${numbers.join(" + ")} = ${sum}`);
      steps.push(`Step 3: Count total elements: ${numbers.length}`);
      steps.push(`Step 4: Calculate Average: Sum / Count = ${sum} / ${numbers.length} = ${avg.toFixed(2)}`);

      return {
        answer: `Average = ${avg.toFixed(2)} (Sum = ${sum})`,
        steps,
        formula: "Average = Sum / Count",
        visualBreakdown: [
          { label: "Elements Count", value: numbers.length },
          { label: "Sum of elements", value: sum },
          { label: "Average Value", value: avg.toFixed(2) }
        ]
      };
    }

    case "partnership": {
      const invA = Number(inputs.investA) || 0;
      const timeA = Number(inputs.timeA) || 0;
      const invB = Number(inputs.investB) || 0;
      const timeB = Number(inputs.timeB) || 0;
      const profit = Number(inputs.totalProfit) || 0;

      const weightA = invA * timeA;
      const weightB = invB * timeB;
      const totalWeight = weightA + weightB;

      if (totalWeight <= 0) {
        return {
          answer: "Total shares zero. Check inputs.",
          steps: ["Investments or durations are zero."],
          formula: "Profit Ratio = (CapA × TimeA) : (CapB × TimeB)"
        };
      }

      const shareA = (weightA / totalWeight) * profit;
      const shareB = (weightB / totalWeight) * profit;

      steps.push(`Step 1: Compute share weighting for Partner A: Investment (${invA}) × Time (${timeA}) = ${weightA}`);
      steps.push(`Step 2: Compute share weighting for Partner B: Investment (${invB}) × Time (${timeB}) = ${weightB}`);
      steps.push(`Step 3: Ratio of profit distribution (A:B) = ${weightA} : ${weightB}`);
      steps.push(`Step 4: Distribute Total Profit (₹${profit}):`);
      steps.push(`- A's Share = (${weightA} / ${totalWeight}) × ${profit} = ₹${shareA.toFixed(2)}`);
      steps.push(`- B's Share = (${weightB} / ${totalWeight}) × ${profit} = ₹${shareB.toFixed(2)}`);

      return {
        answer: `A's Share = ₹${shareA.toFixed(2)}, B's Share = ₹${shareB.toFixed(2)}`,
        steps,
        formula: "Share = (ProfitWeight / TotalProfitWeight) × TotalProfit",
        visualBreakdown: [
          { label: "Ratio A : B", value: `${weightA} : ${weightB}` },
          { label: "Partner A Share", value: `₹${shareA.toFixed(2)}` },
          { label: "Partner B Share", value: `₹${shareB.toFixed(2)}` }
        ]
      };
    }

    case "boats-and-streams": {
      const u = Number(inputs.boatSpeed) || 0;
      const v = Number(inputs.streamSpeed) || 0;

      const down = u + v;
      const up = u - v;

      steps.push(`Step 1: Let Boat speed in still water = ${u} km/h, Stream speed = ${v} km/h.`);
      steps.push(`Step 2: Downstream Speed (moving with water) = u + v = ${u} + ${v} = ${down} km/h.`);
      steps.push(`Step 3: Upstream Speed (moving against water) = u - v = ${u} - ${v} = ${up} km/h.`);

      return {
        answer: `Downstream = ${down} km/h, Upstream = ${up} km/h`,
        steps,
        formula: "Downstream = u + v, Upstream = u - v"
      };
    }

    case "ratio-and-proportion": {
      const a = Number(inputs.valA) || 0;
      const b = Number(inputs.valB) || 0;
      const c = Number(inputs.valC) || 0;

      if (a === 0 || b === 0) {
        return {
          answer: "Values cannot be zero.",
          steps: ["Cannot solve: values A and B are critical parameters."],
          formula: "Proportions"
        };
      }

      // Mean proportional of A & B
      const mean = Math.sqrt(a * b);
      // Fourth proportional of a:b :: c:d
      let fourth = 0;
      if (c > 0) {
        fourth = (b * c) / a;
      }

      steps.push(`Step 1: Calculate Mean Proportional between A (${a}) and B (${b}): Mean = √(A × B) = √(${a * b}) = ${mean.toFixed(2)}`);
      if (c > 0) {
        steps.push(`Step 2: Given C (${c}), find Fourth Proportional (d) in A:B :: C:d: d = (B × C) / A = (${b} × ${c}) / ${a} = ${fourth.toFixed(2)}`);
      }

      return {
        answer: `Mean Prop = ${mean.toFixed(2)}${c > 0 ? `, Fourth Prop = ${fourth.toFixed(2)}` : ""}`,
        steps,
        formula: "Mean = √(a × b), Fourth = (b × c) / a"
      };
    }

    case "probability": {
      const e = Number(inputs.favorable) || 0;
      const s = Number(inputs.totalSpace) || 0;

      if (s <= 0 || e < 0 || e > s) {
        return {
          answer: "Invalid Outcomes Space",
          steps: ["Total space must be greater than zero, and favorable outcomes must not exceed it."],
          formula: "P(E) = n(E) / n(S)"
        };
      }

      const p = e / s;
      const pct = p * 100;

      steps.push(`Step 1: Count favorable outcomes n(E) = ${e}`);
      steps.push(`Step 2: Count sample space n(S) = ${s}`);
      steps.push(`Step 3: Compute Probability: P(E) = n(E) / n(S) = ${e} / ${s} = ${p.toFixed(4)} (${pct.toFixed(2)}%)`);

      return {
        answer: `Probability = ${p.toFixed(4)} (${pct.toFixed(1)}%)`,
        steps,
        formula: "P(E) = n(E) / n(S)"
      };
    }

    case "permutations-and-combinations": {
      const n = Number(inputs.n) || 0;
      const r = Number(inputs.r) || 0;

      if (n < 0 || r < 0 || r > n) {
        return {
          answer: "Invalid configuration (ensure n >= r >= 0)",
          steps: ["Input check failed: objects subset size cannot exceed total objects."],
          formula: "nPr = n! / (n - r)!, nCr = n! / (r! × (n - r)!)"
        };
      }

      const factN = fact(n);
      const factR = fact(r);
      const factNmR = fact(n - r);

      const nPr = factN / factNmR;
      const nCr = factN / (factR * factNmR);

      steps.push(`Step 1: Compute factorials: n! = ${n}! = ${factN}, r! = ${r}! = ${factR}, (n-r)! = ${n - r}! = ${factNmR}`);
      steps.push(`Step 2: Permutations (nPr): ${n}! / (${n} - ${r})! = ${factN} / ${factNmR} = ${nPr}`);
      steps.push(`Step 3: Combinations (nCr): ${n}! / (${r}! × (${n} - ${r})!) = ${factN} / (${factR} × ${factNmR}) = ${nCr}`);

      return {
        answer: `nPr (Arrangements) = ${nPr}, nCr (Selections) = ${nCr}`,
        steps,
        formula: "nPr = n!/(n-r)!, nCr = n!/(r!(n-r)!)",
        visualBreakdown: [
          { label: "n!", value: factN },
          { label: "r!", value: factR },
          { label: "Arrangements (nPr)", value: nPr },
          { label: "Selections (nCr)", value: nCr }
        ]
      };
    }

    case "area": {
      const a = Number(inputs.valA) || 0;
      const b = Number(inputs.valB) || 0;

      if (b === 0) {
        // Assume circle
        const circleArea = Math.PI * a * a;
        steps.push(`Step 1: Width/Height is 0, assuming Circle with radius r = ${a}`);
        steps.push(`Step 2: Apply formula: Area = π × r²`);
        steps.push(`Step 3: Calculate: Area = 3.14159 × ${a}² = ${circleArea.toFixed(2)}`);
        return {
          answer: `Circle Area = ${circleArea.toFixed(2)} sq. units`,
          steps,
          formula: "Area = π × r²"
        };
      } else {
        // Rectangle and Triangle
        const rectArea = a * b;
        const triArea = 0.5 * a * b;
        steps.push(`Step 1: Given parameters a = ${a}, b = ${b}`);
        steps.push(`Step 2: Rectangle Area (l × w) = ${a} × ${b} = ${rectArea.toFixed(2)} sq. units`);
        steps.push(`Step 3: Triangle Area (0.5 × b × h) = 0.5 × ${a} × ${b} = ${triArea.toFixed(2)} sq. units`);
        return {
          answer: `Rectangle Area = ${rectArea.toFixed(2)}, Triangle Area = ${triArea.toFixed(2)}`,
          steps,
          formula: "Area = l × w  |  Area = 0.5 × b × h"
        };
      }
    }

    case "volume-and-surface-area": {
      const r = Number(inputs.valA) || 0;
      const w = Number(inputs.valB) || 0;
      const h = Number(inputs.valC) || 0;

      if (w === 0 && h === 0) {
        // Sphere
        const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
        steps.push(`Step 1: Assuming Sphere with radius r = ${r}`);
        steps.push(`Step 2: Apply formula: V = (4/3) × π × r³`);
        steps.push(`Step 3: Calculate: V = 1.333 × 3.14159 × ${r}³ = ${vol.toFixed(2)}`);
        return {
          answer: `Sphere Volume = ${vol.toFixed(2)} cubic units`,
          steps,
          formula: "V = (4/3) × π × r³"
        };
      } else if (w === 0 && h > 0) {
        // Cylinder
        const vol = Math.PI * r * r * h;
        steps.push(`Step 1: Assuming Cylinder with radius r = ${r}, height h = ${h}`);
        steps.push(`Step 2: Apply formula: V = π × r² × h`);
        steps.push(`Step 3: Calculate: V = 3.14159 × ${r}² × ${h} = ${vol.toFixed(2)}`);
        return {
          answer: `Cylinder Volume = ${vol.toFixed(2)} cubic units`,
          steps,
          formula: "V = π × r² × h"
        };
      } else {
        // Cuboid
        const vol = r * w * h;
        steps.push(`Step 1: Assuming Cuboid with length = ${r}, width = ${w}, height = ${h}`);
        steps.push(`Step 2: Apply formula: V = l × w × h`);
        steps.push(`Step 3: Calculate: V = ${r} × ${w} × ${h} = ${vol.toFixed(2)}`);
        return {
          answer: `Cuboid Volume = ${vol.toFixed(2)} cubic units`,
          steps,
          formula: "V = l × w × h"
        };
      }
    }

    case "logarithms": {
      const x = Number(inputs.valA) || 1;
      const b = Number(inputs.valB) || 10;

      if (x <= 0 || b <= 0 || b === 1) {
        return {
          answer: "Invalid logarithm parameters",
          steps: ["Argument and base must be positive, and base must not be 1."],
          formula: "log_b(x)"
        };
      }

      const res = Math.log(x) / Math.log(b);
      steps.push(`Step 1: Identify parameter Argument (x) = ${x}, Base (b) = ${b}`);
      steps.push(`Step 2: Apply Base Change theorem: log_b(x) = ln(x) / ln(b)`);
      steps.push(`Step 3: Calculate: ln(${x}) / ln(${b}) = ${Math.log(x).toFixed(4)} / ${Math.log(b).toFixed(4)} = ${res.toFixed(4)}`);

      return {
        answer: `log_${b}(${x}) = ${res.toFixed(4)}`,
        steps,
        formula: "log_b(x) = ln(x) / ln(b)"
      };
    }

    case "hcf-and-lcm": {
      const a = Number(inputs.valA) || 1;
      const b = Number(inputs.valB) || 1;

      const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
      const HCF = gcd(a, b);
      const LCM = (a * b) / HCF;

      steps.push(`Step 1: Identify values A = ${a}, B = ${b}`);
      steps.push(`Step 2: Compute HCF (Euclidean Algorithm): HCF(${a}, ${b}) = ${HCF}`);
      steps.push(`Step 3: Compute LCM using HCF: LCM = (A × B) / HCF = (${a} × ${b}) / ${HCF} = ${LCM}`);

      return {
        answer: `HCF = ${HCF}, LCM = ${LCM}`,
        steps,
        formula: "A × B = HCF × LCM",
        visualBreakdown: [
          { label: "Number A", value: a },
          { label: "Number B", value: b },
          { label: "HCF (GCD)", value: HCF },
          { label: "LCM", value: LCM }
        ]
      };
    }

    case "surds-and-indices": {
      const base = Number(inputs.valA) || 0;
      const m = Number(inputs.valB) || 0;
      const n = Number(inputs.valC) || 0;

      const p1 = Math.pow(base, m);
      const p2 = Math.pow(base, n);
      const prod = Math.pow(base, m + n);

      steps.push(`Step 1: Given base = ${base}, powers m = ${m}, n = ${n}`);
      steps.push(`Step 2: Evaluate individual powers: base^m = ${p1}, base^n = ${p2}`);
      steps.push(`Step 3: Apply multiplication rule base^m × base^n = base^(m+n) = ${base}^(${m}+${n}) = ${base}^${m+n} = ${prod}`);

      return {
        answer: `${base}^${m} × ${base}^${n} = ${prod}`,
        steps,
        formula: "a^m × a^n = a^(m + n)"
      };
    }

    case "pipes-and-cisterns": {
      const a = Number(inputs.daysA) || 0;
      const b = Number(inputs.daysB) || 0;

      if (a <= 0 || b <= 0) {
        return {
          answer: "Invalid pipes rates",
          steps: ["Inlet fill periods must be greater than zero."],
          formula: "1/T = 1/A + 1/B"
        };
      }

      const rateA = 1 / a;
      const rateB = 1 / b;
      const combined = rateA + rateB;
      const T = 1 / combined;

      steps.push(`Step 1: Inlet rate of Pipe A = 1/${a} per hour`);
      steps.push(`Step 2: Inlet rate of Pipe B = 1/${b} per hour`);
      steps.push(`Step 3: Combined filling speed = 1/${a} + 1/${b} = ${combined.toFixed(4)} per hour`);
      steps.push(`Step 4: Total time to fill cistern = 1 / Combined Speed = ${T.toFixed(2)} hours`);

      return {
        answer: `Filling Time = ${T.toFixed(2)} hours`,
        steps,
        formula: "T = (A × B) / (A + B)",
        visualBreakdown: [
          { label: "Pipe A Rate", value: `${(rateA*100).toFixed(1)}% / hr` },
          { label: "Pipe B Rate", value: `${(rateB*100).toFixed(1)}% / hr` },
          { label: "Cistern Fill Time", value: `${T.toFixed(2)} hrs` }
        ]
      };
    }

    default:
      return {
        answer: "Calculator not implemented yet",
        steps: ["Placeholder explanation step 1", "Placeholder explanation step 2"],
        formula: "Formula Reference"
      };
  }
};
