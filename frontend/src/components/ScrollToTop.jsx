import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Resets the window scroll position to the top whenever the route changes.
 * Drop this anywhere inside <BrowserRouter> (we place it inside App).
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null; // renders nothing
}

export default ScrollToTop;
