"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ApiSupplier, deriveCanadianConfidence } from "@/lib/api";
import { getCapacityTierLabel, getProvinceLabel } from "@/lib/i18n";
import { buildSupplierProfilePath } from "@/lib/navigation";

function getScoreColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

interface MapControllerProps {
  suppliers: ApiSupplier[];
  selectedSupplierId?: string | null;
  markerRefs: React.MutableRefObject<Map<string, L.CircleMarker>>;
}

function MapController({ suppliers, selectedSupplierId, markerRefs }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSupplierId) return;
    const supplier = suppliers.find((entry) => entry.supplier_id === selectedSupplierId);
    if (supplier?.latitude != null && supplier?.longitude != null) {
      map.flyTo([supplier.latitude, supplier.longitude], 12, { duration: 0.8 });
      // Open the popup after fly animation completes
      setTimeout(() => {
        const marker = markerRefs.current.get(selectedSupplierId);
        if (marker) marker.openPopup();
      }, 900);
    }
  }, [selectedSupplierId, suppliers, map, markerRefs]);

  return null;
}

interface MapViewProps {
  suppliers: ApiSupplier[];
  locale: "en" | "fr";
  selectedSupplierId?: string | null;
  onSupplierClick?: (id: string) => void;
  returnToPath?: string;
}

export default function MapView({
  suppliers,
  locale,
  selectedSupplierId,
  onSupplierClick,
  returnToPath,
}: MapViewProps) {
  const markerRefs = useRef<Map<string, L.CircleMarker>>(new Map());

  const setMarkerRef = useCallback((id: string, ref: L.CircleMarker | null) => {
    if (ref) {
      markerRefs.current.set(id, ref);
    } else {
      markerRefs.current.delete(id);
    }
  }, []);

  const labels =
    locale === "fr"
      ? {
          canadian: "Canadien",
          source: "Source",
          profile: "Voir le profil",
        }
      : {
          canadian: "Canadian",
          source: "Source",
          profile: "View profile",
        };

  const geoSuppliers = suppliers.filter(
    (supplier): supplier is ApiSupplier & { latitude: number; longitude: number } =>
      supplier.latitude != null && supplier.longitude != null
  );

  return (
    <MapContainer
      center={[56.1304, -106.3468]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController suppliers={suppliers} selectedSupplierId={selectedSupplierId} markerRefs={markerRefs} />
      {geoSuppliers.map((supplier) => {
        const { score } = deriveCanadianConfidence(supplier);
        const color = getScoreColor(score);
        const isSelected = selectedSupplierId === supplier.supplier_id;
        const provinceLabel = getProvinceLabel(supplier.province_code, locale);

        return (
          <CircleMarker
            key={supplier.supplier_id}
            ref={(ref) => setMarkerRef(supplier.supplier_id, ref)}
            center={[supplier.latitude, supplier.longitude]}
            radius={isSelected ? 11 : 8}
            pathOptions={{
              fillColor: color,
              color: isSelected ? "#3b82f6" : "white",
              weight: isSelected ? 3 : 2,
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => onSupplierClick?.(supplier.supplier_id),
            }}
          >
            <Popup>
              <div style={{ minWidth: "200px", fontFamily: "inherit" }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#111827",
                    marginBottom: "4px",
                  }}
                >
                  {supplier.business_name}
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                  {[supplier.city, provinceLabel].filter(Boolean).join(", ")}
                </p>
                {supplier.brief_info && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#374151",
                      marginBottom: "6px",
                      lineHeight: "1.4",
                    }}
                  >
                    {supplier.brief_info}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    marginBottom: "6px",
                  }}
                >
                  {supplier.capacity_tier && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                      }}
                    >
                      {getCapacityTierLabel(supplier.capacity_tier, locale)}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      backgroundColor: color + "20",
                      color,
                      fontWeight: 600,
                    }}
                  >
                    {score}/100 {labels.canadian}
                  </span>
                </div>
                {supplier.source_provider && (
                  <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {labels.source}: {supplier.source_provider}
                  </p>
                )}
                <div style={{ marginTop: "10px" }}>
                  <Link
                    href={`/${locale}${buildSupplierProfilePath(supplier.supplier_id, returnToPath)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#d80621",
                      textDecoration: "none",
                    }}
                  >
                    {labels.profile}
                  </Link>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
