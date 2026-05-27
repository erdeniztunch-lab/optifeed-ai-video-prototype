# Refresh Recovery Plan

## 1. Problem

The OptiVideo flow keeps almost all progress in React component state inside `src/pages/Videos.tsx`. A browser refresh remounts the app, resets that state to defaults, and leaves deeper screens without the selected products, campaign context, template, generated jobs, approval state, or edit target they require.

The desired behavior is frontend-only recovery: after refresh, return the user to the same screen when enough browser-stored session data exists. The app must not claim backend persistence or refresh-safe storage beyond the current browser session.

## 2. Current Failure Points

- `stage` resets to `"select"` on refresh unless the URL has `?view=library`.
- `selectedIds` resets to `[]`, so template, confirm, generate-review, edit-prompt, export, and success can lose their product context.
- `campaignContext`, `activeFolderName`, and `activeFolderId` reset, so campaign naming and folder context are lost.
- `template` resets to `"product-spotlight"`, which can mismatch the user's chosen template.
- `videoJobs`, `approvedIds`, and `rejectedIds` reset, so generate-review and export lose review state.
- `editingProductId` resets, so edit-prompt can try to render without a valid product and break because it uses a non-null lookup.
- `exportedFeeds` resets, so success loses the export summary.
- `folders` and `folderSnapshots` reset to mock defaults, so newly created draft folders disappear after refresh.
- `showCampaignModal` and modal form internals are not restorable today.

## 3. Required State by Screen

| Screen | Minimum state required to restore safely | Notes |
| --- | --- | --- |
| library | `stage`, `folders`, `folderSnapshots`, `tokenBalance` | Can fallback to mock `FOLDERS` if no session exists. |
| product selection | `stage`, `selectedIds`, `tokenBalance`, optional `activeFolderName`, `activeFolderId` | Product list and filters can reset safely. |
| campaign setup modal | `stage: "select"`, `selectedIds`, optional draft campaign form fields | Safest v1 fallback is close modal and return to product selection. |
| template selection | `stage`, `selectedIds`, `campaignContext`, `activeFolderName`, `activeFolderId`, `template` | If campaign context is missing, fallback to product selection. |
| confirm | `stage`, `selectedIds`, `campaignContext`, `template`, `tokenBalance` | If products are missing, fallback to product selection. |
| generate-review | `stage`, `selectedIds`, `campaignContext`, `template`, `approvedIds`, `rejectedIds`, `tokenBalance`, optional `videoJobs` | Generated videos can be reconstructed as review-ready for selected products because the demo uses one static MP4. |
| edit-prompt | `stage`, `selectedIds`, `editingProductId`, `template`, `guidedPrompt`, `tokenBalance` | If `editingProductId` is invalid, fallback to generate-review when possible. |
| export | `stage`, `selectedIds`, `approvedIds`, `campaignContext`, `template`, `tokenBalance` | If `approvedIds` is empty, fallback to generate-review. |
| success | `stage`, `approvedIds`, `exportedFeeds`, `tokenBalance` | If no approved videos exist, fallback to library. |

## 4. Recommended Storage Strategy

Use `sessionStorage`, not `localStorage`, for flow recovery.

Reasons:
- The requirement is "same screen after refresh", not long-term persistence.
- Session storage avoids over-promising that work survives browser/session boundaries.
- It reduces stale demo data leaking into future demos.
- It fits the existing copy rule: no real persistence claims.

Recommended key:

```ts
const VIDEO_FLOW_SESSION_KEY = "optivideo_flow_session_v1";
```

Recommended saved shape:

```ts
type RecoverableVideoFlowState = {
  version: 1;
  savedAt: string;
  stage: Stage;
  selectedIds: string[];
  template: TemplateId;
  guidedPrompt: GuidedPrompt;
  campaignContext: CampaignContext;
  tokenBalance: number;
  videoJobs: VideoJob[];
  approvedIds: string[];
  rejectedIds: string[];
  exportedFeeds: string[];
  notifyOnComplete: boolean;
  activeFolderName: string;
  activeFolderId: string | null;
  folders: VideoFolder[];
  folderSnapshots: Record<string, FolderSnapshot>;
  editingProductId: string | null;
};
```

Do not store:
- `showCampaignModal`
- confirmation dialog open state
- preview modal open state
- transient loading/spinner state
- `isSending`
- generated timeout progress internals
- search/filter/view controls in product selection

## 5. Safe Restore Rules

- Restore once on initial `Videos` mount from `sessionStorage`.
- Persist state with a debounced or normal `useEffect` whenever recoverable state changes.
- Validate stored data before applying it:
  - `stage` must be one of the known stage values.
  - `selectedIds`, `approvedIds`, `rejectedIds`, and `editingProductId` must reference existing `PRODUCTS`.
  - `template` must match a known template id.
  - `tokenBalance` must be a finite number.
  - `folders` must be an array; otherwise use `FOLDERS`.
  - `folderSnapshots` must be an object; otherwise use `{}`.
- For `generate-review`, recreate displayable review cards from `selectedIds`, `approvedIds`, and `rejectedIds`. Because the demo video is static, it is acceptable to show recovered generated videos as ready for review in the current session.
- For `export`, restore only if at least one approved product is still valid.
- For `success`, restore only if there is at least one approved product or at least one exported feed.
- Clear the session key when the user intentionally starts a fresh flow via the existing reset path, after successful completion if the product decision requires it, or when stored state is invalid.

## 6. Fallback Rules

- Missing or invalid storage: start at current default behavior (`select`) unless URL has `?view=library`.
- `template` or `confirm` without selected products: fallback to `select`.
- `template` or `confirm` without campaign context name/sector: fallback to `select`.
- `generate-review` without selected products: fallback to `select`.
- `edit-prompt` with invalid `editingProductId`: fallback to `generate-review` if selected products exist, otherwise `select`.
- `export` with zero valid approved products: fallback to `generate-review` if selected products exist, otherwise `select`.
- `success` without approved products and without exported feeds: fallback to `library`.
- `view=library` URL should take precedence over stored non-library stage, because it is an explicit navigation request.
- If recovery fails during parsing, remove the session key and continue with safe default state.

## 7. Implementation Phases

### Phase R0 - Recovery Utilities

- Add small helpers near `Videos.tsx` or in a local utility module:
  - `isStage(value): value is Stage`
  - `sanitizeProductIds(ids)`
  - `loadVideoFlowSession()`
  - `saveVideoFlowSession(state)`
  - `clearVideoFlowSession()`
- Keep this frontend-only and dependency-free.
- No UI changes in this phase.

### Phase R1 - Save and Restore Core Flow State

- Initialize `Videos` state from the sanitized session payload.
- Persist core state: `stage`, `selectedIds`, `template`, `campaignContext`, `tokenBalance`, `approvedIds`, `rejectedIds`, `activeFolderName`, `activeFolderId`, `folders`, and `folderSnapshots`.
- Preserve `?view=library` precedence.
- Verify refresh recovery for `select`, `template`, `confirm`, `generate-review`, and `library`.

### Phase R2 - Restore Edge Screens

- Add safe restore for `edit-prompt`, `export`, and `success`.
- Validate `editingProductId` before rendering `EditPromptStep`.
- Restore `exportedFeeds` for success summary.
- Keep preview modal, exit dialog, campaign modal, and transient loading states reset.

### Phase R3 - Session Lifecycle and QA

- Clear or reset session storage through existing intentional reset paths:
  - new campaign start
  - completed campaign cleanup if desired
  - invalid recovery payload
- Add manual QA scenarios for refresh on every screen.
- Run build and lint after each phase.

## 8. Acceptance Criteria

- Refresh on product selection returns to product selection with selected products preserved.
- Refresh on template selection returns to template selection with products and campaign context preserved.
- Refresh on confirm returns to confirm with products, template, campaign context, and token balance preserved.
- Refresh on generate-review returns to generate-review with selected products and approval/rejection state preserved.
- Refresh on edit-prompt returns to edit-prompt only if the editing product is valid; otherwise it falls back safely.
- Refresh on export returns to export only when at least one approved product exists.
- Refresh on success returns to success only when summary state is valid; otherwise it falls back safely.
- Library remains reachable through `/videos?view=library` and explicit library navigation.
- No backend, API, database, authentication, or real persistence is added.
- No user-facing copy claims work survives beyond the browser session.
- Main happy path remains intact.
- `npm run build` passes.
- `npm run lint` introduces 0 new issues beyond the known baseline.
