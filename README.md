# Construction Cost Tracker

A Spring Boot + Angular application for tracking construction costs across different project cases.

## Tech Stack

### Backend
- **Spring Boot 3.2.5** (Java 21)
- **Gradle** for dependency management
- **Spring Data JPA** + **Spring JDBC Template**
- **H2 in-memory database** (with provisions for Oracle)
- **H2 Console** accessible at `http://localhost:8080/h2-console`

### Frontend
- **Angular 17**
- **AG Grid Community** for data display and editing

## Running the Application

### Backend (Port 8080)
```bash
cd backend
./gradlew bootRun
```

### Frontend (Port 4200)
```bash
cd frontend
npm install
ng serve
```

### H2 Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/costtracker_db`
- Username: `sa`
- Password: (leave empty)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | Get all cases |
| GET | `/api/cases/{id}` | Get case by ID |
| POST | `/api/cases` | Create new case |
| GET | `/api/line-items` | Get all line items |
| GET | `/api/cases/{caseId}/line-items` | Get line item data for a case |
| PUT | `/api/cases/{caseId}/line-items/{lineItemId}` | Update a line item for a case |
| PUT | `/api/cases/{caseId}/line-items` | Batch update line items for a case |

## Database Schema

- **line_items** - Static lookup table for construction line items (13 rows)
- **cases** - Case/project information (CaseId, CaseName, CaseContact)
- **case_line_item_data** - Editable cost data per line item per case
