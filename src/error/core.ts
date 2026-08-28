import { SpecificityError } from "./specificity";

export interface ErrorCore {
  getCategoryError(): NatureErrors;
  code(): string;
  getSpecificity(): SpecificityError;
}

export enum NatureErrors {
  API_REQUEST = "100",
  DOMAIN = "200",
  NEGOTIATE = "300",
  TELEGRAM = "400",
  INTERNAL = "500",
  DATABASE = "600",
  WHATSAPP = "700",
}
