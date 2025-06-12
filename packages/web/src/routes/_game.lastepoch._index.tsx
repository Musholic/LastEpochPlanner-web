import PoBController from "../components/PoBController";
import type { Route } from "../routes/+types/_game.lastepoch._index";

export default function (p: Route.ComponentProps) {
  const { games } = p.matches[1].data;
  return <PoBController game="lastepoch" version={games.lastepoch.head} isHead={true} />;
}
