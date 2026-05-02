/* tslint:disable */
/* eslint-disable */

/**
 * Wraps the othello-rust Game for use from JavaScript via wasm-bindgen.
 */
export class OthelloGame {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns the board as a JSON string: [[Cell; 8]; 8]
     * Each cell is "Empty", "Black", or "White".
     */
    get_board(): string;
    /**
     * Returns "Black" or "White".
     */
    get_current_player(): string;
    /**
     * Returns "Playing" or "GameOver".
     */
    get_game_state(): string;
    /**
     * Returns the score as a JSON string: {black: N, white: N}
     */
    get_score(): string;
    /**
     * Returns valid moves for the current player as a JSON string: [{row, col}, ...]
     */
    get_valid_moves(): string;
    /**
     * Returns null (in progress), "Black", "White", or "Tie".
     */
    get_winner(): any;
    /**
     * Apply a human move. Returns an error string if the move is invalid.
     */
    make_move(row: number, col: number): void;
    /**
     * Create a new game in the initial position. Black moves first.
     */
    constructor();
    /**
     * Serialise the full game state to JSON for passing to Web Workers.
     */
    to_json(): string;
}

/**
 * Called by each Web Worker once per assigned root move.
 *
 * Deserialises the game state, evaluates the given root move to the
 * given depth using sequential minimax, and returns {score: f64}.
 *
 * The full recursive minimax search runs entirely in WASM.
 * `alpha` is the best score found so far across workers (cross-worker pruning).
 * Pass -Infinity when SharedArrayBuffer is unavailable.
 *
 * `depth` is an extension point for future difficulty selection.
 * Currently always called with AI_DEPTH = 6 from main.js.
 */
export function get_ai_move(game_json: string, depth: number, row: number, col: number, alpha: number): number;

export function init_panic_hook(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_othellogame_free: (a: number, b: number) => void;
    readonly get_ai_move: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly init_panic_hook: () => void;
    readonly othellogame_get_board: (a: number) => [number, number];
    readonly othellogame_get_current_player: (a: number) => [number, number];
    readonly othellogame_get_game_state: (a: number) => [number, number];
    readonly othellogame_get_score: (a: number) => [number, number];
    readonly othellogame_get_valid_moves: (a: number) => [number, number];
    readonly othellogame_get_winner: (a: number) => any;
    readonly othellogame_make_move: (a: number, b: number, c: number) => [number, number];
    readonly othellogame_new: () => number;
    readonly othellogame_to_json: (a: number) => [number, number];
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
