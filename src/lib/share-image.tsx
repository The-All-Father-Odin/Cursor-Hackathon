import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n";

export const shareImageSize = {
  width: 1200,
  height: 630,
};

export const shareImageContentType = "image/png";

function ShareImage({ locale }: { locale: Locale }) {
  const copy =
    locale === "fr"
      ? {
          badge: "Réseau d’approvisionnement canadien",
          title: "Trouvez des fournisseurs canadiens",
          subtitle:
            "Recherchez, cartographiez et comparez l’approvisionnement local avec SourceLocal.",
          points: ["50 000+ fournisseurs", "Recherche bilingue", "Carte + tarifs"],
        }
      : {
          badge: "Canadian supply chain network",
          title: "Find Canadian suppliers",
          subtitle:
            "Search, map, and compare domestic sourcing opportunities with SourceLocal.",
          points: ["50,000+ suppliers", "Bilingual search", "Map + tariffs"],
        };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #fafbfc 0%, #fee2e2 52%, #fef3c7 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(216,6,33,0.10), transparent 26%), radial-gradient(circle at 80% 10%, rgba(26,71,42,0.14), transparent 28%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -120,
          top: -80,
          width: 380,
          height: 380,
          borderRadius: 9999,
          background: "rgba(216,6,33,0.09)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -110,
          bottom: -140,
          width: 420,
          height: 420,
          borderRadius: 9999,
          background: "rgba(26,71,42,0.10)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "56px 62px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 760,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 14,
              padding: "12px 18px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(216,6,33,0.14)",
              fontSize: 26,
              fontWeight: 700,
              color: "#b91c1c",
            }}
          >
            <span
              style={{
                display: "flex",
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: "#d80621",
              }}
            />
            {copy.badge}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 88,
                  height: 88,
                  borderRadius: 28,
                  background: "#d80621",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 18px 50px rgba(216,6,33,0.18)",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 50,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  S
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: 62,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: -2,
                  }}
                >
                  Source
                  <span style={{ color: "#d80621" }}>Local</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 24,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 5,
                    color: "#64748b",
                    marginTop: 8,
                  }}
                >
                  Canada
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -2.5,
                maxWidth: 780,
              }}
            >
              {copy.title}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                color: "#475569",
                maxWidth: 760,
              }}
            >
              {copy.subtitle}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "26px 28px",
              borderRadius: 34,
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(15,23,42,0.06)",
              minWidth: 280,
            }}
          >
            {copy.points.map((point) => (
              <div
                key={point}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: 12,
                    height: 12,
                    borderRadius: 9999,
                    background: "#1a472a",
                  }}
                />
                {point}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 22px",
              borderRadius: 9999,
              background: "#1a472a",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 16px 40px rgba(26,71,42,0.18)",
            }}
          >
            <span
              style={{
                display: "flex",
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#facc15",
              }}
            />
            sourcelocal.ca
          </div>
        </div>
      </div>
    </div>
  );
}

export function createShareImageResponse(locale: Locale) {
  return new ImageResponse(<ShareImage locale={locale} />, {
    ...shareImageSize,
  });
}
