export type FeatureFlags = {
  alphaBanner: boolean;
  feedbackCenter: boolean;
  creatorAnalytics: boolean;
  launchDashboard: boolean;
  emailDigestsPreview: boolean;
  inviteOnlyAlpha: boolean;
};

export function getFeatureFlags(): FeatureFlags {
  return {
    alphaBanner: true,
    feedbackCenter: true,
    creatorAnalytics: true,
    launchDashboard: true,
    emailDigestsPreview: true,
    inviteOnlyAlpha: true,
  };
}
