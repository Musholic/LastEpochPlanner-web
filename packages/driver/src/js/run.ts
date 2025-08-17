import { type Game, gameData } from "pob-game/src";
import { Driver } from "./driver";

(async () => {
  const versionPrefix = `${__ASSET_PREFIX__}/games/${__RUN_GAME__}/versions/${__RUN_VERSION__}`;
  console.log("Loading driver with assets:", versionPrefix);

  const driver = new Driver(__RUN_BUILD__, versionPrefix, {
    onError: error => console.error(error),
    onFrame: (_at, _time, _stats) => {},
    onFetch: async (_url, _headers, _body) => {
      throw new Error("Fetch not implemented in shell");
    },
    onTitleChange: _title => {},
  });
  await driver.start();
  const window = document.querySelector("#window") as HTMLElement;
  if (window) {
    driver.attachToDOM(window);
  }
})();
