const SMALL = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
]

/** A small count in words ("eight"); digits from 13 up. */
export const numberWord = (n: number) => SMALL[n] ?? String(n)

/** The same, capitalised to start a sentence ("Eight"). */
export const NumberWord = (n: number) => {
  const word = numberWord(n)
  return word.charAt(0).toUpperCase() + word.slice(1)
}
