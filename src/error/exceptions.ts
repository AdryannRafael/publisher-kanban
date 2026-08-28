import { NatureErrors } from "./core";
import { ErrorFactory } from "./ErrorFactory";
import { SpecificityError } from "./specificity";
import { SystemException } from "./SystemException";

export class DomainException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.DOMAIN), specificity);
  }
}

export class APIRequestException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.API_REQUEST), specificity);
  }
}

export class NegotiateException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.NEGOTIATE), specificity);
  }
}

export class InternalException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.INTERNAL), specificity);
  }
}

export class DatabaseException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.DATABASE), specificity);
  }
  
}

export class TelegramException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.TELEGRAM), specificity);
  }
}
export class WhatsAppException extends SystemException {
  constructor(message: string, specificity: SpecificityError) {
    super(message, ErrorFactory.getFactory(NatureErrors.WHATSAPP), specificity);
  }
}
