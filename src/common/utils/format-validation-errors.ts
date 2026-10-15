import { ValidationError } from 'class-validator';

export type ValidationErrorItem = {
  property: string;
  message: string;
};

export function formatValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationErrorItem[] {
  const items: ValidationErrorItem[] = [];

  for (const error of errors) {
    const property = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        items.push({ property, message });
      }
    }

    if (error.children?.length) {
      items.push(...formatValidationErrors(error.children, property));
    }
  }

  return items;
}
