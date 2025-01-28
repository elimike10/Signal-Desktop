// Copyright 2025 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { useCallback } from 'react';

export function useUndownloadableMediaHandler(
  showMediaNoLongerAvailableToast: (() => void) | undefined,
  isSticker: boolean,
  isInComposer: boolean
): (event: React.MouseEvent) => void {
  return useCallback(
    (event: React.MouseEvent) => {
      if (showMediaNoLongerAvailableToast && !isSticker && !isInComposer) {
        event.preventDefault();
        event.stopPropagation();
        showMediaNoLongerAvailableToast();
      }
    },
    [showMediaNoLongerAvailableToast, isSticker, isInComposer]
  );
}
