# Travel Planner Task Prompts

This directory contains detailed AI implementation prompts for each task in the travel planner project. Each file contains step-by-step prompts that can be given to an AI engine (like Cursor) to implement the specific task.

## 📁 Available Task Files

### 🏗️ **Phase 1: Project Setup & Foundation**

- **[01_preserve_restructure_poc.md](./01_preserve_restructure_poc.md)** - Preserve & Restructure Existing PoC
  - **Estimated Time:** 2-3 hours
  - **Priority:** High
  - **Dependencies:** None
  - **Description:** Restructure existing PoC code into proper project structure while preserving calendar functionality

- **[02_database_schema_setup.md](./02_database_schema_setup.md)** - Database Schema Setup
  - **Estimated Time:** 1-2 hours
  - **Priority:** High
  - **Dependencies:** Task 1.1
  - **Description:** Create SQLite database with all tables and initial data

- **[03_backend_server_foundation.md](./03_backend_server_foundation.md)** - Backend Server Foundation
  - **Estimated Time:** 2-3 hours
  - **Priority:** High
  - **Dependencies:** Task 1.2
  - **Description:** Set up basic Express.js server with database connection

### 🎨 **Phase 2: Core Backend API**

- **[04_travel_crud_api.md](./04_travel_crud_api.md)** - Travel CRUD API
  - **Estimated Time:** 3-4 hours
  - **Priority:** High
  - **Dependencies:** Task 1.3
  - **Description:** Implement complete CRUD API for travels with soft delete support

- **[05_connect_calendar_backend.md](./05_connect_calendar_backend.md)** - Connect Existing Calendar to Backend
  - **Estimated Time:** 2-3 hours
  - **Priority:** High
  - **Dependencies:** Task 3.3
  - **Description:** Connect existing timeline calendar to backend API while preserving functionality

- **[06_event_crud_api.md](./06_event_crud_api.md)** - Event CRUD API
  - **Estimated Time:** 3-4 hours
  - **Priority:** High
  - **Dependencies:** Task 2.1
  - **Description:** Implement complete CRUD API for events with soft delete support

- **[07_event_types_api.md](./07_event_types_api.md)** - Event Types API
  - **Estimated Time:** 2-3 hours
  - **Priority:** Medium
  - **Dependencies:** Task 2.2
  - **Description:** Implement CRUD API for event types with soft delete support

- **[08_file_upload_api.md](./08_file_upload_api.md)** - File Upload API
  - **Estimated Time:** 3-4 hours
  - **Priority:** Medium
  - **Dependencies:** Task 2.3
  - **Description:** Implement file upload functionality for event attachments

### 🎯 **Phase 3: Frontend Foundation**

- **[09_api_service_layer.md](./09_api_service_layer.md)** - API Service Layer
  - **Estimated Time:** 2-3 hours
  - **Priority:** High
  - **Dependencies:** Task 2.4
  - **Description:** Create frontend API service layer for communicating with backend

- **[10_ui_components.md](./10_ui_components.md)** - Basic UI Components
  - **Estimated Time:** 3-4 hours
  - **Priority:** Medium
  - **Dependencies:** Task 3.1
  - **Description:** Create reusable UI components for the application

- **[11_react_structure_routing.md](./11_react_structure_routing.md)** - React App Structure & Routing
  - **Estimated Time:** 2-3 hours
  - **Priority:** High
  - **Dependencies:** Task 3.2
  - **Description:** Set up basic React application structure with routing while preserving existing calendar

## 🚀 **How to Use These Prompts**

### **For AI Implementation (Cursor)**
1. **Open the specific task file** you want to implement
2. **Copy the relevant prompt** from the file
3. **Paste into Cursor** and ask the AI to implement it
4. **Follow the prompts sequentially** within each task
5. **Verify implementation** against acceptance criteria

### **For Manual Implementation**
1. **Read through all prompts** in the task file
2. **Understand the requirements** and acceptance criteria
3. **Implement step by step** following the prompts
4. **Test thoroughly** after each step
5. **Check off acceptance criteria** as you complete them

## 📋 **Task Dependencies**

```
Phase 1: Foundation
├── 1.1: Preserve & Restructure Existing PoC
├── 1.2: Database Schema (depends on 1.1)
└── 1.3: Backend Server (depends on 1.2)

Phase 2: Backend API
├── 2.1: Travel CRUD (depends on 1.3)
├── 2.2: Event CRUD (depends on 2.1)
├── 2.3: Event Types (depends on 2.2)
└── 2.4: File Upload (depends on 2.3)

Phase 3: Frontend Foundation
├── 3.1: API Service (depends on 2.4)
├── 3.2: UI Components (depends on 3.1)
└── 3.3: React Structure (depends on 3.2)

Phase 4: Calendar Enhancement
├── 4.1: Connect Calendar to Backend (depends on 3.3)
├── 4.2: Enhance Event Management (depends on 4.1)
└── 4.3: Calendar Customization (depends on 4.2)
```

## 🎯 **Implementation Guidelines**

### **Before Starting a Task**
- [ ] **Check dependencies** - ensure previous tasks are complete
- [ ] **Read the full task file** - understand all requirements
- [ ] **Verify current state** - ensure you're building on correct foundation
- [ ] **Set up testing** - have a way to verify your implementation

### **During Implementation**
- [ ] **Follow prompts sequentially** - don't skip steps
- [ ] **Test after each major step** - catch issues early
- [ ] **Preserve existing functionality** - especially calendar features
- [ ] **Document changes** - for future reference and debugging

### **After Implementation**
- [ ] **Run all tests** - ensure nothing is broken
- [ ] **Verify acceptance criteria** - check off completed items
- [ ] **Test existing features** - ensure PoC still works
- [ ] **Document any issues** - for future developers

## 🔍 **Key Features of These Prompts**

### **Detailed Step-by-Step Instructions**
- Each prompt is broken down into specific, actionable steps
- Clear requirements and expected outcomes
- Code examples and response formats where appropriate

### **Preservation-Focused**
- All tasks emphasize preserving existing PoC functionality
- Clear instructions on what NOT to change
- Testing requirements to ensure nothing breaks

### **AI-Optimized**
- Prompts are written specifically for AI engines
- Clear, unambiguous instructions
- Expected output formats specified
- Error handling requirements included

### **Comprehensive Coverage**
- All acceptance criteria covered
- File creation/modification requirements specified
- Testing and validation steps included
- Important notes and warnings highlighted

## 📚 **Additional Resources**

- **[../tasks.md](../tasks.md)** - Main task breakdown document
- **[../TECHNICAL_SYSTEM_DESIGN.md](../TECHNICAL_SYSTEM_DESIGN.md)** - Technical system design
- **[../README.md](../README.md)** - Project overview and setup

## 🚨 **Important Notes**

- **Always test existing functionality** after making changes
- **Preserve the existing calendar PoC** - it's the foundation
- **Follow dependencies strictly** - don't skip required tasks
- **Test thoroughly** - each task builds on previous work
- **Document everything** - for future development and debugging

---

**Start with Task 1.1** and work through the phases sequentially. Each task file contains everything needed to implement that specific task successfully.

## 📊 **Current Progress**

### **Completed Tasks (11/25)**
- ✅ **Phase 1**: All 3 tasks complete
- ✅ **Phase 2**: All 4 tasks complete  
- ✅ **Phase 3**: All 3 tasks complete
- 🔄 **Phase 4**: 1/3 tasks complete
- ⏳ **Phase 5**: 0/3 tasks (pending)
- ⏳ **Phase 6**: 0/2 tasks (pending)
- ⏳ **Phase 7**: 0/2 tasks (pending)
- ⏳ **Phase 8**: 0/2 tasks (pending)

### **Next Steps**
Continue with **Phase 4: Calendar Enhancement** tasks:
- Task 4.2: Enhance Event Management in Existing Calendar
- Task 4.3: Calendar Customization & Advanced Features

Then proceed to **Phase 5: Travel Management** tasks.
