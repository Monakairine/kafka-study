import { Injectable } from '@nestjs/common';

export interface GenerationRequestEvent {
  id?: string;
  userId?: string;
  prompt?: string;
  [key: string]: unknown;
}

@Injectable()
export class AppService {
  private readonly analyticsEndpoint = process.env.ANALYTICS_ENDPOINT;

  getHello(): string {
    return 'Analytics service – consuming generation-request events.';
  }

  /**
   * Track a generation-request event: log it and optionally send to an analytics endpoint.
   * Set ANALYTICS_ENDPOINT (e.g. Segment, Mixpanel, or your own API) to forward events.
   */
  async trackGenerationRequest(event: GenerationRequestEvent): Promise<void> {
    const analyticsEvent = {
      event: 'generation_requested',
      timestamp: new Date().toISOString(),
      properties: {
        requestId: event.id,
        userId: event.userId,
        prompt: event.prompt,
      },
    };

    console.log(`📊 Analytics event: ${JSON.stringify(analyticsEvent)}`);

    if (this.analyticsEndpoint) {
      try {
        const res = await fetch(this.analyticsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analyticsEvent),
        });
        if (!res.ok) {
          console.warn(`Analytics endpoint returned ${res.status}: ${await res.text()}`);
        }
      } catch (err) {
        console.error('Failed to send analytics event:', err);
      }
    }
  }
}
