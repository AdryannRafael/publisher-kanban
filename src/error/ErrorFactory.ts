import { NatureErrors } from "./core";
import { SpecificityError } from "./specificity";
import { SystemError } from "./SystemError";

export class ErrorFactory {
  private static map: Map<NatureErrors, ErrorFactory> = new Map()
    .set(NatureErrors.API_REQUEST, new ErrorFactory(NatureErrors.API_REQUEST))
    .set(NatureErrors.DOMAIN, new ErrorFactory(NatureErrors.DOMAIN))
    .set(NatureErrors.NEGOTIATE, new ErrorFactory(NatureErrors.NEGOTIATE))
    .set(NatureErrors.TELEGRAM, new ErrorFactory(NatureErrors.TELEGRAM))
    .set(NatureErrors.INTERNAL, new ErrorFactory(NatureErrors.INTERNAL))
    .set(NatureErrors.WHATSAPP, new ErrorFactory(NatureErrors.WHATSAPP))
    .set(NatureErrors.DATABASE, new ErrorFactory(NatureErrors.DATABASE));

  constructor(private readonly nature: NatureErrors) {}

  public create(specificity: SpecificityError): SystemError {
    return new SystemError(this.nature, specificity);
  }

  public static getFactory(nature: NatureErrors): ErrorFactory {
    const factory = this.map.get(nature);
    if (!factory) {
      throw new Error("ErrorFactory not found for nature: " + nature);
    }
    return factory;
  }
}

function invokeCategoryErrorByCode(code: string) {}
