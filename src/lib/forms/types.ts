export const FORM_TYPES = [
  "kontakt",
  "patenschaft",
  "fund",
  "pflegestelle",
  "vermittlung",
] as const;

export type FormType = (typeof FORM_TYPES)[number];

export function isFormType(value: string): value is FormType {
  return (FORM_TYPES as readonly string[]).includes(value);
}
