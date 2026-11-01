# Form Testing Progress

Updated: 2026-11-01

## Current status

Paused at the user's request. No deployment or push was performed. Valid registration submissions were not sent to Google Apps Script or a live spreadsheet. The latest browser submission attempt did not reach the mocked submit step because the browser automation could not select dependent location options; no code change was made based on that incomplete attempt.

## Completed checks

- Ran `npx.cmd tsc --noEmit`: passed with no TypeScript errors.
- Opened the local form in headless Chrome. Confirmed the form renders, India is initially selected with `+91`, and the form has required text fields, registration and fort type radios, a consent checkbox, country/state/city selectors, and a submit button. The form has no date picker or file input; it collects a Google Drive folder URL instead.
- Direct location API checks previously returned country data and dependent state/city data (including India, US, GB, AE, Maharashtra, and California).
- Direct registration API validation checks:
  - Malformed JSON: HTTP 400 with an invalid-request response.
  - Empty request: HTTP 422 with required-field errors.
  - Invalid short phone: HTTP 422 with the 9/10-digit validation error.
  - `9876543210` with an intentionally invalid email: HTTP 422 only for email, confirming the 10-digit phone passes the phone validation.
- Browser viewport checks at 1440, 820, and 390 px showed `documentElement.scrollWidth` did not exceed the viewport. A fixed/animated element's bounding box extended past the viewport, but it did not create document horizontal scrolling.
- Selecting United States in the browser ultimately updated the country, ISO code, and calling code to `United States`, `US`, and `+1`. An immediate read before React finished updating had stale values; the settled state was correct.

## Issues found and fixes

- **Previously identified phone-length validation bug:** the validator counted digits in the raw formatted phone string instead of the parsed national number, causing a valid 10-digit Indian number such as `7788778878` to show the 9/10-digit error. The validator now counts `parsedMobile.nationalNumber` when parsing succeeds. API validation confirmed a valid 10-digit phone proceeds to the next field validation.
- No new confirmed code defect was found in the incomplete browser submission attempt. Country/state/city end-to-end selection and a successful mocked submission remain unverified.

## Files modified / known form work

The following files are known to have been edited for the form work in this workspace. The Git executable is unavailable in the current shell, so a complete Git status/diff could not be collected during this pause:

- `src/components/sections/RegistrationSection.tsx`
- `src/components/sections/SocialMediaTaggingRule.tsx`
- `src/components/ui/AccordionList.tsx`
- `src/data/content.ts`
- `lib/registration-validation.js`
- `app/api/registration/route.js`
- `app/api/locations/route.js`
- `google-apps-script/Code.gs`
- `next.config.*` (location data tracing/configuration; exact config filename still needs confirmation)

No changes were made to `.env.local`.

## Last completed step

The latest step was attempting the browser's country â†’ state â†’ city flow and a valid mocked submission. Country selection worked after waiting for React state to settle. The automation then failed to select state/city options, so the location fields stayed blank and no successful submit was attempted. This browser run did not send any request to Google Apps Script.

## Pending work to resume

1. Read this file, inspect the current workspace and local dev server, and collect an exact file diff/status if Git is available.
2. Stabilize browser automation for the custom searchable state/city dropdowns; verify country-specific state/city options, resets on country/state changes, and manual-entry fallback behavior.
3. Test phone length and parsing for India and at least one 9-digit country, country calling-code mismatch, optional alternate phone, formatted input, and input-length boundaries.
4. Exercise UI required-field errors, radios, consent, URL/name/email edge cases, duplicate submission guard, loading/error/success states, and certificate response with local mocks only.
5. Recheck responsive form layout at desktop, tablet, and mobile widths, including overflow of the form itself.
6. Run the isolated Apps Script mock, relevant lint/build checks, and repeat affected validations after any fixes.
7. Report that real Google Sheets persistence and production certificate integration require a safe deployed test environment; do not use the live endpoint without explicit authorization.

## Test constraints

The project has no installed Playwright/Puppeteer test runner. Browser testing so far used Chrome DevTools Protocol manually. The local development server was already running at `http://localhost:3000`; do not stop or modify it without checking ownership. No actual valid registration was submitted.

## Resume update — 2026-11-01

- Confirmed the project-owned Next.js dev server is active on port 3000 (PID 1840); left it running. The initial homepage HTTP request timed out, but the local API responded.
- Local location API checks passed: India returned 36 states, Maharashtra returned 545 cities, US returned 60 states, and California returned 1,065 cities.
- Isolated registration API validation checks (all requests deliberately retained a missing participant name, so none could be accepted or forwarded to Google Apps Script) confirmed:
  - Indian 10-digit `7788778878` and formatted `+91 778-877-8878` pass phone validation.
  - French `+33612345678` passes the 9-digit national-number length and phone validation.
  - Indian 9-digit input is rejected as an invalid phone number.
  - A `+1` calling code paired with India is rejected.
  - Omitted optional alternate phone does not add an error.
- `npx.cmd tsc --noEmit` passed.
- Targeted ESLint on the registration component, validation module, and location/registration routes passed with 7 warnings and no errors. Warnings cover `<img>` use and effect dependencies in `RegistrationSection.tsx`.
- Full `npm.cmd run lint` remains failing on 6 errors outside the tested form paths: two `require()` lint errors in `.create-bilingual.cjs` and `.inventory.cjs`, plus `react-hooks/set-state-in-effect` in `LanguageProvider.tsx`. Existing warnings also remain.
- Browser interaction checks remain pending. Chrome remote debugging could not be reached at port 9333, so searchable dropdown selection/resets, manual entry, UI validation and submit states, responsive layout, and a successful locally mocked submission have not been verified. No code fix was warranted by the completed checks.
- Git status/diff remains unavailable because `git` is not installed in the shell. No live registration was sent and no deployment or push was performed.

## Remaining work

1. Restore reliable browser automation, then verify country/state/city selection, reset behavior, manual-entry fallback, form errors, duplicate guard, loading/error/success states, responsive widths, and mocked certificate response.
2. Exercise the Apps Script handler only with an isolated mock, not the live spreadsheet.
3. Re-run checks after any fixes and report integration limits for real Sheets persistence and production certificates.

## User-reported city submission issue — 2026-11-01

- Screenshot showed `Select a valid city.` for Mumbai, Maharashtra. Compared the dropdown API data to the registration route's `getCitiesOfState("IN", "MH")` validation data: both provide Mumbai with ID `133024` and name `Mumbai`.
- Fixed a stale-location request race in `RegistrationSection.tsx`: changing country now invalidates pending state/city requests; changing state invalidates pending city requests. Old responses can no longer repopulate selectable cities for the previous country/state.
- `npx.cmd tsc --noEmit` passed after the fix. Targeted ESLint passed with the same 7 existing warnings and no errors.
- The exact screenshot submission could not be reproduced in the browser (Chrome DevTools automation remains unavailable). The race is a confirmed failure path, but the captured city data itself matches; if the problem persists, inspect the submitted `countryIso`, `stateCode`, `cityId`, and `city` values from the browser request before further changes.

## Follow-up fix — city ID/name mismatch

- The earlier stale-request fix did not resolve the reported case. The registration API required both city ID and exact city name to match. Updated validation to accept a city when its normalized name appears in the selected state's/country's city list, even if the submitted city ID is absent or differs. This still rejects names not listed for that location.
- TypeScript passed after the API validation change. Targeted ESLint passed with 7 existing warnings and no errors.
- Browser replay remains unavailable, so the screenshot payload is not captured. If the user is submitting a deployed site, this local source change must be deployed before it can affect that site.
