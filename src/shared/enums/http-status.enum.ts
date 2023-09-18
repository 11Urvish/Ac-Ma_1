export enum HttpStatusEnum {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  REQUEST_FAILED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUEST = 429,
  INTERNAL_SERVER_ERROR = 500,
  CONFIGURATION_ERROR = 500.19
}

/**
* 200 - OK - Everything worked successfully.
* 400 - Bad Request   - The request was unacceptable, often due to missing a required parameter.
* 401 - Unauthorized  - No valid API key provided.
* 402 - Request Failed - The parameters were valid but the request failed.
* 404 - Not Found - The requested resource doesn’t exist
* 409 - Conflict  - The request has conflicts (perhaps due to using the same idempotent key).
* 429 - Too Many Requests - Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.
* 500, 502, 503, 504 - Server Errors
*/
