# Domain Overview: AquaTrack

## Vision

AquaTrack is a **Municipal Water Tracking & Management System** where municipal utilities, water districts, and commercial water operators collaborate to efficiently manage water resources, track consumption, bill customers, and optimize distribution. Utilities can monitor customer usage, manage service accounts, process payments, and respond to service requests with real-time visibility.

## Core Domain

**Water Utility Operations** - A multi-sided system connecting:
- **Water Utilities**: Municipalities managing water distribution and billing
- **Customers**: Residential and commercial water consumers
- **Service Operators**: Field technicians managing meters and service calls
- **Billing System**: Automated billing and payment processing

## Domain Type

This is a **transactional domain** with elements of an **operational domain**:
- Transactional: Clear billing mechanics, payment settlement, service contracts
- Operational: Real-time usage tracking, meter management, emergency response

## Key Problems Solved

1. **Usage Accuracy**: Ensure accurate meter readings and usage attribution
2. **Billing Efficiency**: Automate billing cycles and payment processing
3. **Service Management**: Track service requests, repairs, and meter maintenance
4. **Conservation**: Monitor usage patterns to promote water conservation
5. **Compliance**: Maintain regulatory compliance and audit trails for water management

## Business Model

- **Billing**: Recurring monthly/quarterly billings based on usage
- **Service Fees**: Charges for service calls, meter inspections, and maintenance
- **Late Payments**: Interest/penalties on overdue accounts
- **Conservation Rebates**: Incentives for low usage or efficient practices

## Success Metrics

- **Billing Accuracy**: Percentage of correctly billed customers
- **Payment Collection Rate**: Percentage of invoices paid on time
- **Meter Reading Accuracy**: Variance between estimated and actual readings
- **Service Response Time**: Average time to resolve service requests
- **Customer Satisfaction**: Satisfaction scores and complaint resolution

## Domain Boundaries

### In Scope
- Customer account management and lifecycle
- Water meter operations and reading collection
- Usage tracking and billing calculation
- Payment processing and settlement
- Service request management
- Account standing and status

### Out of Scope (Initially)
- Water treatment plants (managed separately)
- Infrastructure maintenance (separate operations)
- Advanced conservation modeling (v2 feature)
- Multi-currency support (single currency MVP)
- Predictive analytics (v2 feature)

## Strategic Domain Patterns

Following DDD strategic patterns:
1. **Core Domain**: Billing & Usage Tracking
2. **Supporting Subdomain**: Customer Account Management
3. **Generic Subdomain**: Payment Processing (could use third-party)

## Ubiquitous Language Foundation

Key terms that will be used consistently across code, docs, and communication:
- **Customer Account**: Service agreement for water delivery to a property
- **Meter**: Device measuring water consumption (cubic meters)
- **Reading**: Recorded meter value at specific date/time
- **Usage**: Calculated consumption based on meter readings
- **Service Deposit**: Upfront payment required for account activation
- **Billing Cycle**: Regular interval (monthly/quarterly) for billing
- **Invoice**: Bill for water consumption and services
- **Payment**: Customer's settlement of invoice
- **Service Request**: Request for meter reading, repair, or maintenance
- **Account Standing**: Customer's payment and contract status

---

## Related Documentation

### DDD
- [Bounded Contexts](./02-bounded-contexts.md) - Domain decomposition
- [Ubiquitous Language](./03-ubiquitous-language.md) - Domain terminology
- [Use Cases](./07-use-cases.md) - System interactions

### BDD Testing
- [BDD Overview](../bdd/bdd-overview) - Testing philosophy
- [DDD-BDD Mapping](../bdd/ddd-bdd-mapping) - How domain maps to tests
- [Feature Index](../bdd/feature-index) - Test coverage by domain

---

**Next**: [Bounded Contexts](./02-bounded-contexts.md)
