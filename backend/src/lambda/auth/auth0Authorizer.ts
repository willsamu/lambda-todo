import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify, decode } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";
// import Axios from "axios";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";
import { JwtToken } from "../../models/JwtToken";

const logger = createLogger("auth");

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = "https://lambda-todo.eu.auth0.com/.well-known/jwks.json";
let certificate = `-----BEGIN CERTIFICATE-----
MIIDCzCCAfOgAwIBAgIJZ2gH1TllW1WcMA0GCSqGSIb3DQEBCwUAMCMxITAfBgNV
BAMTGGxhbWJkYS10b2RvLmV1LmF1dGgwLmNvbTAeFw0yMDA2MDUxNDA2MzFaFw0z
NDAyMTIxNDA2MzFaMCMxITAfBgNVBAMTGGxhbWJkYS10b2RvLmV1LmF1dGgwLmNv
bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ2fwjFBms4yPPzDV+aV
sioUG9tn9EN7P1DrXRkKhUAIKC3OwDwETL0WFfGqQMGAHs7lVvR8WeK8Xj0LD1g1
py1CbRSawoxFY/F1qplPWzFEUBS9P9tTNXQPQCEnkEsNH37/MtE94zybYvhLYjLh
SPfRWwf3bhDt4uwcXGe6Q8q7AKLBZj+4PIXdh0GGqiATHN0lirje5DJnpyazoTxg
5r336tGWxZUdjKa7ty2m/sKslpgfQ+cA+3yUdToeHS8Fmxjt3qa2HTIiI3oJLM3c
3pSWXJ+NYbHly9om/tfScLrGu9Y1a8gYse2jCaM3F/oQunErhdSrKB3kE9nduSDV
nq0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUHS7iAEOUgJ5M
XdZjCFQXEwL7/bEwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAF
BNdzhZDdwh9eyp394MgAHjXkBpHsbdznRCIP40G6o/P7gdsTTcKdXRmtKsRkSyG2
mdnBiy5kOUYCt698JI3VO7XfDwFxnvs1Ae7hmy85sDU7JU9kFoH12BjC11jY0Op5
EitfpYmbBbcotJLrOL1/AZ9/jM3mEViNrfpgyoNGdzZaEYpi77zA6wdpCJnkm8BB
jCXTQ3kQD1+fRmSgMFWM8vBI7nDszqbrNHSbKWCx/jfkZHrKv1jiw/GMz+rVVsc5
YDtwgcr06bCVqMAYavb10sY1eqjvD9MCRC1S43AMAhZU7fonvgZ/TXG4NGHDdJHI
Iv4mXo0TS9Y/j6JXMh39
-----END CERTIFICATE-----`;

export const handler = async (
  event: CustomAuthorizerEvent,
): Promise<CustomAuthorizerResult> => {
  logger.info("Authorizing a user", event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const tokenHeader = getToken(authHeader);
  const jwt: Jwt = decode(tokenHeader, { complete: true }) as Jwt;

  //   if (!certificate) {
  //     const publicData = JSON.parse(JSON.stringify(await Axios.get(jwksUrl)));
  //     certificate = publicData.keys[0].x5c;
  //     console.log(
  //       `Public Key: ${certificate} || Data: ${JSON.stringify(
  //         publicData,
  //         null,
  //         2,
  //       )}`,
  //     );
  //   }

  if (jwt.header.alg !== "RS256")
    throw new Error(`Invalid algorithm! (${jwt.header.alg})`);

  logger.info("About to validate Token");

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(tokenHeader, certificate, {
    algorithms: ["RS256"],
  }) as JwtToken;
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}

export function getUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtToken;
  return decodedJwt.sub;
}
