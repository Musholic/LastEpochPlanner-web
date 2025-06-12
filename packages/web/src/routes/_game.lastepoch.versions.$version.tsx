import PoBController from "../components/PoBController";
import type { Route } from "./+types/_game.lastepoch.versions.$version";

export default function (p: Route.ComponentProps) {
  return <PoBController game="lastepoch" version={p.params.version} isHead={false} />;
}
