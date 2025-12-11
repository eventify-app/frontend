import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * ViewTransitionLink:
 *  - to: ruta
 *  - state: objeto que se pasa a navigate (aquí pasamos cover_image mínimo)
 *  - className, children...
 */
export default function ViewTransitionLink({ to, state, className, children, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    // fallback si no hay soporte
    if (!document.startViewTransition) {
      return navigate(to, { state });
    }

    // startViewTransition envuelve la navegación SPA
    document.startViewTransition(() => {
      navigate(to, { state });
    });
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
