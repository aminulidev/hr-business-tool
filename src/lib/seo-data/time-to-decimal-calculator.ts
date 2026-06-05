const seoData = {
  // ------ SEO content ------

  howToSteps: [
    'Select the conversion mode: "Decimal to Fraction" to convert decimals like 0.75 to fractions like 3/4, "Fraction to Decimal" to convert 5/8 to 0.625, or "Decimal to Percent" to convert 0.375 to 37.5%.',
    'Enter your value in the input field provided. For fraction-to-decimal mode, enter the numerator and denominator separately.',
    'Click "Convert" to see the result instantly. For decimals, the calculator finds the simplest fraction equivalent. For fractions, it detects repeating decimals up to 6 decimal places.',
    'Review the visual bar representation showing the proportion visually. The green portion represents the value relative to 1 (or 100% for percent mode).',
    'Use the quick reference table at the bottom for common conversions including 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, and 7/8.',
  ],

  formula: 'Decimal = Numerator / Denominator\nPercent = Decimal × 100',
  formulaDescription:
    'To convert a fraction to a decimal, divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75. To convert a decimal to a percent, multiply by 100: 0.75 × 100 = 75%. To convert a decimal to a fraction, determine the place value (tenths, hundredths, thousandths, etc.) and simplify using the greatest common divisor (GCD). For example, 0.375 has three decimal places, so it equals 375/1000, which simplifies to 3/8 by dividing numerator and denominator by their GCD of 125. Some fractions produce repeating decimals (like 1/3 = 0.333...), which are denoted with a bar or parentheses over the repeating digits.',

  workedExamples: [
    {
      title: 'Decimal 0.75 to Fraction 3/4',
      description:
        'Convert 0.75 to a fraction. The decimal has two places, so it equals 75/100. Find the GCD of 75 and 100, which is 25. Divide both by 25: 75 ÷ 25 = 3, and 100 ÷ 25 = 4. So 0.75 = 3/4 in simplest form. Since 3/4 is a proper fraction (numerator < denominator), there is no whole number part.',
    },
    {
      title: 'Fraction 5/8 to Decimal 0.625',
      description:
        'Convert 5/8 to a decimal by dividing 5 by 8: 5 ÷ 8 = 0.625. This is a terminating decimal because 8 (the denominator) has only prime factors of 2. As a percentage: 0.625 × 100 = 62.5%. In mixed number terms, 5/8 is already a proper fraction, so it equals 0 5/8 as a mixed number.',
    },
    {
      title: 'Decimal 0.375 to Percent 37.5%',
      description:
        'Convert 0.375 to a percentage: 0.375 × 100 = 37.5%. To find the fraction: 0.375 has three decimal places, so it equals 375/1000. GCD of 375 and 1000 is 125. Simplified: 375 ÷ 125 = 3, and 1000 ÷ 125 = 8. So 0.375 = 3/8 = 37.5%. This is particularly useful in payroll calculations, where 3/8 of an hour equals 0.375 hours or 22.5 minutes.',
    },
  ],

  faqs: [
    {
      question: 'How do I convert a decimal to a fraction?',
      answer:
        'To convert a decimal to a fraction: (1) Write the decimal as a fraction with a denominator that is a power of 10. The denominator is 10 for one decimal place, 100 for two places, 1000 for three places, etc. (2) Simplify the fraction by dividing both numerator and denominator by their greatest common divisor (GCD). For example, 0.625 = 625/1000. The GCD of 625 and 1000 is 125. So 625 ÷ 125 = 5, and 1000 ÷ 125 = 8. Therefore, 0.625 = 5/8. For mixed numbers like 2.75: the whole number is 2, and 0.75 = 3/4, so the mixed number is 2 3/4 (or 11/4 as an improper fraction).',
    },
    {
      question: 'What is a repeating decimal?',
      answer:
        'A repeating decimal is a decimal number where one or more digits repeat infinitely after the decimal point. For example, 1/3 = 0.333..., 2/3 = 0.666..., and 1/7 = 0.142857142857.... Repeating decimals occur when the denominator of the fraction (in simplest form) has prime factors other than 2 or 5. They are typically written with a bar over the repeating digits: 0.3̄ for 1/3, or with parentheses: 0.(3). Some decimals have a non-repeating part followed by a repeating part, like 1/6 = 0.1(6) where the 6 repeats. This calculator detects repeating patterns up to 6 decimal places.',
    },
    {
      question: 'How do I simplify fractions?',
      answer:
        'To simplify a fraction, divide both the numerator and denominator by their greatest common divisor (GCD). The GCD is the largest number that divides both evenly. For example, to simplify 12/18: the factors of 12 are 1, 2, 3, 4, 6, 12. The factors of 18 are 1, 2, 3, 6, 9, 18. The GCD is 6. Divide both by 6: 12 ÷ 6 = 2, 18 ÷ 6 = 3. So 12/18 simplifies to 2/3. A fraction is fully simplified when the GCD of the numerator and denominator is 1 (they are coprime). You can use the Euclidean algorithm to find the GCD: repeatedly divide the larger number by the smaller, then the divisor by the remainder, until the remainder is 0.',
    },
    {
      question: 'What is a mixed number?',
      answer:
        'A mixed number combines a whole number and a proper fraction. It represents a quantity greater than 1 but not a whole number. For example, 2 3/4 means 2 wholes plus 3/4 of another. To convert an improper fraction (where the numerator is greater than or equal to the denominator) to a mixed number, divide the numerator by the denominator. The quotient is the whole number, and the remainder becomes the new numerator over the original denominator. For example, 11/4: 11 ÷ 4 = 2 remainder 3, so 11/4 = 2 3/4. To convert a mixed number back to an improper fraction: (whole × denominator) + numerator / denominator = (2 × 4) + 3 / 4 = 11/4.',
    },
    {
      question: 'Why are decimal conversions important in payroll?',
      answer:
        'Decimal conversions are essential in payroll because time is often tracked in hours and minutes, but payroll systems require decimal hours. For example, 30 minutes = 0.5 hours, 15 minutes = 0.25 hours, 45 minutes = 0.75 hours, and 22.5 minutes = 0.375 hours. Common payroll time conversions include: 1/4 hour = 0.25 (15 min), 1/2 hour = 0.5 (30 min), 3/4 hour = 0.75 (45 min), 1/8 hour = 0.125 (7.5 min), 1/10 hour = 0.1 (6 min). Understanding these conversions ensures accurate calculation of hourly wages, overtime, and total pay. The military and many organizations also use decimal time for scheduling and timekeeping.',
    },
    {
      question: 'What are common fraction-decimal equivalents I should know?',
      answer:
        'Here are the most commonly used fraction-decimal-percent equivalents: 1/8 = 0.125 = 12.5%, 1/4 = 0.25 = 25%, 1/3 ≈ 0.333 = 33.33%, 3/8 = 0.375 = 37.5%, 1/2 = 0.5 = 50%, 5/8 = 0.625 = 62.5%, 2/3 ≈ 0.667 = 66.67%, 3/4 = 0.75 = 75%, 7/8 = 0.875 = 87.5%. These fractions correspond to common measurements in construction, cooking, time tracking, and finance. Memorizing the eighths (1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8) is particularly useful because they appear frequently in real-world measurements and calculations.',
    },
  ],

  relatedTools: [
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Convert clock-in/out times to decimal hours for payroll', icon: 'Clock' },
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Calculate sale prices and percentage discounts', icon: 'Tag' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margin percentage from cost and revenue', icon: 'Percent' },
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Estimate your take-home pay after taxes and deductions', icon: 'CreditCard' },
    { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert between hourly, weekly, and annual pay rates', icon: 'ArrowLeftRight' },
  ],

  
};

export default seoData;
