import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorRoute() {
  const error = useRouteError();

  const detail = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
    ? error.message
    : "Unknown error";

  return (
    <div
      id="error-page"
      className="mx-auto max-w-md px-6 py-24 text-center"
    >
      <p className="text-sm font-semibold text-traffic-red">// error</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-100">
        Oops! Something threw.
      </h1>
      <p className="mt-3 font-sans text-base-300">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="mt-4 text-sm text-base-400">
        <i>{detail}</i>
      </p>
    </div>
  );
}
