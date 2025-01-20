// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import Delta from 'quill-delta';
import type { Matcher, AttributeMap } from 'quill';
import emojiRegex from 'emoji-regex';

export const matchEmojiImage: Matcher = (
  node: Element,
  delta: Delta,
  attributes: AttributeMap
): Delta => {
  if (
    node.classList.contains('emoji') ||
    node.classList.contains('module-emoji__image--16px')
  ) {
    const value = node.getAttribute('aria-label');
    return new Delta().insert({ emoji: { value } }, attributes);
  }
  return delta;
};

export const matchEmojiBlot: Matcher = (
  node: HTMLElement,
  delta: Delta,
  attributes: AttributeMap
): Delta => {
  if (node.classList.contains('emoji-blot')) {
    const { emoji: value, source } = node.dataset;
    return new Delta().insert({ emoji: { value, source } }, attributes);
  }
  return delta;
};

export const matchEmojiText: Matcher = (
  node: HTMLElement,
  _delta: Delta,
  attributes: AttributeMap
): Delta => {
  if (!('data' in node)) {
    return new Delta();
  }

  const { data } = node;
  if (!data || typeof data !== 'string') {
    return new Delta();
  }

  if (data.replace(/(
|
)/g, '') === '') {
    return new Delta();
  }

  // Split the text into emoji and non-emoji parts
  const parts = data.split(emojiRegex());
  const ops = parts.flatMap((part, index) => {
    if (index % 2 === 0) {
      // Non-emoji part
      return part ? [{ insert: part, attributes }] : [];
    } else {
      // Emoji part
      return [{ insert: { emoji: { value: part } }, attributes }];
    }
  });

  return new Delta(ops);
};
