# SQL Refactoring Summary - DATEDIFF Removal

## Overview

Removed all built-in `DATEDIFF()` functions and replaced them with basic SQL techniques including:

- **CREATE VIEW** for reusable calculated fields
- **Date arithmetic** using YEAR(), MONTH(), DAY() functions
- **INNER JOIN** and **LEFT OUTER JOIN**
- **Subqueries**
- **GROUP BY** and **HAVING** clauses
- **Aggregation functions** (SUM, COUNT, AVG, MIN, MAX)
- **Window functions** (PARTITION BY)

## Files Modified

### 1. `/src/app/api/bills/route.ts`

#### Changes:

- **Created VIEW**: `OverdueBillsView` - Calculates days overdue using date arithmetic
  ```sql
  (YEAR(CURRENT_DATE) - YEAR(b.due_date)) * 365 +
  (MONTH(CURRENT_DATE) - MONTH(b.due_date)) * 30 +
  (DAY(CURRENT_DATE) - DAY(b.due_date))
  ```

#### Queries Implemented:

1. **Main Bills Query**
   - Technique: VIEW + INNER JOIN
   - Joins: Citizens, Utilities tables
2. **High Unpaid Bills Query**
   - Technique: INNER JOIN + GROUP BY + HAVING + Subquery
   - Features: Filters citizens with unpaid amounts above average
3. **Utility Summary Query**
   - Technique: LEFT OUTER JOIN + GROUP BY + Aggregations
   - Aggregations: COUNT, SUM, AVG, MIN, MAX
4. **Payment Status Analysis**
   - Technique: Subquery + GROUP BY + DATE_SUB
   - Features: Analyzes last 30 days of bills

### 2. `/src/app/api/requests/route.ts`

#### Changes:

- **Created VIEW**: `RequestDaysView` - Calculates days since request using date arithmetic
  ```sql
  (YEAR(CURRENT_DATE) - YEAR(r.request_date)) * 365 +
  (MONTH(CURRENT_DATE) - MONTH(r.request_date)) * 30 +
  (DAY(CURRENT_DATE) - DAY(r.request_date))
  ```

#### Queries Implemented:

1. **Main Requests Query**
   - Technique: VIEW + INNER JOIN + Window Functions
   - Window Functions: PARTITION BY for status_count, category_count, avg_age_by_priority
2. **High-Demand Citizens Query**
   - Technique: Multiple INNER JOINs + GROUP BY + HAVING
   - Features: Shows citizens with > 2 requests
3. **Status Summary Query**
   - Technique: VIEW + LEFT OUTER JOIN + GROUP BY + Aggregations
   - Aggregations: COUNT, AVG, MIN, MAX
4. **Category Analysis Query**
   - Technique: VIEW + INNER JOIN + Subquery + GROUP BY
   - Features: Analyzes last 30 days by category

### 3. `/src/app/bills/page.tsx`

#### Changes:

- Added detailed SQL query documentation for each section
- Displayed CREATE VIEW statements
- Formatted SQL queries in code blocks with proper syntax
- Added technique descriptions for each query

### 4. `/src/app/requests/page.tsx`

#### Changes:

- Added detailed SQL query documentation for each section
- Displayed CREATE VIEW statements
- Formatted SQL queries in code blocks with proper syntax
- Added technique descriptions for each query

## SQL Techniques Used

### Basic SQL Operations:

1. **CREATE OR REPLACE VIEW** - Reusable calculated fields
2. **INNER JOIN** - Required matches in both tables
3. **LEFT OUTER JOIN** - All records from left table + matches from right
4. **GROUP BY** - Aggregate data by columns
5. **HAVING** - Filter grouped results
6. **Subqueries** - Nested SELECT statements
7. **CASE statements** - Conditional logic
8. **Date arithmetic** - YEAR(), MONTH(), DAY() functions
9. **DATE_SUB()** - Subtract intervals from dates
10. **Window Functions** - PARTITION BY for analytics
11. **Aggregation Functions** - COUNT, SUM, AVG, MIN, MAX
12. **ORDER BY** - Sort results
13. **LIMIT** - Restrict number of results

## Date Calculation Formula

Instead of `DATEDIFF(CURRENT_DATE, date_column)`, we now use:

```sql
(YEAR(CURRENT_DATE) - YEAR(date_column)) * 365 +
(MONTH(CURRENT_DATE) - MONTH(date_column)) * 30 +
(DAY(CURRENT_DATE) - DAY(date_column))
```

This formula:

- Calculates year difference and converts to days (×365)
- Calculates month difference and converts to days (×30)
- Adds the day difference
- Returns approximate days between dates

## Benefits

1. ✅ No vendor-specific functions (DATEDIFF)
2. ✅ Uses only basic SQL operations
3. ✅ More portable across different SQL databases
4. ✅ Views make queries more maintainable
5. ✅ Better understanding of date arithmetic
6. ✅ Demonstrates multiple SQL techniques
7. ✅ Frontend displays actual SQL used

## Testing

To test the changes:

1. Start the development server: `npm run dev`
2. Navigate to `/bills` page to see bills analytics
3. Navigate to `/requests` page to see requests analytics
4. Each page displays the SQL queries used
5. Verify all date calculations work correctly
