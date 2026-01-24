# Visual UI Guide - Dashboard Enhancements

## Dashboard Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER                                   │
│  Dashboard                                    [Upload] [⚙]  │
│  user@example.com                                           │
├─────────────────────────────────────────────────────────────┤
│                    PLAN BADGE                               │
│  👑 Free Plan                              [Upgrade]        │
│     5 uploads/day, 512MB max                                │
├─────────────────────────────────────────────────────────────┤
│  Your Files (25)                                            │
│  ┌─────────────────────────────────────────────────┐       │
│  │ 📷 Photos (15)  |  📄 Files (10)                │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  [PHOTOS TAB - Active]                                      │
│  ┌───────────────────────────────────────────────────┐     │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │     │
│  │  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │    │     │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │     │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │     │
│  │  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │    │     │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │     │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │     │
│  │  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │    │     │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Photos Tab - Grid View

### Desktop View (5 columns)
```
┌──────────────────────────────────────────────────────────────┐
│ 📷 Photos (15)  |  📄 Files (10)                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ ☑    │  │      │  │      │  │      │  │      │         │
│  │      │  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │         │
│  │ IMG  │  │      │  │      │  │      │  │      │         │
│  │      │  │ name │  │      │  │      │  │      │         │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘         │
│   ^hover                                                     │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │      │  │      │  │ ☑    │  │      │  │      │         │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │         │
│  │      │  │      │  │      │  │      │  │      │         │
│  │      │  │      │  │      │  │      │  │      │         │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘         │
│                       ^selected                              │
└──────────────────────────────────────────────────────────────┘
```

### Mobile View (2 columns)
```
┌─────────────────────────┐
│ 📷 Photos | 📄 Files    │
├─────────────────────────┤
│                         │
│  ┌─────────┐ ┌─────────┐│
│  │    ✓    │ │         ││
│  │  IMAGE  │ │  IMAGE  ││
│  │         │ │         ││
│  └─────────┘ └─────────┘│
│   ^selected              │
│                         │
│  ┌─────────┐ ┌─────────┐│
│  │         │ │    ✓    ││
│  │  IMAGE  │ │  IMAGE  ││
│  │         │ │         ││
│  └─────────┘ └─────────┘│
│                         │
│  ┌─────────┐ ┌─────────┐│
│  │  IMAGE  │ │  IMAGE  ││
│  │         │ │         ││
│  └─────────┘ └─────────┘│
│                         │
└─────────────────────────┘
```

## Files Tab - List View

### Desktop View
```
┌──────────────────────────────────────────────────────────────┐
│ 📷 Photos (15)  |  📄 Files (10)                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ☐ 📄 Annual Report.pdf                  [📋] [🔗] [📊] [🗑] │
│    /report-2024 · 2.5 MB · Jan 20, 2024                     │
│    👁 45    ⬇ 12                                             │
│ ─────────────────────────────────────────────────────────── │
│ ☑ 📄 Meeting Notes.txt 🔒              [📋] [🔗] [📊] [🗑] │
│    /notes-jan · 15 KB · Jan 19, 2024                        │
│    👁 8     ⬇ 3                                              │
│ ─────────────────────────────────────────────────────────── │
│ ☐ 📄 Presentation.pptx ⏰              [📋] [🔗] [📊] [🗑] │
│    /slides · 8.2 MB · Jan 18, 2024                          │
│    👁 23    ⬇ 7                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌─────────────────────────┐
│ 📷 Photos | 📄 Files    │
├─────────────────────────┤
│                         │
│ 📄 Report.pdf       ✓  │
│ /report · 2.5 MB        │
│ Jan 20, 2024            │
│ 👁 45  ⬇ 12             │
│─────────────────────────│
│ 📄 Notes.txt 🔒        │
│ /notes · 15 KB          │
│ Jan 19, 2024            │
│ 👁 8   ⬇ 3              │
│─────────────────────────│
│ 📄 Slides.pptx ⏰      │
│ /slides · 8.2 MB        │
│ Jan 18, 2024            │
│ 👁 23  ⬇ 7              │
│                         │
└─────────────────────────┘
```

## Selection Toolbar

### Desktop - Sticky Top Bar
```
┌──────────────────────────────────────────────────────────────┐
│ ✕  3 items selected     [Copy Links] [Download] [Delete]    │
├──────────────────────────────────────────────────────────────┤
│                     (Content below)                          │
│                                                              │
```

### Mobile - Fixed Bottom Bar
```
┌─────────────────────────┐
│                         │
│   (Content above)       │
│                         │
├─────────────────────────┤ <- Fixed at bottom
│ 3 items      [Clear]    │
│ ┌─────┐ ┌──────┐ ┌────┐│
│ │ 📋  │ │  ⬇   │ │ 🗑 ││
│ │Copy │ │ Down │ │Del ││
│ └─────┘ └──────┘ └────┘│
└─────────────────────────┘
```

## Image Preview Modal

### Desktop View
```
┌──────────────────────────────────────────────────────────────┐
│ Image Title.jpg                    3/15    [⬇] [🔗] [✕]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│ ◀                                                         ▶ │
│                    ┌──────────────┐                         │
│                    │              │                         │
│                    │    IMAGE     │                         │
│                    │   PREVIEW    │                         │
│                    │              │                         │
│                    └──────────────┘                         │
│                                                              │
│                                                              │
│                                                              │
│  Use ← → arrow keys to navigate                             │
│  Press ESC to close                                          │
└──────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌─────────────────────────┐
│ Title.jpg   3/15  [✕]  │
│                 [⬇][🔗]│
├─────────────────────────┤
│                         │
│                         │
│     ┌─────────┐         │
│     │         │         │
│     │  IMAGE  │         │
│     │         │         │
│     └─────────┘         │
│                         │
│                         │
│ Swipe ← or → to nav    │
├─────────────────────────┤
│     [◀]     [▶]        │
└─────────────────────────┘
```

## User Interaction Flows

### Flow 1: Desktop Multi-Select and Delete
```
1. User State: Viewing photos grid
   ┌──────┐  ┌──────┐  ┌──────┐
   │ IMG  │  │ IMG  │  │ IMG  │
   └──────┘  └──────┘  └──────┘

2. Long-press or click on photo
   ┌──────┐  ┌──────┐  ┌──────┐
   │ ☑    │  │ ☐    │  │ ☐    │
   │ IMG  │  │ IMG  │  │ IMG  │
   └──────┘  └──────┘  └──────┘
   ^selected
   
   Toolbar appears:
   ✕ 1 item selected    [Copy] [Download] [Delete]

3. Click additional photos
   ┌──────┐  ┌──────┐  ┌──────┐
   │ ☑    │  │ ☑    │  │ ☐    │
   │ IMG  │  │ IMG  │  │ IMG  │
   └──────┘  └──────┘  └──────┘
   
   ✕ 2 items selected   [Copy] [Download] [Delete]

4. Click Delete button
   ┌─────────────────────────────────┐
   │ Delete 2 files?                 │
   │ This action cannot be undone.   │
   │                                 │
   │        [Cancel]  [Delete]       │
   └─────────────────────────────────┘

5. After confirmation
   🎉 Deleted 2 files
   
   Photos refresh, selected items gone
   ┌──────┐  ┌──────┐  ┌──────┐
   │ IMG  │  │ IMG  │  │ IMG  │
   └──────┘  └──────┘  └──────┘
```

### Flow 2: Mobile Long-Press Selection
```
1. User viewing photos
   ┌─────┐ ┌─────┐
   │ IMG │ │ IMG │
   └─────┘ └─────┘

2. Long-press (500ms) on photo
   👆 (hold)
   ┌─────┐ ┌─────┐
   │ ✓   │ │     │
   │ IMG │ │ IMG │
   └─────┘ └─────┘
   
   ╔═══════════════════╗
   ║ 1 item   [Clear] ║
   ║ [📋] [⬇] [🗑]    ║
   ╚═══════════════════╝
   ^bottom toolbar

3. Tap additional photos
   👆 tap
   ┌─────┐ ┌─────┐
   │ ✓   │ │ ✓   │
   │ IMG │ │ IMG │
   └─────┘ └─────┘
   
   ╔═══════════════════╗
   ║ 2 items  [Clear] ║
   ║ [📋] [⬇] [🗑]    ║
   ╚═══════════════════╝

4. Tap Copy button
   👆
   ╔═══════════════════╗
   ║ [📋] [⬇] [🗑]    ║
   ╚═══════════════════╝
   
   🎉 Copied 2 links
   
   Selection cleared automatically
```

### Flow 3: Photo Preview Navigation
```
Desktop:
1. Click photo
   ┌──────┐
   │ IMG  │ → Click
   └──────┘
   
2. Opens full-screen
   ┌────────────────────────┐
   │ Image.jpg    1/15  [✕]│
   ├────────────────────────┤
   │                        │
   │ ◀   [  IMAGE  ]     ▶ │
   │                        │
   │  ← → arrows or keys   │
   └────────────────────────┘

3. Navigate with:
   - Arrow keys ← →
   - Click side arrows
   - ESC to close

Mobile:
1. Tap photo
   ┌─────┐
   │ IMG │ → Tap
   └─────┘
   
2. Opens full-screen
   ┌─────────────────┐
   │ Title  1/15 [✕]│
   ├─────────────────┤
   │                 │
   │   [  IMAGE  ]   │
   │                 │
   │ Swipe ← or →   │
   ├─────────────────┤
   │   [◀]   [▶]    │
   └─────────────────┘

3. Navigate with:
   - Swipe gestures
   - Bottom buttons
   - Tap X to close
```

## State Indicators

### Photo States
```
Normal:
┌──────┐
│      │
│ IMG  │
│      │
└──────┘

Hover (Desktop):
┌──────┐
│ name │ <- filename overlay
│ IMG  │
│      │
└──────┘

Selection Mode:
┌──────┐
│ ☐    │ <- checkbox visible
│ IMG  │
│      │
└──────┘

Selected:
┌──────┐
│ ☑    │ <- checked
│ IMG  │ <- slightly dimmed
│      │
└──────┘

Loading:
┌──────┐
│  ⏳  │ <- spinner
│      │
│      │
└──────┘
```

### File Item States
```
Normal:
📄 Document.pdf                    [📋] [🔗] [📊] [🗑]
/doc · 1.2 MB · Jan 20
👁 10  ⬇ 3

With Protection:
📄 Secure.pdf 🔒                  [📋] [🔗] [📊] [🗑]
/secure · 500 KB · Jan 19
👁 5   ⬇ 1

With Expiry:
📄 Temp.pdf ⏰                    [📋] [🔗] [📊] [🗑]
/temp · 200 KB · Jan 18
👁 2   ⬇ 0

Selection Mode:
☑ Document.pdf                          ✓
/doc · 1.2 MB · Jan 20
👁 10  ⬇ 3
```

## Toast Notifications

```
Success:
┌─────────────────────────┐
│ ✓ Copied 3 links       │
└─────────────────────────┘

┌─────────────────────────┐
│ ✓ Deleted 5 files      │
└─────────────────────────┘

┌─────────────────────────┐
│ ✓ Opening 2 files      │
└─────────────────────────┘

Error:
┌─────────────────────────┐
│ ✗ Failed to delete     │
│   some files           │
└─────────────────────────┘
```

## Responsive Breakpoints Visual

```
Mobile (< 640px):
┌─────────┐
│ 2 cols  │
│ ┌─┐ ┌─┐ │
│ └─┘ └─┘ │
│ ┌─┐ ┌─┐ │
│ └─┘ └─┘ │
└─────────┘

Tablet (640-768px):
┌───────────────┐
│   3 columns   │
│ ┌─┐ ┌─┐ ┌─┐  │
│ └─┘ └─┘ └─┘  │
│ ┌─┐ ┌─┐ ┌─┐  │
│ └─┘ └─┘ └─┘  │
└───────────────┘

Desktop (768-1024px):
┌─────────────────────┐
│    4 columns        │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐    │
│ └─┘ └─┘ └─┘ └─┘    │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐    │
│ └─┘ └─┘ └─┘ └─┘    │
└─────────────────────┘

Large Desktop (> 1024px):
┌─────────────────────────┐
│      5 columns          │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐   │
│ └─┘ └─┘ └─┘ └─┘ └─┘   │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐   │
│ └─┘ └─┘ └─┘ └─┘ └─┘   │
└─────────────────────────┘
```

## Color & Visual Design

```
Background:    ███ oklch(0.11 0.005 250)  Dark gray
Card:          ███ oklch(0.15 0.005 250)  Slightly lighter
Border:        ███ oklch(0.24 0.005 250)  Subtle borders
Text:          ███ oklch(0.97 0 0)        White
Muted:         ███ oklch(0.63 0.01 250)   Gray text

Primary:       ███ oklch(0.82 0.17 85)    Yellow/Amber
Primary Hover: ███ oklch(0.72 0.14 85)    Darker amber
Selected:      ▒▒▒ Primary with 10% alpha
Destructive:   ███ oklch(0.58 0.2 25)     Red

Checkmark:     ✓ Primary color on selected
Icons:         📄 Primary color for emphasis
Hover:         ░░░ Muted background (30% opacity)
```

## Summary

This visual guide demonstrates:
- ✅ Clean, modern UI design
- ✅ Clear visual hierarchy
- ✅ Intuitive interaction patterns
- ✅ Responsive layouts across devices
- ✅ Consistent design language
- ✅ Accessible color contrasts
- ✅ Touch-friendly mobile interface
- ✅ Professional appearance
