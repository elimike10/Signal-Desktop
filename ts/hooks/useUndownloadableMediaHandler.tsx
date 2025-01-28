// Copyright 2025 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { useCallback } from 'react';

import { AttachmentType } from '../types/Attachment';

/**
 * A hook to handle undownloadable media, preventing the "media no longer available" toast
 * from showing for attachments that are pending or currently sending.
 *
 * @param showMediaNoLongerAvailableToast - Function to show the "media no longer available" toast
 * @param attachment - The attachment being handled
 * @param isSending - Whether the attachment is currently being sent
 * @returns A callback function to handle clicks on undownloadable media
 */
export function useUndownloadableMediaHandler(
  showMediaNoLongerAvailableToast: (() => void) | undefined,
  attachment: AttachmentType,
  isSending: boolean
): (event: React.MouseEvent) => void {
  return useCallback(
    (event: React.MouseEvent) => {
      if (showMediaNoLongerAvailableToast && !isSending && !attachment.pending) {
        event.preventDefault();
        event.stopPropagation();
        showMediaNoLongerAvailableToast();
      }
    },
    [showMediaNoLongerAvailableToast, attachment, isSending]
  );
}
