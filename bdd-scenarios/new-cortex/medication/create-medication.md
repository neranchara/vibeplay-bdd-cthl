# BDD Scenarios for Create Medication (Medication Master)

## Feature: Create Medication
As a Pharmacy personnel or Admin
I want to be able to add new medications into the system
So that I can keep the medication master data up-to-date

### Scenario 1: Validate required fields when creating medication
* **Given** the user is logged in and navigates to the Create Medication page
* **When** the user clicks the Save button without filling any data
* **Then** the system should display error messages for required fields
* **And** the medication data should not be saved

### Scenario 2: Create a medication by filling minimum required fields
* **Given** the user is logged in and navigates to the Create Medication page
* **When** the user selects "Local" for Source
* **And** fills "Medication code" with "M-PARA-500"
* **And** fills "Rank" with "1"
* **And** fills "TMT TPU" with "1234567890"
* **And** fills "Thai name" with "พาราเซตามอล 500 มก."
* **And** fills "Generic name TH" with "พาราเซตามอล"
* **And** clicks the Save button
* **Then** the system should save the data successfully and display a success message
* **And** the user should be redirected back to the Medication Master list

### Scenario 3: Cancel medication creation
* **Given** the user is logged in and navigates to the Create Medication page
* **When** the user fills some data into the form
* **And** clicks the Cancel button
* **Then** the system should discard the data and redirect back to the Medication Master list

### Scenario 4: Create a medication with comprehensive details across all tabs
* **Given** the user is logged in and navigates to the Create Medication page
* **When** the user selects "Local" for Source
* **And** fills required fields with Code: "M-PARA-1000", Thai Name: "พาราเซตามอล 1000 มก."
* **And** the user clicks on the "Price" tab
* **And** fills Price details with Price: "10.5", Qty: "10"
* **And** the user clicks on the "Drug" tab
* **And** fills Drug details with Strength: "1000 mg", Content: "Paracetamol 1000mg"
* **And** the user clicks on the "Clinical / CDSS" tab
* **And** fills Clinical details (High Alert: true, Addictive: false)
* **And** the user clicks on the "Prescription / Workflow" tab
* **And** fills Prescription details with Max Dispense: "100"
* **And** the user clicks on the "Usage" tab
* **And** fills Usage details with Syntax: "1 tab oral daily"
* **And** the user clicks on the "Warehouse" tab
* **And** fills Warehouse details (Allow Order Without Stock: true)
* **And** clicks the Save button
* **Then** the system should save the data successfully and display a success message
* **And** the user should be redirected back to the Medication Master list
