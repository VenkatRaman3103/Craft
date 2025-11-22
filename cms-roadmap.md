# CMS Features

### **1. Project Management**

**1.1 Project Creation**
- Create new project
- Project name + slug
- Project description
- Project settings (timezone, locale)

**1.2 Project Dashboard**
- List all projects user has access to
- Search/filter projects
- Recently accessed projects
- Project stats (collections count, entries count, storage used)

**1.3 Project Settings**
- Rename project
- Delete project (with confirmation)
- Transfer ownership
- Archive/unarchive project

---

### **2. User & Team Management**

**2.1 Authentication**
- Sign up (email + password)
- Login
- Logout
- Password reset
- Email verification
- Social login (Google, GitHub - optional)

**2.2 User Profile**
- Edit name
- Change email
- Change password
- Upload avatar
- Account settings

**2.3 Team Collaboration**
- Invite team members (via email)
- Remove team members
- Resend invitation
- View pending invitations
- Accept/decline invitation

**2.4 Role-Based Access Control**
- **Admin**: Full access (manage team, collections, content, settings)
- **Editor**: Create/edit/delete content, create collections
- **Viewer**: Read-only access
- Assign roles to team members
- Change member roles

---

### **3. Content Modeling (Schema Builder)**

**3.1 Collection Management**
- Create collection
- Edit collection name/slug
- Delete collection (with confirmation)
- Duplicate collection
- Archive collection
- Collection description
- Collection icon/color (visual organization)

**3.2 Field Types**
Must support these field types:

**Text Fields:**
- **Text** (single line, max 255 chars)
- **Textarea** (multi-line, no formatting)
- **Rich Text** (formatted content with TipTap)
- **Markdown** (markdown editor)

**Number Fields:**
- **Number** (integer or decimal)
- **Currency** (with currency selector)
- **Percentage**

**Selection Fields:**
- **Select** (dropdown, single choice)
- **Radio** (single choice, visible options)
- **Checkbox** (multiple choices)
- **Tags** (free-form tags, multiple)

**Date/Time Fields:**
- **Date** (date picker)
- **DateTime** (date + time picker)
- **Time** (time picker)

**Media Fields:**
- **Image** (single image upload)
- **File** (any file type)
- **Gallery** (multiple images)
- **Video** (video upload or embed URL)

**Relationship Fields:**
- **Relation** (link to another collection)
  - One-to-one
  - One-to-many
  - Many-to-many
- **Self-reference** (link to same collection)

**Boolean Fields:**
- **Toggle** (yes/no, true/false)

**Special Fields:**
- **JSON** (raw JSON data)
- **Code** (code editor with syntax highlighting)
- **Color** (color picker)
- **URL** (with validation)
- **Email** (with validation)
- **Phone** (with validation)

**Nested Fields:** (Your differentiator!)
- **Group** (group multiple fields together)
- **Repeater** (repeatable group of fields)
- **Nested Collection** (embed entire collection structure)

**3.3 Field Configuration**
For each field:
- Field name (label)
- Field key (slug/identifier)
- Field type
- Required/optional
- Default value
- Help text/description
- Placeholder text
- Validation rules:
  - Min/max length (text)
  - Min/max value (numbers)
  - Regex pattern
  - Custom validation message
- Conditional logic (show/hide based on other fields)
- Field position (reorder via drag-and-drop)

**3.4 Collection Options**
- Enable/disable drafts
- Enable/disable versioning
- Enable/disable timestamps (created_at, updated_at)
- Enable/disable soft delete
- Enable/disable comments
- Set default sort field
- Set default sort order
- Display field (which field to show in lists)
- Search fields (which fields are searchable)

**3.5 Collection Templates**
Pre-built collection templates:
- Blog Post (title, slug, body, author, date, featured image, categories, tags)
- Page (title, slug, content, SEO fields)
- Author (name, bio, avatar, social links)
- Category (name, slug, description)
- Product (name, description, price, images, SKU)
- FAQ (question, answer, category)
- Testimonial (author, content, rating, image)

---

### **4. Content Management**

**4.1 Content Entry List**
- View all entries in a collection
- Table view with customizable columns
- Grid view (for image-heavy content)
- Search entries (across searchable fields)
- Filter entries:
  - By field values
  - By status (draft/published)
  - By date range
  - By author
  - By tags/categories
- Sort entries (by any field)
- Bulk actions:
  - Bulk delete
  - Bulk publish
  - Bulk unpublish
  - Bulk duplicate
- Pagination
- Entries per page setting
- Export entries (CSV, JSON)

**4.2 Content Entry Editor**
- Auto-generated form based on collection schema
- Field validation (real-time)
- Required field indicators
- Field help text display
- Conditional field display
- Tabbed interface (for many fields)
- Sidebar for metadata (status, author, dates)

**4.3 Entry Actions**
- Create new entry
- Edit existing entry
- Duplicate entry
- Delete entry (move to trash)
- Restore from trash
- Permanently delete

**4.4 Draft/Publish System**
- Save as draft
- Publish entry
- Unpublish (back to draft)
- Schedule publish (publish at specific date/time)
- Preview draft (before publishing)
- Draft indicator (visual badge)

**4.5 Auto-save**
- Auto-save drafts every 30 seconds
- "Saving..." indicator
- "All changes saved" indicator
- Restore from auto-save if browser crashes

**4.6 Entry Metadata**
Auto-tracked for each entry:
- Created by (user)
- Created at (timestamp)
- Updated by (user)
- Updated at (timestamp)
- Published by (user)
- Published at (timestamp)
- Status (draft/published)

---

### **5. Rich Text Editor**

**5.1 Text Formatting**
- Bold, italic, underline, strikethrough
- Headings (H1-H6)
- Paragraph
- Blockquote
- Code inline
- Code block (with syntax highlighting)
- Subscript, superscript

**5.2 Lists**
- Bullet list
- Numbered list
- Task list (checkboxes)
- Nested lists

**5.3 Links**
- Insert link
- Edit link
- Remove link
- Open in new tab option
- Link to other entries (internal links)

**5.4 Media**
- Insert image (from media library or URL)
- Image alignment (left, center, right)
- Image caption
- Image alt text
- Resize image
- Insert video embed (YouTube, Vimeo, etc.)

**5.5 Tables**
- Insert table
- Add/remove rows
- Add/remove columns
- Merge cells
- Table header row

**5.6 Advanced**
- Horizontal rule
- Insert HTML (raw HTML mode)
- Markdown shortcuts (## for H2, ** for bold, etc.)
- Undo/redo
- Word count
- Character count
- Full-screen mode
- Distraction-free mode

**5.7 Content Blocks** (Your differentiator!)
- Insert reusable content blocks
- Create new block from selection
- Update block (updates everywhere)
- Variables/placeholders (e.g., {{site_name}})

---

### **6. Media Library**

**6.1 Media Upload**
- Upload single file
- Upload multiple files (batch)
- Drag-and-drop upload
- Paste image from clipboard
- Upload via URL
- Supported formats:
  - Images: JPG, PNG, GIF, WebP, SVG
  - Documents: PDF, DOC, DOCX, XLS, XLSX
  - Videos: MP4, MOV, AVI
  - Audio: MP3, WAV
- File size limits (configurable)
- Progress indicator
- Upload queue

**6.2 Media Organization**
- Folder structure
- Create folders
- Move files between folders
- Rename files
- Delete files (move to trash)
- Restore from trash
- Tag files
- Search files (by name, tags)
- Filter files (by type, date, folder)
- Sort files (by name, date, size)

**6.3 Media Details**
- File name
- File size
- Dimensions (for images)
- Upload date
- Uploaded by
- File URL (copyable)
- Preview (for images/videos)
- Edit metadata:
  - Title
  - Alt text
  - Caption
  - Tags

**6.4 Image Editing** (Basic)
- Crop
- Resize
- Rotate
- Flip horizontal/vertical
- Adjust brightness/contrast (optional)

**6.5 Media Selection**
- Media picker modal (used in content fields)
- Grid view
- List view
- Search within picker
- Upload new file from picker
- Select multiple files
- Recently used files

**6.6 Storage**
- Cloud storage (S3, R2, or similar)
- Automatic image optimization
- Generate thumbnails (multiple sizes)
- Lazy loading
- CDN integration

---

### **7. Content Versioning**

**7.1 Version History**
- View all versions of an entry
- Compare versions (side-by-side diff)
- Restore to previous version
- Version metadata:
  - Version number
  - Created at
  - Created by
  - Changes summary

**7.2 Version Management**
- Auto-create version on save
- Keep last X versions (configurable, default 20)
- Manual version creation (save checkpoint)
- Delete old versions (automatically or manually)

---

### **8. Content Relationships**

**8.1 Relationship Configuration**
When adding relationship field:
- Select target collection
- Relationship type:
  - One-to-one (single selection)
  - One-to-many (multiple selection)
  - Many-to-many (bidirectional)
- Display field (which field to show in picker)
- Filter options (limit available entries)

**8.2 Relationship UI**
- Search and select related entries
- Create new related entry (inline)
- View related entry (preview)
- Edit related entry (inline or open)
- Remove relationship
- Reorder relationships (for one-to-many)

**8.3 Relationship API**
- Populate relationships (nested data)
- Depth control (how many levels deep)
- Select specific fields from relationships
- Reverse relationships (find entries that link to this)

---

### **9. API System**

**9.1 Auto-Generated REST API**
For each collection, auto-generate:

**GET** `/api/projects/{project_id}/collections/{collection_slug}`
- Get all entries
- Query params:
  - `limit` (pagination)
  - `offset` (pagination)
  - `sort` (sort field)
  - `order` (asc/desc)
  - `filter` (filter by field values)
  - `search` (full-text search)
  - `populate` (include relationships)
  - `fields` (select specific fields)

**GET** `/api/projects/{project_id}/collections/{collection_slug}/{entry_id}`
- Get single entry
- Query params:
  - `populate` (include relationships)
  - `fields` (select specific fields)

**POST** `/api/projects/{project_id}/collections/{collection_slug}`
- Create new entry
- Body: entry data (JSON)
- Validate against schema
- Return created entry

**PUT** `/api/projects/{project_id}/collections/{collection_slug}/{entry_id}`
- Update entry
- Body: updated data (JSON)
- Partial updates supported
- Return updated entry

**DELETE** `/api/projects/{project_id}/collections/{collection_slug}/{entry_id}`
- Delete entry
- Soft delete (move to trash) or hard delete
- Return success status

**9.2 API Authentication**
- API keys (per project)
- Create API key
- Revoke API key
- Key permissions (read-only, read-write)
- Rate limiting (per key)
- Usage tracking

**9.3 API Features**
- CORS configuration (allowed origins)
- API documentation (auto-generated)
  - Swagger/OpenAPI spec
  - Interactive API explorer
- Webhooks (trigger on events):
  - Entry created
  - Entry updated
  - Entry deleted
  - Entry published
- Response caching (configurable TTL)
- Error handling (consistent error format)

**9.4 GraphQL API** (Optional for MVP)
- Single endpoint
- Query language
- Type generation
- Introspection
- GraphQL playground

---

### **10. Search & Filtering**

**10.1 Global Search**
- Search across all collections
- Search in content fields
- Search in media files
- Search in collection names
- Recent searches
- Search shortcuts (keyboard)

**10.2 Advanced Filtering**
- Filter by multiple fields
- Filter operators:
  - Equals
  - Not equals
  - Contains
  - Does not contain
  - Starts with
  - Ends with
  - Greater than
  - Less than
  - Between (for dates/numbers)
  - Is empty
  - Is not empty
  - In (array)
  - Not in (array)
- Combine filters (AND/OR logic)
- Save filters (reusable)
- Filter presets

**10.3 Sorting**
- Sort by any field
- Multi-level sorting
- Custom sort order
- Save sort preferences

---

### **11. Localization/Internationalization** (Optional for MVP)

**11.1 Multi-Language Support**
- Enable localization per collection
- Define available locales (en, es, fr, etc.)
- Default locale
- Fallback locale

**11.2 Localized Content**
- Switch between locales in editor
- Translate entry to new locale
- Copy content from default locale
- Visual indicator of translated/untranslated fields
- Required fields per locale

**11.3 Localized API**
- Query by locale: `/api/...?locale=es`
- Return all locales
- Fallback to default if translation missing

---

### **12. Workflow & Publishing**

**12.1 Publishing Workflow**
- Draft → Review → Published states
- Request review (editor → admin)
- Approve/reject review
- Comments on review
- Publishing checklist (optional required fields)

**12.2 Scheduled Publishing**
- Schedule publish date/time
- Schedule unpublish date/time
- View scheduled entries
- Cancel scheduled publish

**12.3 Content Status**
- Draft (not published)
- Scheduled (publish date set)
- Published (live)
- Archived (unpublished but kept)
- Trashed (deleted, recoverable)

---

### **13. Activity & Audit Log**

**13.1 Activity Tracking**
Track all actions:
- Entry created/updated/deleted
- Collection created/updated/deleted
- User invited/removed
- Settings changed
- API key created/revoked
- Media uploaded/deleted

**13.2 Activity Display**
- Activity feed (chronological)
- Filter by:
  - User
  - Action type
  - Resource type
  - Date range
- Search activity
- Export activity log (CSV)

**13.3 Activity Details**
For each activity:
- User who performed action
- Timestamp
- Action type
- Resource type (collection, entry, etc.)
- Resource name
- Before/after values (for updates)

---

### **14. Comments & Collaboration** (Optional for MVP)

**14.1 Entry Comments**
- Add comment to entry
- Reply to comment (threaded)
- Edit comment
- Delete comment
- Mention users (@username)
- Notifications for mentions
- Mark comment as resolved

**14.2 Field Comments**
- Comment on specific field
- Show comment indicator on field
- Resolve field comments

---

### **15. Validation & Constraints**

**15.1 Field Validation**
- Required fields
- Min/max length (text)
- Min/max value (numbers)
- Regex pattern matching
- Email format validation
- URL format validation
- Phone number validation
- Date range validation
- File size limits
- File type restrictions
- Custom validation rules

**15.2 Unique Fields**
- Mark field as unique (no duplicates)
- Unique constraint validation
- Case-sensitive/insensitive option

**15.3 Conditional Validation**
- Field required only if another field has specific value
- Show/hide fields based on conditions

---

### **16. Import/Export**

**16.1 Import Content**
- Import from CSV
- Import from JSON
- Map CSV columns to fields
- Preview import
- Validate data before import
- Handle duplicates (skip, update, create)
- Import progress indicator
- Import error log

**16.2 Export Content**
- Export to CSV
- Export to JSON
- Select fields to export
- Filter before export
- Export with relationships
- Download exported file

**16.3 Import/Export Collections**
- Export collection schema (JSON)
- Import collection schema
- Duplicate collection with content

---

### **17. Trash & Recovery**

**17.1 Trash Management**
- View trashed entries
- View trashed media
- Restore from trash (single or bulk)
- Permanently delete (single or bulk)
- Auto-delete from trash after X days
- Empty trash (delete all)

---

### **18. Settings & Configuration**

**18.1 Project Settings**
- Project name
- Project slug
- Project description
- Project timezone
- Date format
- Time format
- Default language
- Project icon

**18.2 General Settings**
- Auto-save interval
- Version retention count
- Trash retention days
- Media upload limits
- Allowed file types
- Image optimization settings

**18.3 API Settings**
- CORS allowed origins
- Rate limiting
- Webhook endpoints
- API key management

**18.4 Notification Settings**
- Email notifications (on/off)
- Notification types:
  - New team member added
  - Review requested
  - Entry published
  - Mentioned in comment
  - Webhook failure

---

### **19. Permissions & Security**

**19.1 Granular Permissions** (Advanced)
Beyond basic roles, allow custom permissions:
- Collection-level permissions (who can access which collections)
- Field-level permissions (who can edit which fields)
- Entry-level permissions (who can edit which entries)

**19.2 API Security**
- API key rotation
- IP whitelist (for API keys)
- Request signing (HMAC)
- Rate limiting per key
- Audit log for API calls

**19.3 Content Security**
- Field encryption (for sensitive data)
- PII detection and handling
- Content moderation (flag inappropriate content)

---

### **20. Developer Features**

**20.1 API Documentation**
- Auto-generated docs
- Code examples (multiple languages)
- Try API directly from docs
- Schema reference
- Changelog

**20.2 Webhooks**
- Configure webhook URLs
- Select events to trigger
- Webhook payload format
- Retry logic (on failure)
- Webhook logs (success/failure)
- Webhook signatures (verify authenticity)

**20.3 SDK/Client Libraries** (Post-MVP)
- JavaScript/TypeScript SDK
- React hooks
- Python client
- PHP client

**20.4 CLI Tool** (Post-MVP)
- Create collection via CLI
- Import/export via CLI
- Deploy via CLI
- Manage API keys via CLI

---

### **21. Advanced Content Features**

- **Content templates**: Save entry as template, create new entries from template
- **Content snippets**: Reusable content blocks across entries
- **Content macros**: Shortcodes that expand to content
- **Conditional content**: Show/hide content based on rules
- **A/B testing**: Multiple versions of content, track performance

### **22. AI Features**

- **AI content suggestions**: Generate content ideas
- **AI writing assistant**: Help write/improve content
- **AI image tagging**: Auto-tag uploaded images
- **AI translation**: Auto-translate content to other languages
- **AI SEO suggestions**: Improve content for SEO

### **23. SEO Features**

- **SEO fields**: Meta title, meta description, OG tags
- **SEO preview**: How entry looks in search results
- **SEO score**: Analyze content for SEO
- **Sitemap generation**: Auto-generate XML sitemap
- **Robots.txt management**

### **24. Analytics**

- **Content analytics**: Views, engagement per entry
- **API usage analytics**: Track API calls, endpoints
- **User activity analytics**: Most active users
- **Search analytics**: Most searched terms

### **25. Integrations**

- **Zapier**: Trigger actions in other apps
- **Slack**: Notifications to Slack
- **GitHub**: Sync content with GitHub
- **Algolia**: Advanced search integration
- **CloudFlare**: CDN integration
- **Stripe**: For e-commerce content

---
