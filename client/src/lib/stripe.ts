import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

/**
 * Stripe Integration Helper
 *
 * This module provides functions for Stripe payment integration.
 * It supports both local development (Express API) and production (Firebase Cloud Functions).
 *
 * Set VITE_USE_CLOUD_FUNCTIONS=true to use Firebase Cloud Functions
 * Otherwise, it will use the local Express API
 */

const USE_CLOUD_FUNCTIONS = import.meta.env.VITE_USE_CLOUD_FUNCTIONS === 'true';

/**
 * Create a Stripe checkout session
 * @param userId - The user ID making the purchase
 * @returns The checkout URL to redirect to
 */
export async function createCheckoutSession(userId: string): Promise<string> {
  if (USE_CLOUD_FUNCTIONS) {
    // Use Firebase Cloud Functions
    const functions = getFunctions(app);
    const createCheckoutSessionFn = httpsCallable<
      { userId: string },
      { url: string }
    >(functions, 'createCheckoutSession');

    const result = await createCheckoutSessionFn({ userId });
    return result.data.url;
  } else {
    // Use local Express API
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.url;
  }
}
