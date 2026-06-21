# Product Knowledge Document

## 1. Goal

Optifeed AI Video is a bilingual frontend prototype that helps e-commerce catalog managers select products, simulate short product-video generation, review results, and simulate sending approved videos to catalog channels.

## 2. Core Questions

| User question | Product answer |
| --- | --- |
| Which catalog products need videos? | Search, status, history, brand, category, and image-readiness controls |
| What will generation cost? | Estimated token cost and time before production |
| Which scenario should I use? | Generic or textile-specific template selection |
| Which videos are acceptable? | Per-product preview, approval, rejection, and prompt-edit controls |
| Where should approved videos go? | Meta, Google, TikTok, draft, or demo ZIP paths |
| Can I resume after refreshing? | Session-scoped flow recovery with validation and safe fallback |

## 3. Product Definition

The product is a React and TypeScript click-through prototype inside the wider Optifeed interface. Its active experience is the `/videos` flow, supported by a mock campaign library, a 30-product static catalog, eight templates, token estimates, simulated video generation, browser-session recovery, and simulated channel export.

It is not a production video-generation platform. There is no backend, authentication, database, API route, feed synchronization, AI model, payment flow, real channel integration, or real ZIP download. Every generated product receives the same sample MP4, and all catalog, folder, token, and channel data is local mock data.

The interface supports English and Turkish. Language selection is stored by i18next in `localStorage`; English is the fallback language.

## 4. Current Problem -> Target Experience

| Current input/problem represented in code | Experience provided by the prototype |
| --- | --- |
| Products have static images and `no-video` status | User selects up to 10 products for video creation |
| Campaign intent is undefined | User supplies campaign name, sector, theme, and product type |
| Scenario choice is unclear | User chooses from four generic or four textile scenes |
| Cost is unknown | UI shows `selected products x 8 tokens` and `x 2 minutes` |
| Generated outputs require human control | Each result can be previewed, approved, rejected, or edited |
| Approved assets need a destination | User selects connected channels or follows draft/demo ZIP paths |
| An interrupted tab loses React memory | Valid state is restored from `sessionStorage` |

## 5. End-to-End Product Workflow

```text
"/" --redirect--> "/videos"
                       |
                       v
              [Select Products]
              search/filter/sort
              select 1..10 products
                       |
                       v
             [Campaign Setup Modal]
           name + required sector
             theme/product type
                       |
          sector == "tekstil"?
              /                 \
            yes                 no
             v                   v
   [Textile Scene Picker] [Generic Template Picker]
             \                   /
              v                 v
                [Confirm Production]
           balance, cost, notification option
                         |
                         v
               [Generate + Review]
       simulated sequential generation every 1200 ms
       preview / approve / reject / edit prompt
                    |              |
                    |              v
                    |       [Edit Prompt]
                    |       regenerate for 8 tokens
                    |              |
                    +<-------------+
                         |
              approved count >= 1
                         |
                         v
                      [Export]
       connected channel / draft skip / demo ZIP
                         |
                         v
                      [Success]
                summary -> library
```

`/videos?view=library` opens the campaign library directly.

## 6. Key Decision Logic

```text
PRODUCT SELECTION
selected count == 0 ----------------------> Continue disabled
estimated cost > token balance ----------> Continue disabled
selected count == 10 ---------------------> Unselected cards disabled
otherwise --------------------------------> Campaign setup enabled

TEMPLATE ROUTING
campaignContext.sector == "tekstil" ------> Textile templates
otherwise --------------------------------> Generic templates

CONFIRMATION
tokenBalance < products x 8 --------------> "Start Production" disabled
otherwise --------------------------------> Deduct products x 8 and generate

REVIEW
approvedIds contains product -------------> Approved
else rejectedIds contains product --------> Rejected
else local generation finished -----------> Pending review
else -------------------------------------> Generating

EXPORT
approvedIds.length == 0 ------------------> Export unavailable
selected connected channel exists --------> "Send" enabled
no connected selection -------------------> "Send" disabled
"Skip" -----------------------------------> Success as draft
ZIP click --------------------------------> Demo toast only

REFRESH RECOVERY
invalid storage/version/stage ------------> Remove stored state
no selected products for deep stage ------> "select"
invalid edit target ----------------------> "generate-review"
export with no approvals -----------------> "generate-review"
empty success state ----------------------> "library"
```

## 7. Data Model

### Catalog and campaign

```text
Product
  id, name, brand, image
  status, tags
  productId, itemGroupId, category
  additionalImageCount, videoHistory

VideoHistoryEntry
  campaignId, campaignName, date, templateId

CampaignContext
  name, sector, theme, themeCustom
  productType, templateNote
```

`Product` is the catalog record used for selection and display. `VideoHistoryEntry` records prior-generation metadata. `CampaignContext` carries the setup choices into template selection and confirmation.

### Templates and generation

```text
TemplateDefinition
  id, previewImage, templateNote, recommendedSectors

TextileTemplateDefinition
  id, previewVideo, recommendedSectors

GuidedPrompt
  sector, theme, themeCustom, background, productType

VideoJob
  productId, status, videoUrl
```

The template records select visual assets and recommendation sectors. `GuidedPrompt` supplies edit-screen defaults. `VideoJob` is the controller-level generation record.

### Library, export, and recovery

```text
VideoFolder
  id, name, createdAt, updatedAt
  videoCount, status, productIds?

Channel
  id, name, platform, description
  isConnected, accountName

AdvFilters
  imageReadiness, statusFilter, hasHistory
  category, brand, sortBy

RecoverableVideoFlowState
  version, savedAt, stage, folders, selectedIds
  template, guidedPrompt, tokenBalance, videoJobs
  approvedIds, rejectedIds, editingProductId
  exportedFeeds, campaignContext, folderSnapshots
```

The mock catalog contains 30 products: 27 `no-video`, 3 `ready`, 4 history entries, and 5 products with no additional images.

## 8. State Management

```text
Videos.tsx
  |
  +-- owns stage, folders, selectedIds, template, guidedPrompt
  +-- owns tokenBalance, videoJobs, approvedIds, rejectedIds
  +-- owns campaign context, edit target, export result
  +-- writes every controller change to:
      sessionStorage["optivideo_flow_session_v1"]
  |
  +-- passes state and callbacks into the active stage component
        |
        +-- stage components own temporary UI state
            filters, dialogs, local generation timers,
            prompt text, channel selection, loading states
```

Additional browser storage:

| Key | Storage | Purpose |
| --- | --- | --- |
| `optivideo_flow_session_v1` | `sessionStorage` | Flow and library recovery within the tab session |
| `i18nextLng` | `localStorage` | Selected language |
| `has_seen_video_intro` | `localStorage` | Dismissed onboarding banner |
| `has_completed_first_campaign` | `localStorage` | First-success message |

Approve and reject are mutually exclusive. Regeneration deducts 8 tokens, clears that product's approval/rejection, and returns to review.

## 9. Scoring or Classification Logic

There is no weighted score or machine-learning classification.

| Classification/ranking | Criterion | Weight |
| --- | --- | --- |
| Image readiness | `additionalImageCount > 0` or `=== 0` | Binary |
| "Best for video" sort | Higher `additionalImageCount` first | Raw count only |
| "No video yet" sort | Empty `videoHistory` first | Binary |
| Product status | Exact `no-video` or `ready` value | Binary |
| Template recommendation | `recommendedSectors.includes(campaignContext.sector)` | Binary |
| Folder tabs | Exact folder status | Binary |
| Folder sorting | Date string or locale name comparison | No weighting |

## 10. Invalid / Weak Signals

| Signal | Current treatment |
| --- | --- |
| Product `tags` | Stored but unused by active filters, recommendations, and generation |
| Theme and product type | Displayed as context but ignored by template recommendation |
| Product name, image, category, and brand | Do not alter generated media |
| Template note | Stored in campaign context but not consumed by generation |
| Edit sector/theme/background | Local UI state; regeneration callback receives only free text |
| Edit free text | Passed upward, then ignored as `_promptText` |
| "Best for video" | Uses only additional-image count |
| "No video yet" | Uses history length, not product `status` |
| "Most recent" product sort | Preserves static array order; no product date field exists |
| `videoJobs` | Persisted by the controller but not consumed by `GenerateReviewStep` |
| `FeedExport` data | Present for inactive legacy components; active export uses `CHANNELS` |

## 11. Output / Export

| Output | Actual behavior |
| --- | --- |
| Generated video | Same remote sample MP4 for every product |
| Approved set | Product IDs held in React/session state |
| Meta Catalog | Connected mock destination; 1500 ms simulated send |
| Google Merchant Center | Connected mock destination; 1500 ms simulated send |
| TikTok Catalog | Disconnected; "Connect" produces a coming-soon toast |
| ZIP | `"Download simulated in demo mode."` / `"Demo modunda indirme simüle edildi."`; no file |
| Draft skip | Completes with no exported channel names |
| Success summary | Approved video count, channel label, and `approved count x 8` token display |

## 12. V1 Scope

### In Scope

- Static catalog browsing and selection
- Campaign naming and taxonomy
- Generic and textile template selection
- Token estimates and local deductions
- Simulated progressive generation
- Preview, approve, reject, and edit UI
- Mock library management
- Simulated channel sending and ZIP
- EN/TR interface and language persistence
- Session refresh recovery
- Desktop experience

### Out of Scope

- Real feed import or synchronization
- Authentication and accounts
- Real AI or video rendering
- Billing, plans, or token purchase
- Backend jobs or queues
- Durable server persistence
- Real campaign storage
- Platform APIs or downloaded files
- Full localization of catalog content
- Cross-device or cross-tab recovery
- Viewports below 1280 px

## 13. Open Questions

1. Recovery validates only the four generic template IDs; textile IDs fall back to `product-spotlight`.
2. `folderSnapshots` can be read and deleted but is never populated by an active action.
3. The exit dialog says progress will be lost, but confirming only changes stage and retains campaign state.
4. Both success CTAs ultimately navigate to the library.
5. Opening a static folder does not load its `productIds` into selection unless a snapshot exists.
6. The "New Video" sidebar link does not explicitly reset a deeper `/videos` stage when the URL is already `/videos`.
7. Dynamic Creative and other suite routes are placeholder pages rather than working modules.
8. `FlowStage` differs from the local `Stage` union and is not the active controller type.
9. React Query is initialized but has no queries or mutations.
10. Dark-theme tokens exist, but no active theme control is present.

## 14. Known Limitations

| Limitation | Effect |
| --- | --- |
| No backend or API calls | All changes exist only in browser memory/storage |
| One sample MP4 | Template and prompt choices do not change output |
| Local review records are timer-driven | Refresh can restart unfinished generation |
| Token success summary uses approved count | It can differ from tokens actually charged for selected products and edits |
| Session storage only | Closing the tab ends flow recovery |
| Static folder counts | Library `videoCount` is not updated after generation/export |
| Folder snapshots have no writer | Resume behavior is largely unreachable through normal interaction |
| Browser Notification dependency | Completion notification works only with granted browser permission |
| Minimum width blocker | The product is intentionally unusable below 1280 px |
| Sparse automated tests | The only test asserts `true === true`; workflows are untested |
| Legacy components remain | Several unused earlier flow implementations and data models still compile in the repository |
| Mixed catalog content language | Product names, categories, and seeded campaign names are not locale-translated |

## 15. Success Criteria

| Area | Observable success condition |
| --- | --- |
| Entry | `/` redirects to `/videos`; `/videos?view=library` opens the library |
| Selection | Search/filter/sort work and selection never exceeds 10 |
| Cost safety | Continue/start/regenerate controls respect token balance |
| Branching | `"Moda & Giyim"` / `"Fashion & Apparel"` sector value `tekstil` opens textile scenes |
| Generation | Each selected product moves from generating to reviewable |
| Review | Approval/rejection remain mutually exclusive; preview and undo work |
| Export gating | Export requires one approval; send requires a connected selected channel |
| Honest output | ZIP and channel actions remain clearly simulated |
| Recovery | Valid refresh state restores safely; invalid state falls back without crashing |
| Localization | EN/TR switching updates active UI and persists after refresh |
| Completion | Success count equals approved videos and the user can return to the library |
| Technical health | Production build succeeds and no new lint issues are introduced |
