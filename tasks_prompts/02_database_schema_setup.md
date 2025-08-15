# Task 1.2: Database Schema Setup

## Task Overview
**Estimated Time:** 1-2 hours  
**Priority:** High  
**Dependencies:** Task 1.1

**Description:** Create the SQLite database with all tables and initial data.

## AI Implementation Prompts

### Prompt 1: Create Database Schema
```
Create a comprehensive SQLite database schema for the travel planner application:

1. Create the following tables with proper structure:

   **travels table:**
   - id (INTEGER PRIMARY KEY AUTOINCREMENT)
   - title (TEXT NOT NULL)
   - description (TEXT)
   - start_date (TEXT NOT NULL) - ISO date string
   - end_date (TEXT NOT NULL) - ISO date string
   - destination (TEXT)
   - is_deleted (INTEGER DEFAULT 0) - 0 = active, 1 = deleted
   - deleted_at (TEXT) - ISO datetime string when soft deleted
   - created_at (TEXT DEFAULT (datetime('now')))
   - updated_at (TEXT DEFAULT (datetime('now')))

   **event_types table:**
   - id (INTEGER PRIMARY KEY AUTOINCREMENT)
   - name (TEXT NOT NULL)
   - category (TEXT NOT NULL) - accommodation, transportation, activity, food, etc.
   - color (TEXT NOT NULL) - hex color code
   - icon (TEXT)
   - is_deleted (INTEGER DEFAULT 0)
   - deleted_at (TEXT)
   - created_at (TEXT DEFAULT (datetime('now')))
   - updated_at (TEXT DEFAULT (datetime('now')))

   **events table:**
   - id (INTEGER PRIMARY KEY AUTOINCREMENT)
   - travel_id (INTEGER NOT NULL)
   - title (TEXT NOT NULL)
   - description (TEXT)
   - event_type_id (INTEGER NOT NULL)
   - start_datetime (TEXT NOT NULL) - ISO datetime string
   - end_datetime (TEXT NOT NULL) - ISO datetime string
   - location (TEXT)
   - is_deleted (INTEGER DEFAULT 0)
   - deleted_at (TEXT)
   - created_at (TEXT DEFAULT (datetime('now')))
   - updated_at (TEXT DEFAULT (datetime('now')))
   - FOREIGN KEY (travel_id) REFERENCES travels(id) ON DELETE CASCADE
   - FOREIGN KEY (event_type_id) REFERENCES event_types(id)

   **event_attachments table:**
   - id (INTEGER PRIMARY KEY AUTOINCREMENT)
   - event_id (INTEGER NOT NULL)
   - file_name (TEXT NOT NULL)
   - file_path (TEXT NOT NULL) - local file path
   - file_type (TEXT)
   - file_size (INTEGER)
   - is_deleted (INTEGER DEFAULT 0)
   - deleted_at (TEXT)
   - created_at (TEXT DEFAULT (datetime('now')))
   - FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE

2. Enable foreign key constraints
3. Create proper indexes for performance
4. Include soft delete indexes for better query performance
```

### Prompt 2: Create Performance Indexes
```
Create performance-optimized indexes for the database:

1. Create indexes for common query patterns:
   - idx_events_travel ON events(travel_id)
   - idx_events_datetime ON events(start_datetime)
   - idx_events_type ON events(event_type_id)

2. Create soft delete indexes:
   - idx_travels_deleted ON travels(is_deleted)
   - idx_events_deleted ON events(is_deleted)
   - idx_event_types_deleted ON event_types(is_deleted)
   - idx_event_attachments_deleted ON event_attachments(is_deleted)

3. Create composite indexes for complex queries:
   - idx_events_travel_datetime ON events(travel_id, start_datetime)
   - idx_events_travel_type ON events(travel_id, event_type_id)

4. Ensure indexes support the existing calendar query patterns
```

### Prompt 3: Insert Default Event Types
```
Insert default event types that will work with the existing calendar:

1. Insert the following event types with appropriate colors and icons:
   - Accommodation: #28a745 (green) with 🏨 icon
   - Transportation: #17a2b8 (blue) with ✈️ icon
   - Activity: #ffc107 (yellow) with 🎯 icon
   - Food: #fd7e14 (orange) with 🍽️ icon
   - Shopping: #6f42c1 (purple) with 🛍️ icon
   - Entertainment: #e83e8c (pink) with 🎭 icon

2. Ensure colors match or complement existing calendar styling
3. Use emojis that are widely supported across platforms
4. Set appropriate categories for filtering and organization
```

### Prompt 4: Create Sample Data
```
Create sample data that demonstrates the calendar functionality:

1. Create a sample travel:
   - Title: "Sample Paris Trip"
   - Description: "A weekend getaway to Paris"
   - Start Date: 2024-06-15
   - End Date: 2024-06-17
   - Destination: "Paris, France"

2. Create sample events that work with the existing calendar:
   - Event 1: "Flight to Paris" (Transportation) - 2024-06-15 08:00-10:00
   - Event 2: "Hotel Check-in" (Accommodation) - 2024-06-15 11:00-12:00
   - Event 3: "Eiffel Tower Visit" (Activity) - 2024-06-15 14:00-16:00
   - Event 4: "Dinner at Bistro" (Food) - 2024-06-15 19:00-21:00
   - Event 5: "Louvre Museum" (Activity) - 2024-06-16 10:00-13:00
   - Event 6: "Shopping at Champs-Élysées" (Shopping) - 2024-06-16 15:00-17:00
   - Event 7: "Flight Home" (Transportation) - 2024-06-17 18:00-20:00

3. Ensure events span different times to test calendar display
4. Use realistic durations and times
5. Test that events display correctly in the existing calendar
```

### Prompt 5: Create Database Views
```
Create optional database views for easier querying:

1. Create views for active records only:
   - active_travels: SELECT * FROM travels WHERE is_deleted = 0
   - active_events: SELECT * FROM events WHERE is_deleted = 0
   - active_event_types: SELECT * FROM event_types WHERE is_deleted = 0
   - active_event_attachments: SELECT * FROM event_attachments WHERE is_deleted = 0

2. Create views for common joins:
   - events_with_types: JOIN events and event_types
   - travels_with_event_count: travels with count of events
   - events_with_attachments: events with attachment count

3. Ensure views support existing calendar data requirements
4. Test view performance with sample data
```

### Prompt 6: Database Setup Scripts
```
Create database setup and management scripts:

1. Create database/schema.sql with all table definitions
2. Create database/sample_data.sql with initial data
3. Create database/setup.sh script for easy database initialization
4. Create database/README.md with setup instructions
5. Include database backup and restore scripts
6. Add database migration scripts for future schema changes
7. Create database validation scripts to check data integrity
```

## Acceptance Criteria Checklist
- [ ] Create `database/schema.sql` with all table definitions
- [ ] Include soft delete fields (`is_deleted`, `deleted_at`) on all tables
- [ ] Create proper indexes for performance
- [ ] Insert default event types (accommodation, transportation, activity, etc.)
- [ ] Create sample travel and events for testing
- [ ] Document database setup process
- [ ] Ensure sample data includes events that work with existing calendar

## Files to Create/Modify
- `database/schema.sql`
- `database/sample_data.sql`
- `database/README.md`
- `database/setup.sh`
- `database/migrations/` (directory)

## Important Notes
- **Ensure event format matches existing calendar requirements**
- **Test that sample events display correctly in the calendar**
- **Use colors that complement existing calendar styling**
- **Create realistic sample data for testing**
- **Document all database setup steps clearly**
- **Include soft delete functionality from the start**
