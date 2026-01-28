# DishDay - Major Update Changelog

## 🌟 Major Features Added

### 📸 Image Upload System
- **Drag & drop and click upload** functionality for all photos
- **Automatic image resizing** to 800x800px with 85% JPEG quality
- **Local storage** in `server/data/images/` directory
- **New ImageUpload component** with preview and overlay
- Images no longer use external URLs (Unsplash)

### 🗒️ Notes Field
- Added **notes field** to all entities:
  - Stores
  - Products
  - Recipes
- Displayed as textarea in all forms
- Stored in database with migration

### 🎨 UI/UX Improvements

#### Navigation
- **Improved swipe navigation** with cubic-bezier easing
- **Per-tab scroll behavior** - each tab manages its own scroll independently
- **Smoother transitions** between tabs (300ms cubic-bezier)

#### Forms & Inputs
- **Labels inside inputs** as placeholders
- **Toggle buttons** instead of checkboxes
- **Toggle button groups** for selects (units, stores, meal types, status)
- **Auto-save** in edit mode (no validation button needed)

#### Meals Tab
- **No ingredients list** displayed in meal suggestion
- **Updated time ranges**:
  - 4h-11h: Breakfast
  - 11h-18h: Lunch
  - 18h-4h: Dinner
- **Smart filtering**: Only suggests recipes with all ingredients available (not in "to buy" list)
- **Double-click on recipe photo** triggers new suggestion
- **Flip animation** on new suggestion (600ms)
- **Image-only grid display** for shopping list and recent items
- **Live search** shows results in shopping list or recent items sections
- **Recipe detail modal** on single click

#### Shopping & Recipes Tabs
- **Click on recipe photo** anywhere opens detail modal with full info
- All modals include **image upload functionality**

### 🌍 Complete English Translation
- **All UI text** translated to English
- **Database schema** in English
- **API endpoints** documentation in English
- **Seed data** with English product/recipe names
- **Code comments** and documentation in English

### 🔧 Backend Improvements
- **Image upload API** endpoint (`/api/upload`)
- **Multer** for file handling
- **Sharp** for image processing
- **Static file serving** for `/images` route
- **Notes field** support in all CRUD operations
- **Improved meal suggestion algorithm**:
  - Filters by available ingredients
  - Excludes recipes with "to buy" ingredients
  - 7-day history to avoid repetition

## 📦 New Components

### Frontend
- `ImageUpload.js` - Drag & drop image upload with preview
- `ToggleButton.js` - Reusable toggle button component
- Updated all existing components with new features

### Backend
- Image upload endpoint with Sharp processing
- Enhanced API with notes field support

## 🗄️ Database Changes

### New Migration: `20240128200000_add_notes`
```sql
ALTER TABLE "Store" ADD COLUMN "notes" TEXT;
ALTER TABLE "Product" ADD COLUMN "notes" TEXT;
ALTER TABLE "Recipe" ADD COLUMN "notes" TEXT;
```

## 📋 File Structure Changes

```
server/data/
├── dishday.db          # SQLite database
├── images/             # Uploaded images (NEW)
│   ├── store-*.jpg
│   ├── product-*.jpg
│   └── recipe-*.jpg
```

## 🐳 Docker Updates
- Image directory creation in Dockerfile
- Multer and Sharp dependencies added
- Updated seed data with English content

## 🎯 Key Behavior Changes

### Meal Suggestions
- **Before**: Showed all ingredients with stock status
- **After**: Only shows prep/cook time, filters by available ingredients

### Photo Management
- **Before**: External URLs (Unsplash)
- **After**: Local uploads with drag & drop

### Forms
- **Before**: Labels above inputs, checkboxes, dropdowns
- **After**: Placeholders inside inputs, toggle buttons, auto-save

### Navigation
- **Before**: Basic swipe with standard easing
- **After**: Smooth cubic-bezier transitions, per-tab scroll

## 🚀 How to Use New Features

### Upload Images
1. Click on any photo area in modals
2. Or drag & drop an image file
3. Image automatically uploads and resizes
4. Changes save automatically in edit mode

### Toggle Buttons
- Click to select/deselect
- Visual feedback with blue highlight
- Works for: units, stores, meal types, status

### Meal Suggestions
- Single click photo: View recipe details
- Double click photo: Get new suggestion
- Flip animation on new suggestion

### Shopping List
- Grid view with product images only
- Click to add/remove from list
- Search shows live results

## 📝 Notes

All modifications maintain:
- ✅ Dark mode design
- ✅ Mobile-first responsive layout
- ✅ Smooth animations
- ✅ Data persistence
- ✅ Docker compatibility

## 🔄 Migration Path

To update existing installation:
1. Stop Docker container
2. Pull latest code
3. Rebuild Docker image
4. Database migrations apply automatically
5. Old data preserved (photos will be null until uploaded)
