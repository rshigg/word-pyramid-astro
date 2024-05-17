import { Index, createSignal, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

export const letterData = {
  a: { weight: 1 },
  b: { weight: 3 },
  c: { weight: 3 },
  d: { weight: 2 },
  e: { weight: 1 },
  f: { weight: 4 },
  g: { weight: 2 },
  h: { weight: 4 },
  i: { weight: 1 },
  j: { weight: 8 },
  k: { weight: 5 },
  l: { weight: 1 },
  m: { weight: 3 },
  n: { weight: 1 },
  o: { weight: 1 },
  p: { weight: 3 },
  q: { weight: 10 },
  r: { weight: 1 },
  s: { weight: 1 },
  t: { weight: 1 },
  u: { weight: 1 },
  v: { weight: 4 },
  w: { weight: 4 },
  x: { weight: 8 },
  y: { weight: 4 },
  z: { weight: 10 },
};

const letters = Object.keys(letterData);
const ROWS = 5;
const INITIAL_SKIPS = 10;

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomLetter() {
  return letters[random(0, letters.length)];
}

type TileProps = {
  letter: string | null;
  onSetLetter: () => void;
};

function Tile(props: TileProps): JSX.Element {
  const hasLetter = () => props.letter !== null;

  return (
    <input
      type="checkbox"
      class="tile"
      checked={hasLetter()}
      data-letter={props.letter ?? ""}
      onChange={props.onSetLetter}
      disabled={hasLetter()}
    />
  );
}

const getInitialLetters = () =>
  Array.from({ length: ROWS }).map((_row, index) =>
    Array.from<string | null>({ length: index + 1 }).fill(null)
  );

function Game(): JSX.Element {
  const [grid, setGrid] = createStore(getInitialLetters());
  const [currentLetter, setCurrentLetter] = createSignal(getRandomLetter());
  const [skips, setSkips] = createSignal(INITIAL_SKIPS);

  const handleTileSelect = (rowIndex: number, colIndex: number) => {
    const letter = () => grid[rowIndex][colIndex];
    if (!letter()) {
      setGrid(rowIndex, colIndex, currentLetter());
      setCurrentLetter(getRandomLetter());
    }
  };

  const handleReset = () => {
    setGrid(getInitialLetters());
    setSkips(INITIAL_SKIPS);
    setCurrentLetter(getRandomLetter());
  };

  const handleNextLetter = () => {
    if (skips() > 0) {
      setCurrentLetter(getRandomLetter());
      setSkips((currentSkips) => currentSkips - 1);
    }
  };

  return (
    <>
      <div class="grid">
        <Index each={grid}>
          {(row, rowIndex) => (
            <div class="row">
              <Index each={row()}>
                {(letter, colIndex) => (
                  <Tile
                    letter={letter()}
                    onSetLetter={() => handleTileSelect(rowIndex, colIndex)}
                  />
                )}
              </Index>
            </div>
          )}
        </Index>
      </div>
      <div class="controls">
        <button class="tile" onClick={handleReset}>
          <svg
            aria-label="Reset"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
          >
            <path d="M48 224H16V192 64 32H80V64v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0l45.3-45.3c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160H176h32v64H176 48z" />
          </svg>
        </button>
        <div class="current-letter">
          <div class="tile" data-letter={currentLetter()} />
          {String(skips()).padStart(2, "0")}/{INITIAL_SKIPS}
        </div>
        <button class="tile" onClick={handleNextLetter} disabled={skips() <= 0}>
          <svg
            aria-label="Next letter"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M448 96l0-32-64 0 0 32 0 320 0 32 64 0 0-32 0-320zM310.6 278.6L333.3 256l-22.6-22.6-128-128L160 82.7 114.7 128l22.6 22.6L210.7 224 32 224 0 224l0 64 32 0 178.7 0-73.4 73.4L114.7 384 160 429.3l22.6-22.6 128-128z" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default Game;
