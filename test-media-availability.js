
// Simplified implementation of isMediaAvailable
function isMediaAvailable(attachment) {
  if (!attachment) {
    return false;
  }

  if (attachment.isVoiceMessage) {
    return true;
  }

  if (attachment.path && attachment.path.length > 0) {
    return true;
  }

  if (attachment.data instanceof Uint8Array) {
    return true;
  }

  if (attachment.url && attachment.url.startsWith('data:')) {
    return true;
  }

  if (attachment.contentType === 'image/webp' && attachment.cdnId) {
    return true;
  }

  return false;
}

function testMediaAvailability() {
  const testCases = [
    [
      'Voice message',
      { isVoiceMessage: true, contentType: 'audio/ogg', size: 1000 },
      true,
    ],
    [
      'Local path',
      { path: '/path/to/file.jpg', contentType: 'image/jpeg', size: 1000 },
      true,
    ],
    [
      'With data',
      { data: new Uint8Array(10), contentType: 'image/png', size: 1000 },
      true,
    ],
    [
      'Data URL',
      { url: 'data:image/png;base64,iVBORw0KGgo...', contentType: 'image/png', size: 1000 },
      true,
    ],
    [
      'Sticker',
      { contentType: 'image/webp', cdnId: 'sticker123', size: 1000 },
      true,
    ],
    [
      'Unavailable media',
      { contentType: 'image/jpeg', size: 1000 },
      false,
    ],
    [
      'Empty attachment',
      {},
      false,
    ],
    [
      'Null attachment',
      null,
      false,
    ],
    [
      'Undefined attachment',
      undefined,
      false,
    ],
    [
      'Attachment with empty path',
      { path: '', contentType: 'image/jpeg', size: 1000 },
      false,
    ],
    [
      'Attachment with null data',
      { data: null, contentType: 'image/png', size: 1000 },
      false,
    ],
    [
      'Attachment with empty data',
      { data: new Uint8Array(0), contentType: 'image/png', size: 0 },
      true,
    ],
    [
      'Sticker without cdnId',
      { contentType: 'image/webp', size: 1000 },
      false,
    ],
  ];

  testCases.forEach(([description, attachment, expected]) => {
    const result = isMediaAvailable(attachment);
    console.log(`Test case: ${description}`);
    console.log(`Expected: ${expected}, Actual: ${result}`);
    console.log(`Result: ${result === expected ? 'PASS' : 'FAIL'}`);
    console.log('---');
  });
}

testMediaAvailability();
