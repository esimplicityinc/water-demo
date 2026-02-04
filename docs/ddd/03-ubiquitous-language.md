# Ubiquitous Language

This document defines the common vocabulary used across AquaTrack. All team members, code, documentation, and communication should use these terms consistently.

---

## Core Water Management Concepts

### Customer Account
A formal agreement between a water utility and a property owner/occupant to provide water service. A Customer Account includes:
- Service address (property location)
- Account holder information
- Active dates (connection and termination)
- Service deposit (upfront payment, refundable)
- Billing preferences (frequency, delivery method)

**Example**: "Customer Account #12345 at 123 Main Street is active with a $200 service deposit."

### Meter
A physical device installed at a property that measures and records water consumption in cubic meters (m³).

**Types**:
- Single-family residential meter
- Commercial/Industrial meter
- Large volume meter for municipal buildings

**Not to be confused with**: Meter Reading (a single data point from the meter)

### Meter Reading
A recorded measurement of water consumption from a meter at a specific date and time. Includes:
- Meter ID (unique identifier of the physical device)
- Reading value (cubic meters consumed, cumulative)
- Reading date and time
- Meter status at time of reading
- Reader identification (person or automated system)

**Example**: "Meter Reading for meter #ABC-123 recorded 1,245.67 m³ on Jan 15, 2024."

### Consumption / Usage
The calculated volume of water used during a billing period. Calculated as:
**Consumption = Current Reading - Previous Reading**

**Example**: "Customer used 15.2 m³ of water in January."

### Billing Cycle
Regular recurring interval (monthly, quarterly, or annual) during which usage is calculated and customers are billed.

**Typical Cycles**: 
- Monthly (30-31 days)
- Bi-monthly (60 days)
- Quarterly (90 days)

---

## Service Account Concepts

### Service Deposit
Upfront payment required from customer to activate water service. Held in trust and refundable upon account closure.

**Purpose**: Ensures customers have commitment to service and covers potential unpaid balances.

**Handling**: 
- Deposited upon account creation
- Released when account closed in good standing
- Applied to final bill if account closed with balance

### Account Status
Current operational state of a customer account:

#### Active
Account in good standing with water service currently flowing. No payment issues.

#### Delinquent
Customer has overdue balance beyond specified grace period. Service may be at risk.

#### Suspended
Water service disconnected due to non-payment or other violation. Meter physically isolated.

#### Closed
Account permanently terminated. No further billing or service.

#### Pending Activation
Account created but not yet activated pending verification or deposit clearance.

### Account Standing
Credit rating reflecting customer's payment history and reliability:
- **Excellent**: All payments on time, no disconnections (0-5 days late max)
- **Good**: Occasional late payments, no disconnections (5-30 days late)
- **Fair**: Regular late payments or one disconnection (30-60 days late)
- **Poor**: Multiple disconnections or sustained non-payment (60+ days late)

---

## Billing Concepts

### Invoice
Formal bill for water consumption and service charges during a billing period. Includes:
- Service period (start and end dates)
- Meter readings (previous and current)
- Calculated consumption
- Rate applied ($/m³)
- Service charges (base fee, surcharges)
- Due date
- Balance due

**Example**: "Invoice #INV-2024-001 for January usage due Feb 15, 2024: $45.00"

### Billing Period
Time interval between billing cycles during which usage is measured and billed.

**Standard Periods**: 30, 60, or 90 days depending on billing cycle frequency

### Rate / Pricing
Cost per unit of water consumption:
- **Base Rate**: Fixed monthly/quarterly charge
- **Consumption Rate**: $/m³ for usage over minimum allowance
- **Tier Rates**: Variable rates based on consumption tiers (conservation pricing)
- **Surcharges**: Special fees (late fee, reconnection fee, service request fee)

**Example**: "$1.25/m³ for usage + $15 base fee + $5 late fee if 30+ days overdue"

### Payment
Customer's settlement of an invoice or account balance. 

**Types**:
- Full payment (entire invoice amount)
- Partial payment (portion of amount due)
- On-time payment (by due date)
- Late payment (after due date)

### Account Balance
Outstanding amount owed by customer or credit balance in customer's favor.

**Positive Balance**: Amount owed by customer
**Credit Balance**: Amount owed to customer (overpayment or future credit)

---

## Usage Tracking Concepts

### Meter Reading (Detailed)
Complete record including:
- **Meter ID**: Unique device identifier
- **Reading Value**: Cumulative m³ consumption
- **Previous Reading**: For consumption calculation
- **Consumption**: Calculated difference for period
- **Reading Date**: When measurement was taken
- **Reading Source**: Manual (technician), Automated (smart meter), Estimated
- **Status**: Valid, Estimated, Anomalous, Rejected

### Consumption Calculation
Process of determining water usage from consecutive readings:

```
Consumption = Current Reading - Previous Reading
```

**Example**: "Current: 1,250 m³, Previous: 1,235 m³ = 15 m³ consumption"

### Anomaly
Unusual usage pattern detected, such as:
- Usage >200% of customer's average (potential leak)
- Usage &lt;10% of customer's average (meter malfunction)
- Negative consumption (meter rollback or error)
- Massive spike in short period (potential water main break)

**Response**: Flag for investigation; may hold billing pending verification.

---

## Meter & Service Concepts

### Service Request
Request for meter-related action, including:
- Meter reading (for off-cycle billing)
- Meter repair or replacement
- Service line investigation (potential leak)
- Meter disconnection/reconnection
- Meter inspection or maintenance

### Service Technician
Field operator authorized to:
- Conduct meter readings
- Perform routine maintenance
- Identify meter faults
- Disconnect/reconnect service
- Complete service requests

### Meter Status
Operational condition of physical meter device:
- **Active**: Functioning, recording usage normally
- **Faulty**: Known to be inaccurate or non-functional
- **Due for Maintenance**: Scheduled servicing needed
- **Disconnected**: Service line physically isolated
- **Scheduled for Replacement**: Scheduled maintenance work

---

## Financial Concepts

### Service Connection
Activation of water service to a property, typically involving:
- Verification of account ownership/tenancy
- Service deposit collection
- Meter activation
- Initial reading recording

### Service Disconnection
Termination of water service, typically due to:
- Customer request (moving away)
- Non-payment (60+ days overdue)
- Property vacation or demolition
- Fraud or meter tampering

### Reconnection
Restoration of service after disconnection:
- Requires payment of outstanding balance
- Requires reconnection fee
- May require meter inspection
- Deposit may be forfeited or reapplied

### Late Payment
Payment received after invoice due date.

**Grace Period**: Typically 15-30 days before delinquency triggered

**Penalties**: 
- Late fee (fixed amount or percentage)
- Increased interest on balance
- Service suspension risk

---

## Account Lifecycle Events

### Account Creation
Initial establishment of customer water service agreement.

**Preconditions**: Proof of occupancy, deposit payment, meter availability

### Account Activation
Service connection and first meter reading recorded.

**Triggers**: Deposit cleared, address verified, meter activated

### Account Deactivation
Termination of water service relationship.

**Reasons**: Customer request, fraud, property demolition, unpaid balance

### Account Closure
Permanent closure after all balances settled and deposit disposition determined.

**Outcomes**: 
- Deposit refunded (good standing)
- Deposit applied to final bill
- Overage charged or credited

---

## Glossary Quick Reference

| Term | Definition | Context |
|------|-----------|---------|
| Customer Account | Service agreement for water delivery | Core |
| Meter | Physical device measuring consumption | Core |
| Meter Reading | Recorded measurement at specific time | Usage Tracking |
| Consumption | Calculated usage between readings | Usage Tracking |
| Service Deposit | Upfront payment to activate service | Account Mgmt |
| Account Status | Current state (Active, Suspended, etc) | Account Mgmt |
| Billing Cycle | Regular invoicing interval | Billing |
| Invoice | Bill for consumption and fees | Billing |
| Payment | Customer settlement of amount due | Billing |
| Service Request | Request for meter/service work | Meter Ops |
| Account Standing | Credit rating based on payment history | Account Mgmt |
| Anomaly | Unusual consumption pattern detected | Usage Tracking |

---

## Anti-Patterns & Common Mistakes

### ❌ "Meter" Confusion
**Wrong**: "The meter shows 1,250 cubic meters."
**Right**: "The meter reading is 1,250 cubic meters."

Always distinguish between:
- **Meter**: The physical device
- **Meter Reading**: The recorded value

### ❌ Mixing Reading and Consumption
**Wrong**: "Consumption from 1,235 to 1,250."
**Right**: "Meter reading of 1,250 m³; consumption of 15 m³."

Reading is cumulative; consumption is the difference.

### ❌ Confusing Status and Standing
**Wrong**: "Account standing is Suspended."
**Right**: "Account status is Suspended; standing was Fair before suspension."

- **Status**: Current operational state
- **Standing**: Historical credit rating

### ❌ Overdue vs Late
**Wrong**: "Payment was overdue."
**Right**: "Invoice became due; payment was late."

- **Due**: Date amount becomes payable
- **Late**: Payment received after due date

---

**Next**: [Aggregates & Entities](./04-aggregates-entities.md)
