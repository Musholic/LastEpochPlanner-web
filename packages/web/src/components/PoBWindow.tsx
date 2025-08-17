import { Driver } from "pob-driver/src/js/driver";
import type { RenderStats } from "pob-driver/src/js/renderer";
import { type Game, gameData } from "pob-game/src";
import { useEffect, useRef, useState } from "react";
import * as use from "react-use";
import { log, tag } from "../lib/logger";
import ErrorDialog from "./ErrorDialog";

const { useHash } = use;

export default function PoBWindow(props: {
  game: Game;
  version: string;
  onFrame: (at: number, time: number, stats?: RenderStats) => void;
  onTitleChange: (title: string) => void;
  onLayerVisibilityCallbackReady?: (callback: (layer: number, sublayer: number, visible: boolean) => void) => void;
  toolbarComponent?: React.ComponentType<{ position: "top" | "bottom" | "left" | "right"; isLandscape: boolean }>;
  onDriverReady?: (driver: Driver) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const driverRef = useRef<Driver | null>(null);
  const onFrameRef = useRef(props.onFrame);
  const onTitleChangeRef = useRef(props.onTitleChange);
  const onLayerVisibilityCallbackReadyRef = useRef(props.onLayerVisibilityCallbackReady);

  onFrameRef.current = props.onFrame;
  onTitleChangeRef.current = props.onTitleChange;
  onLayerVisibilityCallbackReadyRef.current = props.onLayerVisibilityCallbackReady;

  const [hash, _setHash] = useHash();
  const [buildCode, setBuildCode] = useState("");
  useEffect(() => {
    if (hash.startsWith("#build=")) {
      const code = hash.slice("#build=".length);
      setBuildCode(code);
    } else if (hash.startsWith("#=")) {
      const code = hash.slice("#=".length);
      setBuildCode(code);
    }
  }, [hash]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [showErrorDialog, setShowErrorDialog] = useState(true);

  useEffect(() => {
    if (driverRef.current && props.toolbarComponent) {
      driverRef.current.setExternalToolbarComponent(props.toolbarComponent);
    }
  }, [props.toolbarComponent]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: toolbarComponent is handled separately
  useEffect(() => {
    const assetPrefix = `${__ASSET_PREFIX__}/games/${props.game}/versions/${props.version}`;
    log.debug(tag.pob, "loading assets from", assetPrefix);

    const _driver = new Driver("release", assetPrefix, {
      onError: error => {
        setError(error);
        setShowErrorDialog(true);
      },
      onFrame: (at, time, stats) => onFrameRef.current(at, time, stats),
      onFetch: async (url, headers, body) => {
        try {
          const r = await fetch(url, {
            method: body ? "POST" : "GET",
            body,
            headers,
          });
          if (r.ok) {
            let rep = {
              body: await r.text(),
              headers: Object.fromEntries(r.headers.entries()),
              status: r.status,
              error: undefined
            };
            log.debug(tag.pob, "CORS fetch success", url, rep);
            return rep;
          }
        } catch (e) {
          log.warn(tag.pob, "CORS fetch error", e);
        }

        return {
          body: "",
          headers: {} as Record<string, string>,
          status: 404,
          error: "Not Found"
        };
      },
      onTitleChange: title => onTitleChangeRef.current(title),
    });

    driverRef.current = _driver;

    (async () => {
      try {
        await _driver.start();
        log.debug(tag.pob, "started", container.current);
        if (buildCode) {
          log.info(tag.pob, "loading build from ", buildCode);
          await _driver.loadBuildFromCode(buildCode);
        }
        if (container.current) _driver.attachToDOM(container.current);

        if (props.toolbarComponent) {
          _driver.setExternalToolbarComponent(props.toolbarComponent);
        }

        onLayerVisibilityCallbackReadyRef.current?.((layer: number, sublayer: number, visible: boolean) => {
          _driver.setLayerVisible(layer, sublayer, visible);
        });

        props.onDriverReady?.(_driver);

        setLoading(false);
      } catch (e) {
        setError(e);
        setShowErrorDialog(true);
        setLoading(false);
      }
    })();

    return () => {
      _driver.detachFromDOM();
      _driver.destory();
      driverRef.current = null;
      setLoading(true);
    };
  }, [props.game, props.version, token, buildCode]);

  if (error) {
    log.error(tag.pob, error);
    return (
      <>
        {showErrorDialog && (
          <ErrorDialog
            error={error}
            onReload={() => window.location.reload()}
            onClose={() => setShowErrorDialog(false)}
          />
        )}
        <div
          ref={container}
          className={`w-full h-full border border-neutral focus:outline-none bg-black ${
            loading ? "rounded-none skeleton" : ""
          }`}
        />
      </>
    );
  }

  return (
    <div
      ref={container}
      className={`w-full h-full border border-neutral focus:outline-none bg-black ${
        loading ? "rounded-none skeleton" : ""
      }`}
    />
  );
}
