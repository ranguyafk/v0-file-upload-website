# Testing Guide for Dashboard Enhancements

## Pre-Testing Setup

1. Ensure you have a working Supabase instance with the `files` table
2. Upload some test files:
   - At least 3-5 image files (jpg, png, gif, etc.)
   - At least 3-5 non-image files (pdf, txt, doc, etc.)
3. Ensure files have `file_type` and `file_url` populated

## Desktop Testing

### Photos Tab
- [ ] Photos tab shows only image files
- [ ] Images display in responsive grid (2-5 columns)
- [ ] Hover shows filename overlay
- [ ] Click opens preview modal
- [ ] Preview modal navigation works with arrow keys
- [ ] ESC closes preview modal
- [ ] Image count in tab is correct

### Files Tab
- [ ] Files tab shows only non-image files
- [ ] Files display in list view with metadata
- [ ] View count and download count visible
- [ ] Lock/Clock icons show for protected/expiring files
- [ ] Quick action buttons work (copy link, view, analytics)
- [ ] File count in tab is correct

### Multi-Selection (Desktop)
- [ ] Long-press enters selection mode
- [ ] Click item toggles selection
- [ ] Checkboxes appear on all items
- [ ] Selection toolbar appears at top with count
- [ ] Selected items show visual highlight
- [ ] Can select items across Photos and Files tabs
- [ ] Selection persists when switching tabs

### Bulk Actions (Desktop)
- [ ] Copy Links: Copies newline-separated URLs, shows toast
- [ ] Download: Opens each file in new tab
- [ ] Delete: Shows confirmation with count, deletes files, refreshes dashboard
- [ ] Clear (X): Clears selection, hides toolbar
- [ ] Toast notifications appear for all actions

## Mobile Testing

### Photos Tab (Mobile)
- [ ] 2-column grid on mobile
- [ ] Tap opens preview (when not selecting)
- [ ] Preview swipe navigation works
- [ ] Bottom navigation buttons work
- [ ] Tap X closes preview

### Files Tab (Mobile)
- [ ] Files display in mobile-optimized list
- [ ] Touch targets are 44px+ minimum
- [ ] Selected state shows checkmark on right

### Multi-Selection (Mobile)
- [ ] Long-press (500ms) enters selection mode
- [ ] Visual feedback during long-press
- [ ] Tap adds/removes items from selection
- [ ] Selection toolbar appears at bottom
- [ ] Bottom toolbar is fixed and doesn't scroll
- [ ] Selected items show checkmark

### Bulk Actions (Mobile)
- [ ] Bottom toolbar shows selection count
- [ ] Copy button copies links, shows toast
- [ ] Download button opens files
- [ ] Delete button confirms and deletes
- [ ] Clear button exits selection mode
- [ ] All buttons have 44px+ touch targets

## Cross-Platform Testing

### Classification
- [ ] Images (image/*) appear only in Photos tab
- [ ] Non-images appear only in Files tab
- [ ] Switching tabs works smoothly
- [ ] Counts update correctly after actions

### Upload Integration
- [ ] Upload a new image → appears in Photos tab
- [ ] Upload a new file → appears in Files tab
- [ ] Files appear immediately after upload (or after refresh)

### No Folder Dependencies
- [ ] Dashboard loads without folder_id
- [ ] No console errors about folders
- [ ] All files from user show regardless of folder association
- [ ] Bulk delete works without folder references

### Performance
- [ ] Images lazy-load as user scrolls
- [ ] No lag when selecting multiple items
- [ ] Smooth transitions between tabs
- [ ] Preview modal opens without delay

### Accessibility
- [ ] Tab navigation works
- [ ] Screen reader announces selection
- [ ] Focus states visible
- [ ] Enter/Space keys work for selection
- [ ] Arrow keys work in preview

## Edge Cases

- [ ] Empty Photos tab shows "No photos" message
- [ ] Empty Files tab shows "No files" message
- [ ] Single file selection works
- [ ] Select all items and delete
- [ ] Very long filenames truncate properly
- [ ] Large images load in preview
- [ ] Rapid selection/deselection doesn't break state
- [ ] Network errors on delete show appropriate message

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Issues to Watch For

1. **Selection state**: Should clear after bulk actions
2. **Tab switching**: Selection should persist across tabs
3. **Preview navigation**: Should wrap or disable at boundaries
4. **Touch events**: Should not conflict with click events
5. **Lazy loading**: Images should load progressively
6. **Toast notifications**: Should not stack infinitely
7. **Memory**: Preview should cleanup when closed
8. **File URLs**: Should open/download correctly

## Regression Testing

Verify existing features still work:
- [ ] Header navigation
- [ ] Logout functionality
- [ ] Plan badge display
- [ ] Upload button navigation
- [ ] Bottom navigation (mobile)
- [ ] Footer links
- [ ] Responsive layout

## Security Verification

- [ ] Delete requires owner_token
- [ ] Only user's files are visible
- [ ] No SQL injection in bulk operations
- [ ] CSRF protection on delete
- [ ] XSS prevention in filenames/titles

## Performance Metrics

Target metrics:
- [ ] Time to interactive: < 3s
- [ ] Selection response: < 100ms
- [ ] Preview open: < 200ms
- [ ] Tab switch: < 100ms
- [ ] Bulk delete (10 files): < 5s

## Success Criteria

All of the following must pass:
1. ✅ Build succeeds without errors
2. ✅ TypeScript compilation clean
3. ✅ No console errors in browser
4. ✅ All desktop features work
5. ✅ All mobile features work
6. ✅ Classification is accurate
7. ✅ No folder dependencies
8. ✅ Accessibility standards met
9. ✅ Performance targets met
10. ✅ Documentation complete
