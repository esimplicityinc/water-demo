# Use Cases

Use cases describe how actors interact with the system to achieve specific goals. Each use case maps to one or more application services that orchestrate domain logic.

---

## Actor Types

- **Customer**: Residential or commercial water consumer
- **Utility Staff**: Water utility employees
- **Field Technician**: Employee conducting meter and service work
- **System**: Automated processes (billing engine, anomaly detector)

---

## Customer Account Management Use Cases

### UC-001: Create Customer Account

**Actor**: Utility Staff or Self-Service Customer

**Goal**: Establish new water service account for property

**Flow**:
1. Customer provides service address and contact information
2. System validates address is within service area
3. System checks if address already has active account
4. System creates CustomerAccount with pending status
5. System sends welcome notification
6. System emits `CustomerAccountCreated` event

**Postconditions**:
- Account exists in pending status
- Account holder can log in
- Service deposit amount defined and awaiting payment

**Application Service**: `AccountCreationService.create()`

---

### UC-002: Activate Account

**Actor**: System (automated), or Utility Staff (manual)

**Goal**: Activate water service to property

**Flow**:
1. System verifies service deposit received
2. System verifies meter is installed and active
3. System transitions account status to Active
4. System emits `AccountActivated` event
5. System starts first billing cycle

**Postconditions**:
- Water service flowing to property
- First meter reading recorded
- Billing cycle active

**Application Service**: `AccountActivationService.activate()`

---

### UC-003: Report Service Issue

**Actor**: Customer

**Goal**: Request meter reading, repair, or service check

**Flow**:
1. Customer submits service request (online, phone, or in-person)
2. System creates ServiceRequest
3. System emits `ServiceRequestCreated` event
4. System assigns to available technician
5. System sends appointment confirmation to customer
6. Technician performs work and submits findings

**Postconditions**:
- Service request tracked
- Technician assigned
- Customer notified of status

**Application Service**: `ServiceRequestService.create()`

---

## Usage Tracking Use Cases

### UC-010: Record Meter Reading

**Actor**: Field Technician or Automated System

**Goal**: Capture water consumption measurement

**Flow**:
1. Technician reads meter or system receives automated reading
2. System validates reading format and value
3. System checks for anomalies (reading doesn't go backward, within expected range)
4. System calculates consumption from previous reading
5. System stores MeterReading
6. System emits `MeterReadingRecorded` event

**Postconditions**:
- Reading stored and validated
- Consumption available for billing
- Anomalies (if any) flagged

**Extensions**:
- 3a. Reading fails validation → Flag for manual review
- 4a. Anomaly detected → Emit `AnomalyDetected` event

**Application Service**: `UsageTrackingService.recordReading()`

---

### UC-011: Calculate Consumption

**Actor**: System (automated billing process)

**Goal**: Determine water usage for billing period

**Flow**:
1. System retrieves meter readings for billing period
2. System validates readings are sequential
3. System calculates: Current Reading - Previous Reading
4. System detects anomalies (negative consumption, 200%+ increase)
5. System stores ConsumptionData
6. System emits `ConsumptionCalculated` event

**Postconditions**:
- Consumption calculated and stored
- Ready for billing

**Extensions**:
- 4a. Anomaly detected → Emit event, hold from billing pending review

**Application Service**: `UsageTrackingService.calculateConsumption()`

---

## Billing & Payments Use Cases

### UC-020: Generate Invoice

**Actor**: System (automated billing engine)

**Goal**: Create and issue invoice for consumption

**Flow**:
1. System triggers for each active account on billing cycle
2. System retrieves consumption data
3. System applies rates to consumption
4. System calculates: (consumption × rate) + base fees
5. System creates Invoice with due date
6. System emits `InvoiceGenerated` event
7. System delivers via selected channel (email/paper)

**Postconditions**:
- Invoice created and recorded
- Due date set (typically 20 days out)
- Customer notified

**Application Service**: `BillingService.generateInvoice()`

---

### UC-021: Record Payment

**Actor**: Customer

**Goal**: Pay invoice or account balance

**Flow**:
1. Customer submits payment (check, ACH, card, or in-person)
2. System validates payment amount and method
3. System records PaymentTransaction
4. System updates account balance
5. System checks if account becomes current
6. System emits `PaymentReceived` event

**Postconditions**:
- Payment recorded and credited
- Receipt sent to customer
- If balance cleared, account status may improve

**Extensions**:
- 5a. Payment brings account from delinquent to current → Emit `AccountNowCurrent` event

**Application Service**: `PaymentService.recordPayment()`

---

### UC-022: Monitor Account For Delinquency

**Actor**: System (automated nightly process)

**Goal**: Track overdue accounts and trigger actions

**Flow**:
1. System identifies invoices past due date
2. System categorizes by days overdue (15, 30, 60+ days)
3. For 30+ days: Emit `AccountBecameDelinquent`, schedule disconnect notice
4. For 60+ days: Prepare for service disconnection
5. System sends escalating payment reminders

**Postconditions**:
- Delinquent accounts flagged
- Escalating actions triggered
- Service disconnection prepared if needed

**Application Service**: `CollectionsService.processDelinquencies()`

---

## Meter Operations Use Cases

### UC-030: Schedule Meter Reading

**Actor**: Utility Staff or System

**Goal**: Schedule technician to read meter

**Flow**:
1. System identifies accounts needing readings this period
2. System groups by technician territory
3. System creates ServiceRequest for each meter reading needed
4. System assigns to technician with preferred time window
5. System notifies technician of schedule
6. Technician visits property and records reading

**Postconditions**:
- Reading scheduled
- Technician has work assignment
- Customer notified (if needed)

**Application Service**: `MeterSchedulingService.scheduleReadings()`

---

### UC-031: Install New Meter

**Actor**: Field Technician

**Goal**: Install meter at new service address

**Flow**:
1. System receives meter installation work order
2. Technician installs physical meter device
3. Technician records meter serial number
4. System creates Meter aggregate with installation date
5. System activates meter for account
6. System emits `MeterActivated` event
7. Technician records first reading

**Postconditions**:
- Meter physically installed
- Meter registered in system
- First reading recorded for baseline

**Application Service**: `MeterService.installMeter()`

---

### UC-032: Detect & Respond to Meter Fault

**Actor**: System (automated anomaly detection)

**Goal**: Identify and address meter malfunction

**Flow**:
1. System detects anomaly (reading went backward, impossibly low/high)
2. System flags Meter with 'faulty' status
3. System emits `MeterFault Detected` event
4. System creates ServiceRequest for technician inspection
5. Technician inspects meter and submits findings
6. If confirmed faulty: System schedules replacement

**Postconditions**:
- Fault documented
- Technician assignment created
- Meter status updated
- Replacement scheduled if needed

**Application Service**: `AnomalyService.handleMeterFault()`

---

## Cross-Context Workflows

### Workflow: Complete Billing Cycle

```
Month Start:
  System detects billing cycle due
  ↓
Customer Account Context:
  For each active account
  ↓
Usage Tracking Context:
  UC-011: Calculate consumption
  Emit: ConsumptionCalculated
  ↓
Billing Context:
  UC-020: Generate invoice
  Emit: InvoiceGenerated
  ↓
Notifications:
  Send invoice to customer
  ↓
Customer pays (UC-021):
  Emit: PaymentReceived
  ↓
Billing Context:
  Record payment, update balance
  ↓
System (ongoing - UC-022):
  Monitor for late payments
  If delinquent: Escalate actions
```

---

**Next**: [Context Map](./08-context-map.md)
