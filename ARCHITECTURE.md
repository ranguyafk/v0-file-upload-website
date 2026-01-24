# Component Architecture - Dashboard Enhancements

## Component Hierarchy

```
Dashboard Page (Server Component)
└── DashboardContent (Client Component)
    ├── Header Section
    │   ├── User Info
    │   ├── Upload Button
    │   ├── Upgrade Button (if free)
    │   └── Logout Button
    │
    ├── Plan Badge Section
    │   ├── Plan Icon
    │   ├── Plan Details
    │   └── Upgrade Button (if free)
    │
    └── Files Section (Tabs)
        ├── TabsList (Header)
        │   ├── Photos Tab Trigger (with count)
        │   └── Files Tab Trigger (with count)
        │
        ├── SelectionToolbar (Conditional)
        │   ├── Desktop Toolbar (Sticky Top)
        │   │   ├── Selection Count
        │   │   ├── Clear Button
        │   │   ├── Copy Links Button
        │   │   ├── Download Button
        │   │   └── Delete Button
        │   │
        │   └── Mobile Toolbar (Fixed Bottom)
        │       ├── Selection Count
        │       ├── Clear Button
        │       ├── Copy Button
        │       ├── Download Button
        │       └── Delete Button
        │
        ├── TabsContent: Photos
        │   └── PhotoGrid
        │       └── Photo Items
        │           ├── Image (lazy loaded)
        │           ├── Selection Overlay
        │           ├── Checkbox (desktop)
        │           └── Hover Info
        │
        ├── TabsContent: Files
        │   └── FileList
        │       └── File Items
        │           ├── Checkbox (desktop, selection mode)
        │           ├── File Icon
        │           ├── File Info
        │           ├── Stats (views/downloads)
        │           └── Quick Actions (non-selection mode)
        │               ├── Copy Link
        │               ├── View
        │               └── Analytics
        │
        └── PreviewModal (Conditional)
            ├── Header
            │   ├── Title & Count
            │   ├── Download Button
            │   ├── Open in New Tab Button
            │   └── Close Button
            │
            ├── Image Display
            │   └── Full-size Image
            │
            └── Navigation
                ├── Desktop: Side Arrows + Keyboard
                └── Mobile: Bottom Buttons + Swipe
```

## Data Flow

```
Server (dashboard/page.tsx)
    ↓ Fetch user, profile, files from Supabase
    ↓ Pass as props
    ↓
DashboardContent (client component)
    ↓ Classify files by file_type
    ↓ photos = files where file_type starts with "image/"
    ↓ otherFiles = remaining files
    ↓
    ├─→ PhotoGrid (photos, selection state)
    │   ├─→ User clicks/long-presses
    │   └─→ Updates selection state
    │
    ├─→ FileList (otherFiles, selection state)
    │   ├─→ User clicks/long-presses
    │   └─→ Updates selection state
    │
    ├─→ SelectionToolbar (selection count, action handlers)
    │   ├─→ Copy Links: navigator.clipboard
    │   ├─→ Download: window.open(file_url)
    │   └─→ Delete: fetch /api/file/:slug
    │
    └─→ PreviewModal (images, current index)
        ├─→ Keyboard navigation
        └─→ Touch swipe gestures
```

## State Management

```javascript
// In DashboardContent component

// Selection State (Set for O(1) operations)
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

// Tab State
const [activeTab, setActiveTab] = useState<"photos" | "files">("photos")

// Preview State
const [previewIndex, setPreviewIndex] = useState<number | null>(null)

// Action Loading States
const [isDeleting, setIsDeleting] = useState(false)
const [loggingOut, setLoggingOut] = useState(false)

// Derived State (memoized)
const { photos, otherFiles } = useMemo(() => {
  // Client-side classification by file_type
}, [files])

const selectionMode = selectedIds.size > 0
```

## Event Flow

### Desktop Multi-Selection Flow
```
1. User long-presses or clicks item
   → handleToggleSelection(id)
   → selectedIds.add(id) or .delete(id)
   → selectionMode = true
   → Checkboxes appear
   → SelectionToolbar shows (sticky top)

2. User clicks additional items
   → Same toggle logic
   → Visual feedback (highlight + checkmark)

3. User clicks bulk action
   → handleBulkDelete() / handleCopyLinks() / handleDownload()
   → Perform action
   → Show toast notification
   → handleClearSelection()
   → selectionMode = false
```

### Mobile Long-Press Selection Flow
```
1. User touches and holds (500ms)
   → onTouchStart → setTimeout(500ms)
   → handleToggleSelection(id)
   → selectionMode = true
   → SelectionToolbar shows (fixed bottom)

2. User taps additional items
   → onClick (if selectionMode)
   → handleToggleSelection(id)
   → Checkmark indicator appears

3. User taps bulk action in bottom toolbar
   → Same action handlers as desktop
   → Toast notification
   → Clear selection
```

### Preview Modal Flow
```
Photos View:
1. User clicks photo (not in selection mode)
   → handlePreview(index)
   → setPreviewIndex(index)
   → PreviewModal opens

2. User navigates
   Desktop:
   → Arrow keys → handleNavigatePreview(newIndex)
   Mobile:
   → Swipe → handleNavigatePreview(newIndex)

3. User closes
   → ESC key or X button → handleClosePreview()
   → setPreviewIndex(null)
```

## Responsive Breakpoints

```css
/* Mobile First */
Base: 2 columns (photos), full-width (files), bottom toolbar

@media (min-width: 640px) /* sm */
  Photos: 3 columns

@media (min-width: 768px) /* md */
  Photos: 4 columns
  Files: Desktop layout with all metadata
  Toolbar: Sticky top bar
  Bottom nav: Hidden
  Footer padding: Normal

@media (min-width: 1024px) /* lg */
  Photos: 5 columns
  All features fully expanded
```

## Performance Optimizations

### Lazy Loading Strategy
```javascript
// Photo Grid
<img 
  src={photo.file_url} 
  loading="lazy"  // Native lazy loading
  alt={photo.title}
/>

// Loads images as they come into viewport
// No JavaScript IntersectionObserver needed (simpler)
```

### Memoization
```javascript
// File classification cached
const { photos, otherFiles } = useMemo(() => {
  // Only recalculates when files array changes
}, [files])

// Callbacks memoized to prevent re-renders
const handleToggleSelection = useCallback((id: string) => {
  // Stable function reference
}, [])
```

### Selection State
```javascript
// Using Set instead of Array for O(1) operations
const selectedIds = new Set<string>()

// Add: O(1)
selectedIds.add(id)

// Remove: O(1)
selectedIds.delete(id)

// Check: O(1)
selectedIds.has(id)

// vs Array: O(n) for all operations
```

## Accessibility Features

### ARIA Labels
```javascript
// Selection state announced
<div 
  role="button" 
  aria-selected={isSelected}
  aria-label={`${photo.title}${isSelected ? ", selected" : ""}`}
>

// Action buttons labeled
<Button aria-label="Previous image">
  <ChevronLeft />
</Button>
```

### Keyboard Navigation
```javascript
// Tab through items
tabIndex={0}

// Enter/Space to select
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") {
    handleClick()
  }
}}

// Arrow keys in preview
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") onClose()
  }
  window.addEventListener("keydown", handleKeyDown)
}, [])
```

### Touch Targets
```css
/* All interactive elements */
.touch-target {
  min-height: 44px;  /* Apple HIG recommendation */
  min-width: 44px;
}

/* Active feedback */
.active-scale:active {
  transform: scale(0.98);
}
```

## File Type Classification

```javascript
// Client-side classification logic
files.forEach((file) => {
  if (file.file_type && file.file_type.startsWith("image/")) {
    photos.push(file)  // JPG, PNG, GIF, WebP, SVG, etc.
  } else {
    otherFiles.push(file)  // PDF, DOC, ZIP, TXT, etc.
  }
})

// Examples:
// "image/jpeg" → Photos
// "image/png" → Photos
// "image/gif" → Photos
// "image/webp" → Photos
// "application/pdf" → Files
// "video/mp4" → Files
// "text/plain" → Files
```

## API Integration

```javascript
// Bulk Delete
selectedFiles.forEach(file => {
  fetch(`/api/file/${file.slug}?token=${file.owner_token}`, {
    method: "DELETE"
  })
})

// Existing endpoint, no changes needed
// Authentication via owner_token in query string
// Parallel deletion for speed
```

## Toast Notifications

```javascript
import { toast } from "sonner"

// Success
toast.success(`Copied ${count} links`)
toast.success(`Deleted ${count} files`)

// Error
toast.error("Failed to delete some files")

// Auto-dismiss after 3 seconds
// Positioned at top-center
// Dark theme by default
```

## Mobile Gestures

```javascript
// Touch Swipe Detection
const [touchStart, setTouchStart] = useState(0)
const [touchEnd, setTouchEnd] = useState(0)

const handleTouchStart = (e) => {
  setTouchStart(e.targetTouches[0].clientX)
}

const handleTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX)
}

const handleTouchEnd = () => {
  const swipeDistance = touchStart - touchEnd
  
  if (swipeDistance > 50) {
    // Swiped left (next image)
    handleNext()
  } else if (swipeDistance < -50) {
    // Swiped right (previous image)
    handlePrev()
  }
}
```

## CSS Grid Layout

```css
/* Photo Grid - Auto-responsive */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* Mobile: 2 cols */
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);  /* Tablet: 3 cols */
    gap: 0.75rem;
  }
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);  /* Desktop: 4 cols */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);  /* Large: 5 cols */
  }
}

/* Aspect ratio maintained */
.grid-item {
  aspect-ratio: 1;  /* Perfect squares */
}
```

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Efficient state management
- ✅ Performance optimizations
- ✅ Accessibility compliance
- ✅ Mobile-first responsive design
- ✅ Keyboard and touch support
- ✅ No folder system dependencies
- ✅ Scalable component structure
