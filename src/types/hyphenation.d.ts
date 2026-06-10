declare module "hypher";
declare module "hyphenation.es";

type AdSensePushItem =
  | Record<string, unknown>
  | {
      done?: (grantedReward: { type: string; amount: number } | null) => void;
    };

interface Window {
  adsbygoogle?: AdSensePushItem[];
  // H5 Games API (Ad Manager) – disponible si se integra Google Ad Manager
  adBreak?: (config: {
    type: string;
    name?: string;
    beforeReward?: (showAdFn: () => void) => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    afterAd?: () => void;
    beforeAd?: () => void;
  }) => void;
  adConfig?: (config: {
    preloadAdBreaks?: "on" | "auto";
    onReady?: () => void;
  }) => void;
}
