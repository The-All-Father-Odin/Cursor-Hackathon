"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ApiSupplier, deriveCanadianConfidence } from "@/lib/api";

function getScoreColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

interface MapControllerProps {
  suppliers: ApiSupplier[];
  selectedSupplierId?: string | null;
}

function MapController({ suppliers, selectedSupplierId }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSupplierId) return;
    const supplier = suppliers.find((entry) => entry.supplier_id === selectedSupplierId);
    if (supplier?.latitude != null && supplier?.longitude != null) {
      map.flyTo([supplier.latitude, supplier.longitude], 12, { duration: 1 });
    }
  }, [selectedSupplierId, suppliers, map]);

  return null;
}

interface MapViewProps {
  suppliers: ApiSupplier[];
  locale: "en" | "fr";
  selectedSupplierId?: string | null;
  onSupplierClick?: (id: string) => void;
}

export default function MapView({
  suppliers,
  locale,
  selectedSupplierId,
  onSupplierClick,
}: MapViewProps) {
  const labels =
    locale === "fr"
      ? {
          canadian: "Canadien",
          source: "Source",
        }
      : {
          canadian: "Canadian",
          source: "Source",
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
      <MapController suppliers={suppliers} selectedSupplierId={selectedSupplierId} />
      {geoSuppliers.map((supplier) => {
        const { score } = deriveCanadianConfidence(supplier);
        const color = getScoreColor(score);
        const isSelected = selectedSupplierId === supplier.supplier_id;

        return (
          <CircleMarker
            key={supplier.supplier_id}
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
                  {[supplier.city, supplier.province_code].filter(Boolean).join(", ")}
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
                      {supplier.capacity_tier}
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
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
