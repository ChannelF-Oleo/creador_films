"use client";

import { memo } from "react";
import {
    deletePhoto,
    movePhoto,
    setEditorialCover,
    setInEditorial,
    setLandingPhoto,
    updatePhoto,
} from "@/app/actions/admin";
import { LANDING_SLOTS, type LandingSettings } from "@/lib/editorials";
import type { Photo } from "@/lib/portfolio";

type Act = (action: (idToken: string) => Promise<{ ok: true } | { ok: false; error: string }>) => Promise<boolean>;

/** Barra de edición bajo cada foto; solo se muestra con la sesión del admin iniciada. */
const PhotoTools = memo(function PhotoTools({
    photo,
    editorial,
    landing,
    busy,
    act,
}: {
    photo: Photo;
    /** Editorial del landing a la que pertenece la foto, o null si su categoría no tiene */
    editorial: string | null;
    landing: LandingSettings;
    busy: boolean;
    act: Act;
}) {
    const selection = editorial ? landing.editorials[editorial] : undefined;
    const isCover = selection?.coverId === photo.id;
    const inLanding = selection?.photoIds.includes(photo.id) ?? false;

    const editAlt = () => {
        const alt = window.prompt("Texto alternativo (describe la foto para buscadores y lectores de pantalla):", photo.alt);
        if (alt !== null && alt.trim() !== photo.alt) act((t) => updatePhoto(t, photo.id, { alt }));
    };

    const remove = () => {
        if (window.confirm("¿Borrar esta foto para siempre? También se quitará del landing.")) {
            act((t) => deletePhoto(t, photo.id));
        }
    };

    return (
        <div className="photo-tools font-mono-urban" aria-label="Editar foto">
            {editorial && (
                <>
                    <button
                        disabled={busy || isCover}
                        aria-pressed={isCover}
                        onClick={() => act((t) => setEditorialCover(t, photo.id))}
                        title="Foto principal de su serie en el landing"
                    >
                        {isCover ? "★ Portada" : "☆ Portada"}
                    </button>
                    <button
                        disabled={busy}
                        aria-pressed={inLanding}
                        onClick={() => act((t) => setInEditorial(t, photo.id, !inLanding))}
                        title="Mostrar en las tiras y el visor de su serie en el landing"
                    >
                        {inLanding ? "✓ Landing" : "+ Landing"}
                    </button>
                </>
            )}
            {LANDING_SLOTS.map(({ slot, field, label }) => {
                const used = landing[field] === photo.id;
                return (
                    <button
                        key={slot}
                        disabled={busy || used}
                        aria-pressed={used}
                        onClick={() => act((t) => setLandingPhoto(t, slot, photo.id))}
                        title={`Usar en la sección ${label} del landing`}
                    >
                        {used ? `✓ ${label}` : label}
                    </button>
                );
            })}
            <button disabled={busy} onClick={editAlt} title="Editar texto alternativo">Alt</button>
            <button
                disabled={busy}
                onClick={() => act((t) => updatePhoto(t, photo.id, { hidden: !photo.hidden }))}
                title={photo.hidden ? "Volver a mostrar en el portafolio" : "Ocultar sin borrar"}
            >
                {photo.hidden ? "Mostrar" : "Ocultar"}
            </button>
            <button disabled={busy} onClick={() => act((t) => movePhoto(t, photo.id, -1))} title="Mover antes dentro de su categoría" aria-label="Mover antes">↑</button>
            <button disabled={busy} onClick={() => act((t) => movePhoto(t, photo.id, 1))} title="Mover después dentro de su categoría" aria-label="Mover después">↓</button>
            <button disabled={busy} onClick={remove} className="photo-tools-danger" title="Borrar la foto">Borrar</button>
        </div>
    );
});

export default PhotoTools;
