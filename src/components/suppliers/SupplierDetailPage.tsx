"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { getSupplierDetail, ApiSupplier, deriveCanadianConfidence } from "@/lib/api";
import { getProvinceLabel } from "@/lib/i18n";
import { CanadianContentBadge } from "@/components/ui/CanadianContentBadge";
import { CapacityBadge } from "@/components/ui/CapacityBadge";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Hash,
  Users,
  Database,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Map,
} from "lucide-react";

type SupplierDetailPageProps = {
  initialSupplier?: ApiSupplier | null;
};

export default function SupplierDetailPage({ initialSupplier = null }: SupplierDetailPageProps) {
  const params = useParams();
  const { getLocalePath, locale } = useLocale();
  const copy =
    locale === "fr"
      ? {
          loadError: "Impossible de charger le fournisseur",
          supplierNotFound: "Fournisseur introuvable",
          supplierNotFoundBody: "Ce fournisseur est introuvable.",
          backToSearch: "Retour à la recherche",
          alsoKnownAs: "Aussi connu sous le nom de :",
          canadianContentConfidence: "Indice de confiance du contenu canadien",
          businessInformation: "Informations sur l’entreprise",
          description: "Description",
          details: "Détails",
          sector: "Secteur",
          subsector: "Sous-secteur",
          employees: "Employés",
          licenseType: "Type de permis",
          locationAndContact: "Emplacement et contact",
          address: "Adresse",
          postalCode: "Code postal",
          province: "Province",
          censusArea: "Région de recensement",
          coordinates: "Coordonnées",
          contact: "Contact",
          industryClassification: "Classification industrielle",
          naicsCode: "Code SCIAN",
          primaryNaics: "SCIAN principal (source)",
          secondaryNaics: "SCIAN secondaire",
          dataSource: "Source des données",
          source: "Source",
          datasets: "Jeux de données",
          datasetsFound: (count: number) => `Présent dans ${count} jeu(x) de données`,
          matchMethod: "Méthode d’appariement",
          businessId: "Identifiant d’entreprise",
          odbusAttribution:
            "Données provenant de la Base de données ouverte des entreprises (ODBus) de Statistique Canada",
          viewOnMap: "Voir sur la carte",
        }
      : {
          loadError: "Failed to load supplier",
          supplierNotFound: "Supplier Not Found",
          supplierNotFoundBody: "This supplier could not be found.",
          backToSearch: "Back to Search",
          alsoKnownAs: "Also known as:",
          canadianContentConfidence: "Canadian Content Confidence",
          businessInformation: "Business Information",
          description: "Description",
          details: "Details",
          sector: "Sector",
          subsector: "Subsector",
          employees: "Employees",
          licenseType: "License Type",
          locationAndContact: "Location & Contact",
          address: "Address",
          postalCode: "Postal Code",
          province: "Province",
          censusArea: "Census Area",
          coordinates: "Coordinates",
          contact: "Contact",
          industryClassification: "Industry Classification",
          naicsCode: "NAICS Code",
          primaryNaics: "Primary NAICS (Source)",
          secondaryNaics: "Secondary NAICS",
          dataSource: "Data Source",
          source: "Source",
          datasets: "Datasets",
          datasetsFound: (count: number) => `Found in ${count} dataset(s)`,
          matchMethod: "Match Method",
          businessId: "Business ID",
          odbusAttribution:
            "Data sourced from Statistics Canada Open Database of Businesses (ODBus)",
          viewOnMap: "View on Map",
        };

  const routeSupplierId = typeof params.id === "string" ? params.id : undefined;
  const supplierId = routeSupplierId ?? initialSupplier?.supplier_id ?? "";

  const [supplier, setSupplier] = useState<ApiSupplier | null>(initialSupplier);
  const [loading, setLoading] = useState(!initialSupplier);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupplier(initialSupplier);
    setLoading(!initialSupplier);
    setError(null);
  }, [initialSupplier]);

  useEffect(() => {
    if (!supplierId) {
      setSupplier(null);
      setLoading(false);
      return;
    }

    if (initialSupplier?.supplier_id === supplierId) {
      setSupplier(initialSupplier);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchSupplier() {
      setLoading(true);
      setError(null);
      try {
        const result = await getSupplierDetail(supplierId);
        setSupplier(result.row);
      } catch (e) {
        setError(e instanceof Error ? e.message : copy.loadError);
      } finally {
        setLoading(false);
      }
    }
    fetchSupplier();
  }, [copy.loadError, initialSupplier, supplierId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{copy.supplierNotFound}</h1>
        <p className="text-slate-500 mb-6">{error || copy.supplierNotFoundBody}</p>
        <Link
          href={getLocalePath("/search")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {copy.backToSearch}
        </Link>
      </div>
    );
  }

  const confidence = deriveCanadianConfidence(supplier);
  const provinceName = supplier.province_code
    ? getProvinceLabel(supplier.province_code, locale)
    : supplier.province_name || "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={getLocalePath("/search")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {copy.backToSearch}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <CanadianContentBadge score={confidence.score} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {supplier.business_name}
            </h1>
            {supplier.alt_business_name && (
              <p className="text-sm text-slate-400 mb-2">
                {copy.alsoKnownAs} {supplier.alt_business_name}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {[supplier.city, provinceName].filter(Boolean).join(", ")}
              </span>
              {supplier.capacity_tier && supplier.capacity_tier !== "Unknown" && (
                <CapacityBadge tier={supplier.capacity_tier as "Small" | "Medium" | "Large"} />
              )}
              {supplier.status && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  {supplier.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">
              {copy.canadianContentConfidence}: {confidence.score}/100
            </span>
          </div>
          <p className="text-xs text-emerald-700/70">{confidence.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-400" />
            {copy.businessInformation}
          </h2>
          <dl className="space-y-3">
            {supplier.brief_info && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.description}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.brief_info}</dd>
              </div>
            )}
            {supplier.business_description && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.details}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.business_description}</dd>
              </div>
            )}
            {supplier.business_sector && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.sector}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.business_sector}</dd>
              </div>
            )}
            {supplier.business_subsector && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.subsector}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.business_subsector}</dd>
              </div>
            )}
            {supplier.employee_count_raw && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.employees}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {supplier.employee_count_raw}
                </dd>
              </div>
            )}
            {supplier.licence_type && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.licenseType}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {supplier.licence_type}
                  {supplier.licence_number && (
                    <span className="text-slate-400">({supplier.licence_number})</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            {copy.locationAndContact}
          </h2>
          <dl className="space-y-3">
            {supplier.full_address && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.address}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.full_address}</dd>
              </div>
            )}
            {supplier.postal_code && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.postalCode}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.postal_code}</dd>
              </div>
            )}
            {provinceName && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.province}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{provinceName}</dd>
              </div>
            )}
            {supplier.csd_name && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.censusArea}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.csd_name}</dd>
              </div>
            )}
            {supplier.latitude && supplier.longitude && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.coordinates}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-slate-400" />
                  {supplier.latitude.toFixed(4)}, {supplier.longitude.toFixed(4)}
                </dd>
              </div>
            )}
            {supplier.contact_summary && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.contact}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.contact_summary}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-slate-400" />
            {copy.industryClassification}
          </h2>
          <dl className="space-y-3">
            {supplier.derived_naics && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.naicsCode}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium mr-2">
                    {supplier.derived_naics}
                  </span>
                  {supplier.naics_description}
                </dd>
              </div>
            )}
            {supplier.source_naics_primary && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.primaryNaics}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.source_naics_primary}</dd>
              </div>
            )}
            {supplier.source_naics_secondary && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.secondaryNaics}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">
                  {supplier.source_naics_secondary}
                  {supplier.naics_description_secondary && ` — ${supplier.naics_description_secondary}`}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-400" />
            {copy.dataSource}
          </h2>
          <dl className="space-y-3">
            {supplier.source_provider && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.source}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.source_provider}</dd>
              </div>
            )}
            {supplier.source_dataset_count && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.datasets}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">
                  {copy.datasetsFound(supplier.source_dataset_count)}
                </dd>
              </div>
            )}
            {supplier.source_match_method && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.matchMethod}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">
                  {supplier.source_match_method.replace(/_/g, " ")}
                </dd>
              </div>
            )}
            {supplier.business_id_no && (
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {copy.businessId}
                </dt>
                <dd className="text-sm text-slate-700 mt-0.5">{supplier.business_id_no}</dd>
              </div>
            )}
          </dl>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">{copy.odbusAttribution}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={getLocalePath("/search")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {copy.backToSearch}
        </Link>
        {supplier.latitude && supplier.longitude && (
          <Link
            href={getLocalePath(`/map?supplier_id=${encodeURIComponent(supplier.supplier_id)}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium border border-slate-200"
          >
            <Map className="w-4 h-4" />
            {copy.viewOnMap}
          </Link>
        )}
      </div>
    </div>
  );
}
