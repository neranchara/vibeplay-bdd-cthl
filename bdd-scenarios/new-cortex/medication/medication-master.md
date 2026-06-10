# BDD Scenarios for Medication Master Search

## Feature: Medication Master Search
As a Pharmacy personnel or Admin
I want to be able to search and filter medications
So that I can quickly find and manage specific medication records

### Scenario 1: Search medication by Keyword
* **Given** the user is logged in and navigates to the Medication Master page
* **When** the user enters "Para" in the Keyword search field
* **And** clicks the Filter button
* **Then** the medication table should display records matching the keyword

### Scenario 2: Filter medications by Status and Attributes
* **Given** the user is logged in and navigates to the Medication Master page
* **When** the user selects "Active" from the Status dropdown
* **And** selects "Yes" from the High alert dropdown
* **And** clicks the Filter button
* **Then** the medication table should display only active and high alert medications

### Scenario 3: Reset search filters
* **Given** the user has entered search criteria and filtered the medications
* **When** the user clicks the Reset button
* **Then** all search fields should be cleared
* **And** the medication table should display all medications by default

### Scenario 4: Navigate to Create Medication page
* **Given** the user is logged in and navigates to the Medication Master page
* **When** the user clicks the "Create medication" button
* **Then** the Create Medication form or modal should be displayed
