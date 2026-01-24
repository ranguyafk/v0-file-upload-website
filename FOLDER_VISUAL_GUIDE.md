# Folder Organization Feature - Visual Guide

## UI Components Overview

### 1. Dashboard with Folders View

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                              🚪 Logout            │
│  user@example.com                                            │
├─────────────────────────────────────────────────────────────┤
│  👑 Free Plan                                  [Upgrade]     │
│  5 uploads/day, 500MB max                                    │
├─────────────────────────────────────────────────────────────┤
│  Your Files                                  [+ New Folder]  │
│  🏠 Files                                                     │
├─────────────────────────────────────────────────────────────┤
│  📁 Documents                                    ⋮           │
│     Folder                                                   │
├─────────────────────────────────────────────────────────────┤
│  📁 Photos                                       ⋮           │
│     Folder                                                   │
├─────────────────────────────────────────────────────────────┤
│  📄 example.pdf                                              │
│     /example-pdf • 2.5 MB • Jan 20, 2026                    │
│     👁 5  ⬇ 2  [📋] [🔗] [📊] [🗑]                          │
└─────────────────────────────────────────────────────────────┘
```

### 2. Inside a Folder (Breadcrumb Navigation)

```
┌─────────────────────────────────────────────────────────────┐
│  Your Files                                  [+ New Folder]  │
│  🏠 Files  >  📁 Documents                                   │
├─────────────────────────────────────────────────────────────┤
│  📁 Work Reports                                 ⋮           │
│     Folder                                                   │
├─────────────────────────────────────────────────────────────┤
│  📄 meeting-notes.txt                                        │
│     /meeting-notes • 15 KB • Jan 22, 2026                   │
│     👁 12  ⬇ 3  [📋] [🔗] [📊] [🗑]                         │
└─────────────────────────────────────────────────────────────┘
```

### 3. Create Folder Dialog

```
┌────────────────────────────────────┐
│  Create New Folder            ✕    │
├────────────────────────────────────┤
│  Enter a name for your new folder. │
│                                     │
│  Folder Name                        │
│  ┌────────────────────────────────┐│
│  │ My Folder                      ││
│  └────────────────────────────────┘│
│                                     │
│            [Cancel]  [Create Folder]│
└────────────────────────────────────┘
```

### 4. Folder Actions Menu (Dropdown)

```
                    ┌──────────────┐
                    │ ✏️  Rename   │
                    ├──────────────┤
                    │ 🗑  Delete   │
                    └──────────────┘
```

### 5. Upload Form with Folder Selection

```
┌─────────────────────────────────────────────────────────────┐
│  📤 Drop file here or tap to browse                          │
│                                                               │
│  Title                                                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ My file (optional)                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Custom URL                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ my-file (optional)                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  📁 Folder                                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Select folder (optional)                        ▼      │  │
│  └───────────────────────────────────────────────────────┘  │
│     • Root (No folder)                                        │
│     • Documents                                               │
│     • Photos                                                  │
│     • Projects                                                │
│                                                               │
│  Password              │  Expires                             │
│  ┌──────────────────┐ │ ┌──────────────────┐                │
│  │ Optional         │ │ │ Never       ▼    │                │
│  └──────────────────┘ │ └──────────────────┘                │
│                                                               │
│           [Upload File]                                       │
└─────────────────────────────────────────────────────────────┘
```

## Interaction Flows

### Creating a Folder

```
1. User clicks [+ New Folder]
        ↓
2. Dialog appears with name input
        ↓
3. User types folder name
        ↓
4. User clicks [Create Folder]
        ↓
5. API POST /api/folders
        ↓
6. Dialog closes, folder appears in list
```

### Navigating Folders

```
1. User views root directory
        ↓
2. User clicks on folder (e.g., "Documents")
        ↓
3. Breadcrumb updates: 🏠 Files > 📁 Documents
        ↓
4. View shows files and subfolders in "Documents"
        ↓
5. User clicks "Files" in breadcrumb
        ↓
6. Returns to root directory
```

### Moving Files (Drag and Drop)

```
1. User drags file from list
        ↓
2. File becomes semi-transparent (dragging state)
        ↓
3. User hovers over target folder
        ↓
4. Folder highlights (drop zone active)
        ↓
5. User drops file on folder
        ↓
6. API POST /api/files/move {file_id, folder_id}
        ↓
7. File disappears from current view
```

### Uploading to Folder

```
1. User selects file on upload page
        ↓
2. User opens folder dropdown
        ↓
3. User selects "Documents" folder
        ↓
4. User clicks [Upload File]
        ↓
5. API POST /api/upload (includes folder_id)
        ↓
6. File is created in Documents folder
```

## Mobile View Differences

### Mobile Dashboard (< 768px)

```
┌──────────────────────────┐
│  Dashboard         🚪    │
│  user@example.com         │
├──────────────────────────┤
│  👑 Free Plan            │
│  5 uploads/day, 500MB max│
│  [Upgrade]               │
├──────────────────────────┤
│  Your Files              │
│  [+ New Folder]          │
│  🏠 Files                │
├──────────────────────────┤
│  📁 Documents        ⋮   │
│     Folder               │
├──────────────────────────┤
│  📁 Photos           ⋮   │
│     Folder               │
├──────────────────────────┤
│  📄 example.pdf          │
│     /example-pdf         │
│     2.5 MB • Jan 20      │
│     👁 5  ⬇ 2           │
│     [📋][🔗][📊][🗑]    │
└──────────────────────────┘
```

### Mobile Optimizations

1. **Larger Touch Targets**: 44px minimum
2. **Stacked Layout**: Full width elements
3. **Bottom Navigation**: Fixed bottom bar (existing)
4. **Swipe Gestures**: Natural scrolling
5. **Active Feedback**: Scale on press
6. **Simplified Icons**: Larger, clearer icons

## Color Scheme

### Folders
- Background: `bg-primary/10` (amber with 10% opacity)
- Icon: `text-primary` (warm amber #f5c842)
- Hover: `hover:bg-muted/30`

### Files
- Background: Transparent
- Icon: `text-primary`
- Hover: `hover:bg-muted/30`

### Active States
- Scale: `active:scale-[0.98]`
- Transition: `transition-all duration-300`

## Accessibility Features

1. **Keyboard Navigation**
   - Tab through interactive elements
   - Enter to open folders/dialogs
   - Escape to close dialogs

2. **Screen Reader Support**
   - Semantic HTML (buttons, links)
   - ARIA labels on icons
   - Descriptive text for actions

3. **Touch Accessibility**
   - 44px minimum touch targets
   - Visual feedback on touch
   - No hover-only features

4. **Visual Clarity**
   - High contrast icons
   - Clear folder vs file distinction
   - Breadcrumb navigation always visible

## Performance Considerations

1. **Lazy Loading**: Only fetch current folder contents
2. **Client-Side Navigation**: No page reload when opening folders
3. **Optimistic Updates**: Immediate UI feedback before API response
4. **Efficient Queries**: Index on folder_id and user_id

## State Management

### Local State (React useState)
- Current folder ID
- Folders array
- Files array
- Breadcrumb path
- Dialog open/close states
- Loading states
- Dragged file ID

### Server State (API Calls)
- Fetch folders on mount and folder change
- Fetch files on mount and folder change
- Create/rename/delete folder API calls
- Move file API call

### Derived State
- Breadcrumb path (built from current folder ID)
- Empty state (computed from folders/files length)
- Loading state (during API calls)

## Error Handling Examples

### Creating Duplicate Folder
```
┌────────────────────────────────────┐
│  Create New Folder            ✕    │
├────────────────────────────────────┤
│  Folder Name                        │
│  ┌────────────────────────────────┐│
│  │ Documents                      ││
│  └────────────────────────────────┘│
│                                     │
│  ⚠️ A folder with this name        │
│     already exists here             │
│                                     │
│            [Cancel]  [Create Folder]│
└────────────────────────────────────┘
```

### Deleting Non-Empty Folder
```
┌─────────────────────────────────────┐
│  Error                               │
├─────────────────────────────────────┤
│  Cannot delete folder with files.    │
│  Move or delete files first.         │
│                                      │
│                    [OK]              │
└─────────────────────────────────────┘
```

## Summary of User-Visible Changes

✅ Folder icons in file list
✅ "New Folder" button in dashboard
✅ Breadcrumb navigation
✅ Folder dropdown in upload form
✅ Drag-and-drop file organization
✅ Rename and delete folder actions
✅ Visual distinction between folders and files
✅ Touch-optimized for mobile
✅ Smooth animations and transitions
