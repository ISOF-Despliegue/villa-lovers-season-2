const DEFAULT_GATEWAY_URL = "https://api.migueleelg0106.me";

export function getGatewayBaseUrl(): string {
  return (import.meta.env.VITE_GATEWAY_URL || DEFAULT_GATEWAY_URL).replace(/\/+$/, "");
}

export function getMediaAssetUrl(assetId: string): string {
  const normalizedAssetId = assetId.trim();

  if (!normalizedAssetId) {
    throw new Error("assetId is required.");
  }

  return `${getGatewayBaseUrl()}/api/v1/media/assets/${encodeURIComponent(normalizedAssetId)}`;
}
