interface FedExParcelQuoteInput {
  originCountry: string;
  originPostalCode: string;
  destinationCountry: string;
  destinationPostalCode: string;
  parcelWeightKg: number;
  parcelLengthCm?: number;
  parcelWidthCm?: number;
  parcelHeightCm?: number;
}

interface FedExTokenResponse {
  access_token?: string;
}

interface FedExRateReply {
  output?: {
    rateReplyDetails?: Array<{
      serviceName?: string;
      ratedShipmentDetails?: Array<{
        totalNetCharge?: {
          amount?: number | string;
          currency?: string;
        };
        shipmentRateDetail?: {
          totalNetCharge?: {
            amount?: number | string;
            currency?: string;
          };
        };
      }>;
    }>;
  };
}

function getFedExConfig() {
  return {
    clientId: process.env.FEDEX_CLIENT_ID,
    clientSecret: process.env.FEDEX_CLIENT_SECRET,
    accountNumber: process.env.FEDEX_ACCOUNT_NUMBER,
    authUrl: process.env.FEDEX_AUTH_URL || "https://apis.fedex.com/oauth/token",
    rateUrl: process.env.FEDEX_RATE_URL || "https://apis.fedex.com/rate/v1/rates/quotes",
  };
}

export function canQuoteFedExParcel() {
  const config = getFedExConfig();
  return Boolean(config.clientId && config.clientSecret && config.accountNumber);
}

export function getFedExConfigStatus() {
  const config = getFedExConfig();
  return {
    configured: Boolean(config.clientId && config.clientSecret && config.accountNumber),
    authUrl: config.authUrl,
    rateUrl: config.rateUrl,
    hasClientId: Boolean(config.clientId),
    hasClientSecret: Boolean(config.clientSecret),
    hasAccountNumber: Boolean(config.accountNumber),
    missing: [
      !config.clientId ? "FEDEX_CLIENT_ID" : null,
      !config.clientSecret ? "FEDEX_CLIENT_SECRET" : null,
      !config.accountNumber ? "FEDEX_ACCOUNT_NUMBER" : null,
    ].filter((entry): entry is string => entry !== null),
  };
}

export function isFedExQuoteTestEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.FEDEX_QUOTE_TEST_ENABLED === "true";
}

export async function getFedExAccessToken() {
  const config = getFedExConfig();
  if (!config.clientId || !config.clientSecret) {
    throw new Error("Missing FedEx API credentials.");
  }

  const response = await fetch(config.authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`FedEx auth failed: ${response.status}`);
  }

  const payload = (await response.json()) as FedExTokenResponse;
  if (!payload.access_token) {
    throw new Error("FedEx auth response did not include an access token.");
  }

  return payload.access_token;
}

export async function probeFedExAuth() {
  const token = await getFedExAccessToken();
  return {
    ok: true as const,
    tokenReceived: Boolean(token),
  };
}

function parseChargeAmount(reply: FedExRateReply) {
  const details = reply.output?.rateReplyDetails ?? [];
  const amounts = details
    .map((detail) => {
      const rated = detail.ratedShipmentDetails?.[0];
      const primary = rated?.totalNetCharge;
      const secondary = rated?.shipmentRateDetail?.totalNetCharge;
      const amount = Number(primary?.amount ?? secondary?.amount);
      if (!Number.isFinite(amount)) return null;
      return {
        serviceName: detail.serviceName ?? "FedEx parcel quote",
        amount,
      };
    })
    .filter((value): value is { serviceName: string; amount: number } => value !== null)
    .sort((a, b) => a.amount - b.amount);

  return amounts[0] ?? null;
}

export async function quoteFedExParcel(input: FedExParcelQuoteInput) {
  const config = getFedExConfig();
  if (!config.accountNumber) {
    throw new Error("Missing FedEx account number.");
  }

  const accessToken = await getFedExAccessToken();

  const payload = {
    accountNumber: {
      value: config.accountNumber,
    },
    requestedShipment: {
      pickupType: "USE_SCHEDULED_PICKUP",
      rateRequestType: ["ACCOUNT"],
      packagingType: "YOUR_PACKAGING",
      shipper: {
        address: {
          countryCode: input.originCountry,
          postalCode: input.originPostalCode,
        },
      },
      recipient: {
        address: {
          countryCode: input.destinationCountry,
          postalCode: input.destinationPostalCode,
        },
      },
      requestedPackageLineItems: [
        {
          weight: {
            units: "KG",
            value: input.parcelWeightKg,
          },
          ...(input.parcelLengthCm && input.parcelWidthCm && input.parcelHeightCm
            ? {
                dimensions: {
                  units: "CM",
                  length: input.parcelLengthCm,
                  width: input.parcelWidthCm,
                  height: input.parcelHeightCm,
                },
              }
            : {}),
        },
      ],
    },
  };

  const response = await fetch(config.rateUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-locale": "en_CA",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`FedEx rate quote failed: ${response.status}`);
  }

  const reply = (await response.json()) as FedExRateReply;
  const best = parseChargeAmount(reply);
  if (!best) {
    throw new Error("FedEx rate response did not include a parsable quote.");
  }

  return {
    amountCad: best.amount,
    serviceName: best.serviceName,
  };
}
