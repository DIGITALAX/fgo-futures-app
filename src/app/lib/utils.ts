import { INFURA_GATEWAY } from "./constants";

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
      remainingMinutes !== 1 ? "s" : ""
    }`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    const remainingHours = hours % 24;
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
    return `${days} day${days !== 1 ? "s" : ""} ${remainingHours} hour${
      remainingHours !== 1 ? "s" : ""
    }`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    const remainingDays = days % 7;
    if (remainingDays === 0) {
      return `${weeks} week${weeks !== 1 ? "s" : ""}`;
    }
    return `${weeks} week${weeks !== 1 ? "s" : ""} ${remainingDays} day${
      remainingDays !== 1 ? "s" : ""
    }`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    const remainingDays = days % 30;
    if (remainingDays === 0) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    }
    return `${months} month${months !== 1 ? "s" : ""} ${remainingDays} day${
      remainingDays !== 1 ? "s" : ""
    }`;
  }

  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
  return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
    remainingMonths !== 1 ? "s" : ""
  }`;
};

export const ensureMetadata = async (item: any) => {
  if (!item?.metadata && item?.uri) {
    const ipfsMetadata = await fetchMetadataFromIPFS(item?.uri);
    item.metadata = ipfsMetadata;
  }
  return item;
};

export const fetchMetadataFromIPFS = async (uri: string): Promise<any> => {
  try {
    let metadataUrl = uri;
    if (uri?.startsWith("ipfs://")) {
      metadataUrl = `${INFURA_GATEWAY}${uri.replace("ipfs://", "")}`;
    }

    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    return null;
  }
};
