/**
 * Feature flags — the control panel for the whole project.
 *
 * Design rule: with EVERY flag off, the pipeline is plain Naive RAG.
 * That default IS your Phase 3 control/baseline. Each advanced pattern
 * is layered on by flipping a flag, so the LLM-judge (Phase 4) can
 * measure the delta of each one independently.
 *
 * Flags load from env as project-wide defaults, but every request can
 * override them (the UI flag board + "naive vs advanced" comparison in
 * Phase 4 send per-request overrides).
 */

export interface FeatureFlags {
  // Phase 5 — query translation
  queryTranslation: boolean; // master switch for the translate node
  multiQuery: boolean;
  stepBack: boolean;
  decomposition: boolean;
  rewrite: boolean;
  hyde: boolean;

  // Phase 6 — routing + adapters
  routing: boolean; // logical + semantic routing node
  sqlAdapter: boolean; // allow routing to the structured SQL source

  // Phase 7 — retrieval quality
  hybridSearch: boolean; // dense + full-text
  rrf: boolean; // reciprocal rank fusion re-rank

  // Phase 8 — corrective RAG
  crag: boolean; // grader -> gap keywords -> retry loop
  webSearchFallback: boolean; // CRAG fallback when corpus can't answer

  // Phase 9 — guardrails
  guardrailsInput: boolean; // PII mask + local-substitution + policy
  guardrailsOutput: boolean; // leak / hallucination / toxicity

  // Phase 10 — performance
  semanticCache: boolean;
  twoTierFastPath: boolean;
}

/** All-off = Naive RAG. Do not change this baseline. */
export const NAIVE_BASELINE: FeatureFlags = {
  queryTranslation: false,
  multiQuery: false,
  stepBack: false,
  decomposition: false,
  rewrite: false,
  hyde: false,
  routing: false,
  sqlAdapter: false,
  hybridSearch: false,
  rrf: false,
  crag: false,
  webSearchFallback: false,
  guardrailsInput: false,
  guardrailsOutput: false,
  semanticCache: false,
  twoTierFastPath: false,
};

const asBool = (v: string | undefined, fallback = false): boolean =>
  v === undefined
    ? fallback
    : ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());

/** Project-wide defaults read from ENABLE_* env vars (see .env.example). */
export function loadDefaultFlags(
  env: NodeJS.ProcessEnv = process.env,
): FeatureFlags {
  return {
    queryTranslation: asBool(env.ENABLE_QUERY_TRANSLATION),
    multiQuery: asBool(env.ENABLE_MULTI_QUERY),
    stepBack: asBool(env.ENABLE_STEP_BACK),
    decomposition: asBool(env.ENABLE_DECOMPOSITION),
    rewrite: asBool(env.ENABLE_REWRITE),
    hyde: asBool(env.ENABLE_HYDE),
    routing: asBool(env.ENABLE_ROUTING),
    sqlAdapter: asBool(env.ENABLE_SQL_ADAPTER),
    hybridSearch: asBool(env.ENABLE_HYBRID_SEARCH),
    rrf: asBool(env.ENABLE_RRF),
    crag: asBool(env.ENABLE_CRAG),
    webSearchFallback: asBool(env.ENABLE_WEB_SEARCH_FALLBACK),
    guardrailsInput: asBool(env.ENABLE_GUARDRAILS_INPUT),
    guardrailsOutput: asBool(env.ENABLE_GUARDRAILS_OUTPUT),
    semanticCache: asBool(env.ENABLE_SEMANTIC_CACHE),
    twoTierFastPath: asBool(env.ENABLE_TWO_TIER_FASTPATH),
  };
}

/** Merge per-request overrides on top of the project defaults. */
export function resolveFlags(
  overrides: Partial<FeatureFlags> = {},
): FeatureFlags {
  return { ...loadDefaultFlags(), ...overrides };
}
