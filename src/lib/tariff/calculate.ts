import type { TariffRate } from "@/types/tariff";

interface CalculateImportedCostsInput {
  invoiceCad: number;
  tariffRate: TariffRate;
  freightCad: number;
  surtaxCad?: number;
}

export function calculateImportedCosts({
  invoiceCad,
  tariffRate,
  freightCad,
  surtaxCad = 0,
}: CalculateImportedCostsInput) {
  const valueForDutyCad = invoiceCad;

  if (tariffRate.kind === "complex") {
    return {
      invoiceCad,
      valueForDutyCad,
      dutyCad: null,
      freightCad,
      surtaxCad,
      gstCad: null,
      totalImportedCad: null,
      calculable: false,
    };
  }

  const dutyCad = valueForDutyCad * ((tariffRate.percent ?? 0) / 100);
  const gstCad = (valueForDutyCad + dutyCad + surtaxCad) * 0.05;
  const totalImportedCad = valueForDutyCad + dutyCad + surtaxCad + freightCad + gstCad;

  return {
    invoiceCad,
    valueForDutyCad,
    dutyCad,
    freightCad,
    surtaxCad,
    gstCad,
    totalImportedCad,
    calculable: true,
  };
}
