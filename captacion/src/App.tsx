import { useEffect, useState } from "react";
import LandingPage from "./site/LandingPage";
import CrmApp from "./crm/CrmApp";

/**
 * Router minimalista: la web pública vive en "/" y el panel interno en "/panel".
 * Netlify reescribe cualquier ruta a index.html (ver netlify.toml), así que
 * basta con leer el pathname. La navegación entre ambos usa recarga normal.
 */
export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (path.startsWith("/panel")) return <CrmApp />;
  return <LandingPage />;
}
