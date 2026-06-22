---

description: "Task list for CI/CD Pipeline — EAS Update (OTA) + GitHub Actions + GitHub Releases"
---

# Tasks: CI/CD Pipeline

**Input**: Design from conversation specification

**Prerequisites**: Node.js project with Expo, EAS Build already configured (`eas.json` exists)

**Organization**: Tasks are grouped by infrastructure layer (CI setup, OTA, Release, Secrets).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile**: `.github/workflows/` at repository root (GitHub Actions configs)
- **Secrets**: GitHub repository Secrets (web interface)

---

## Phase 1: Setup — GitHub Token & Secrets

**Purpose**: Configure authentication so GitHub Actions can talk to Expo and create Releases.

- [ ] T001 Generate Expo API token via `eas token` CLI or https://expo.dev/settings/access-tokens
- [ ] T002 Add `EXPO_TOKEN` to GitHub repository Secrets (Settings → Secrets and variables → Actions)
- [ ] T003 Add `EXPO_PROJECT_ID` to GitHub repository Secrets (value from `app.json` → `expo.extra.eas.projectId`)

**Checkpoint**: GitHub repo has `EXPO_TOKEN` and `EXPO_PROJECT_ID` secrets configured.

---

## Phase 2: Foundational — CI Workflow (Quality Gate)

**Purpose**: Run TypeScript check + Jest on every push to ensure code quality before build.

- [x] T004 [P] Create CI workflow at `.github/workflows/ci.yml` that runs on push to any branch:
  - Checkout code
  - Setup Node (18.x)
  - Install dependencies with `npm ci`
  - Run `npx tsc --noEmit`
  - Run `npx jest --passWithNoTests`
  - (Fails fast — no build if quality fails)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx jest --passWithNoTests
```

**Checkpoint**: CI workflow runs on every push — red if TypeScript or tests fail.

---

## Phase 3: User Story 1 — EAS Update (OTA)

**Goal**: Every push to `main` automatically deploys JavaScript/UI updates to all existing app users (no APK reinstall needed).

**Independent Test**: Open the app on a phone that was installed from a previous APK → after push, close and reopen → new content appears in seconds.

- [x] T005 [US1] Create deploy workflow at `.github/workflows/deploy.yml` — EAS Update step:
  - Trigger: `push` to `main` only
  - After CI passes, run `npx eas update --branch main --message "$(git log -1 --pretty=%B)" --non-interactive`
  - Uses `EXPO_TOKEN` secret for authentication

- [ ] T006 [US1] Run EAS Update on current `main` branch to establish initial OTA baseline:
  - `npx eas update --branch main --message "Initial OTA baseline" --non-interactive`

**Checkpoint**: Pushing a change to main triggers EAS Update; app updates in seconds on-device.

---

## Phase 4: User Story 2 — EAS Build + GitHub Release (APK)

**Goal**: Every push to `main` also generates a new APK and uploads it to a persistent GitHub Release link.

**Independent Test**: Open `https://github.com/aurinaf/japaratinga-fm/releases/latest/download/app-release.apk` in mobile browser → downloads the latest APK.

- [x] T007 [US2] Add EAS Build step to the deploy workflow (parallel with EAS Update):
  - `npx eas build --platform android --profile preview --non-interactive --no-wait`
  - Captures build ID for download step

- [x] T008 [US2] Create GitHub Release step — downloads APK from EAS and uploads to Release:
  - After build completes, download APK via `eas build:download <build-id>`
  - Use `softprops/action-gh-release@v2` to create/update a Release named `stable`
  - Upload the APK file as `app-release.apk`

- [ ] T009 [US2] Test the full pipeline end-to-end:
  - Push a test commit to `main`
  - Verify CI passes → EAS Build starts → Release is created
  - Download APK from release link and install on device

**Checkpoint**: Every push produces a downloadable APK at a fixed URL.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T010 [P] Document the CI/CD pipeline in `quickstart.md` (update existing file at `specs/001-core-radio-player/quickstart.md`)
- [x] T011 Add badge to `README.md` showing CI build status
- [ ] T012 Verify GitHub Release link is publicly accessible (repo must be public or release set to public)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup — Secrets (Phase 1)**: No dependencies — configure via GitHub web UI
- **CI Workflow (Phase 2)**: Depends on Phase 1 (needs no secrets, but token may be useful later)
- **EAS Update — US1 (Phase 3)**: Depends on Phases 1 + 2 (needs EXPO_TOKEN)
- **EAS Build + Release — US2 (Phase 4)**: Depends on Phases 1 + 2 (needs EXPO_TOKEN)
  - US1 and US2 can run in **parallel** within the same workflow
  - Both kick off after CI passes
- **Polish (Phase 5)**: Depends on US1 + US2 being functional

### Parallel Opportunities

- T004 (CI workflow) can be created independently of T005-T009 (deploy workflow)
- T005 (EAS Update step) and T007 (EAS Build step) are in the same file but run as parallel jobs
- T010 (docs) and T011 (badge) can run in parallel

### Parallel Example: Deploy Workflow

```yaml
# Both jobs start after CI quality gate passes:
# Job 1 (EAS Update):
#   npx eas update --branch main --message "..."

# Job 2 (EAS Build + Release):
#   npx eas build --platform android --profile preview --non-interactive
#   eas build:download <id> --output app-release.apk
#   Create/update GitHub Release with APK attached
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Create Expo token + add secrets (requires GitHub UI)
2. Complete Phase 2: Create `ci.yml` — quality gate only
3. Complete Phase 3: Add EAS Update (`deploy.yml`) — existing users get OTA
4. **STOP and VALIDATE**: Push a change → see OTA work on phone
5. Complete Phase 4: Add EAS Build + Release — APK for new users
6. Final: Polish documentation

### Incremental Delivery

1. Phase 1 → Secrets configured
2. Phase 2 → CI gate active (red/green on push)
3. Phase 3 → OTA working (MVP — users get updates without reinstalling)
4. Phase 4 → Full pipeline (APK auto-generated at permanent link)
5. Phase 5 → Docs + badge

---

## Notes

- [P] tasks = different files, no dependencies
- GitHub Actions uses `ubuntu-latest` runners (included in free tier)
- EAS Build free tier: 30 builds/month
- GitHub Actions free tier: 2000 min/month
- No test tasks generated (not requested in spec)
