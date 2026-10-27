/**
 * Exact Chronological Age & Date Difference Calculator.
 * Handles leap years and varying month days accurately.
 * Zero external dependencies.
 */

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const ZODIAC_SIGNS = [
  { sign: "Capricorn", emoji: "♑", from: [1, 1], to: [1, 19] },
  { sign: "Aquarius", emoji: "♒", from: [1, 20], to: [2, 18] },
  { sign: "Pisces", emoji: "♓", from: [2, 19], to: [3, 20] },
  { sign: "Aries", emoji: "♈", from: [3, 21], to: [4, 19] },
  { sign: "Taurus", emoji: "♉", from: [4, 20], to: [5, 20] },
  { sign: "Gemini", emoji: "♊", from: [5, 21], to: [6, 20] },
  { sign: "Cancer", emoji: "♋", from: [6, 21], to: [7, 22] },
  { sign: "Leo", emoji: "♌", from: [7, 23], to: [8, 22] },
  { sign: "Virgo", emoji: "♍", from: [8, 23], to: [9, 22] },
  { sign: "Libra", emoji: "♎", from: [9, 23], to: [10, 22] },
  { sign: "Scorpio", emoji: "♏", from: [10, 23], to: [11, 21] },
  { sign: "Sagittarius", emoji: "♐", from: [11, 22], to: [12, 21] },
  { sign: "Capricorn", emoji: "♑", from: [12, 22], to: [12, 31] },
];

function getZodiac(month, day) {
  for (const z of ZODIAC_SIGNS) {
    const [fromM, fromD] = z.from;
    const [toM, toD] = z.to;
    if (
      (month === fromM && day >= fromD) ||
      (month === toM && day <= toD)
    ) {
      return z;
    }
  }
  return { sign: "Capricorn", emoji: "♑" };
}

/**
 * Calculates complete age metrics.
 * @param {string|Date} birthDateStr
 * @param {string|Date} [targetDateStr]
 * @returns {object|null}
 */
export function calculateAge(birthDateStr, targetDateStr = null) {
  if (!birthDateStr) return null;

  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return null;

  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
  if (isNaN(targetDate.getTime())) return null;

  if (birthDate > targetDate) {
    return {
      error: "Date of birth cannot be in the future relative to the target date.",
    };
  }

  // Exact calendar calculation
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    // Borrow days from previous month
    const previousMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += previousMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  // Total elapsed durations
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysInWeek = totalDays % 7;
  const totalMonths = years * 12 + months;
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // Next Birthday calculation
  const currentYear = targetDate.getFullYear();
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < targetDate) {
    nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const nextBdayDiffMs = nextBirthday.getTime() - targetDate.getTime();
  const nextBdayDays = Math.ceil(nextBdayDiffMs / (1000 * 60 * 60 * 24));
  const nextBdayDayOfWeek = DAYS_OF_WEEK[nextBirthday.getDay()];

  // Day born
  const dayBorn = DAYS_OF_WEEK[birthDate.getDay()];

  // Zodiac
  const zodiac = getZodiac(birthDate.getMonth() + 1, birthDate.getDate());

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    remainingDaysInWeek,
    totalDays,
    totalHours,
    totalMinutes,
    dayBorn,
    nextBirthday: {
      date: nextBirthday.toISOString().split("T")[0],
      daysRemaining: nextBdayDays,
      dayOfWeek: nextBdayDayOfWeek,
    },
    zodiac,
  };
}
