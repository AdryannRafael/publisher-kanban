import { type ErrorCore, NatureErrors } from "./core";
import { SpecificityError } from "./specificity";
export class SystemError implements ErrorCore {
  constructor(
    private nature: NatureErrors,
    private specificity: SpecificityError,
  ) { }

  getCategoryError(): NatureErrors {
    return this.nature;
  }
  code(): string {
    return `${this.nature.toString()}${this.specificity.toString()}`;
  }
  getSpecificity(): SpecificityError {
    return this.specificity;
  }

  toString(): string {
    return `System error: ${this.nature.toString()} - ${this.specificity.toString()}`;
  }
}
