import { matchDiscovery } from '../../../tokens/match-discovery.generated';

/** Lifecycle display only. Business state remains authoritative in its feature. */
export function discoveryStatusLabel(status: string | undefined): string {
  return matchDiscovery.status[status as keyof typeof matchDiscovery.status] ?? '';
}

export function discoveryLifecycleText(status: string | undefined, context?: string): string {
  const suffix = status === 'live' ? context?.trim() : undefined;
  return discoveryStatusLabel(status) + (suffix ? ' ' + suffix : '');
}

export function discoveryTimingText(status: string | undefined, timing?: string): string {
  const text = timing?.trim();
  return text && text.toUpperCase() !== discoveryStatusLabel(status) ? timing! : '';
}
