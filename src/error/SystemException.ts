import { ErrorFactory } from "./ErrorFactory";
import { SpecificityError } from "./specificity";

export abstract class SystemException extends Error {
  constructor(
    message: string,
    private readonly factory: ErrorFactory,
    private readonly specificity: SpecificityError,
  ) {
    super(message);
  }

  get getFactory(): ErrorFactory {
    return this.factory;
  }

  get getSpecificity(): SpecificityError {
    return this.specificity;
  }

  get erro() {
    return this.factory.create(this.specificity);
  }
}
