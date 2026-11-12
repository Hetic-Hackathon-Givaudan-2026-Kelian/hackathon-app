import { useState } from "react";

type Props = {
  variant: "peach" | "berry";
  image?: string;
  className?: string;
};

/** Visuel d'ambiance. Affiche l'image des maquettes si elle est présente
 *  dans frontend/public/images/, sinon un dessin de secours en CSS. */
export default function Visual({ variant, image, className = "" }: Props) {
  const [imageOk, setImageOk] = useState(Boolean(image));

  return (
    <div className={`visual visual-${variant} ${className}`} aria-hidden="true">
      {imageOk && image ? (
        <img
          className="visual-image"
          src={image}
          alt=""
          onError={() => setImageOk(false)}
        />
      ) : (
        <>
          <span className="veil veil-1" />
          <span className="veil veil-2" />
          <span className="fruit fruit-1" />
          <span className="fruit fruit-2" />
          <span className="drop drop-1" />
          <span className="drop drop-2" />
          <span className="drop drop-3" />
          <span className="drop drop-4" />
        </>
      )}
    </div>
  );
}
