function useUndownloadableMediaHandler(
  showMediaNoLongerAvailableToast,
  attachment,
  isSending,
  isUploading
) {
  return (event) => {
    if (
      showMediaNoLongerAvailableToast &&
      !isSending &&
      !isUploading &&
      !attachment.pending &&
      !attachment.error
    ) {
      event.preventDefault();
      event.stopPropagation();
      showMediaNoLongerAvailableToast();
    }
  };
}

function simulateAttachment(pending, error, uploadState) {
  return { pending, error, uploadState };
}

function runTest(description, attachment, isSending, isUploading, expectedResult) {
  let toastShown = false;
  const showToast = () => { toastShown = true; };
  const handler = useUndownloadableMediaHandler(showToast, attachment, isSending, isUploading);
  
  const event = { preventDefault: () => {}, stopPropagation: () => {} };
  console.log(description);
  handler(event);
  console.log('Result:', toastShown ? 'Toast shown' : 'No toast shown');
  console.log('Expected:', expectedResult ? 'Toast shown' : 'No toast shown');
  console.log(toastShown === expectedResult ? 'PASS' : 'FAIL');
  console.log('---');
}

// Test cases
runTest('Normal attachment', simulateAttachment(false, false, 'done'), false, false, true);
runTest('Pending attachment', simulateAttachment(true, false, 'pending'), false, false, false);
runTest('Sending attachment', simulateAttachment(false, false, 'uploading'), true, false, false);
runTest('Uploading attachment', simulateAttachment(false, false, 'uploading'), false, true, false);
runTest('Attachment with error', simulateAttachment(false, true, 'done'), false, false, false);
runTest('Completed sticker', simulateAttachment(false, false, 'done'), false, false, true);
runTest('Sending sticker', simulateAttachment(false, false, 'uploading'), true, false, false);
