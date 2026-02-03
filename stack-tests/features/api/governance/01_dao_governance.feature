@ROAD-033 @api @governance @dao @pending
Feature: DAO Governance for LLM Compute Futures Marketplace
  As a governance token holder
  I want to participate in decentralized decision-making
  So that the protocol can evolve through community consensus

  Background:
    Given the DAO governance contract is deployed
    And the governance token "CLAW" is configured with 18 decimals
    And the minimum proposal threshold is 10000 CLAW tokens
    And the voting period is 7 days
    And the quorum requirement is 4% of total token supply

  Scenario: Create a new governance proposal
    Given a token holder "Alice" with 50000 CLAW tokens staked
    When Alice creates a proposal with title "Increase Compute Slot Fees"
    And the proposal description contains the rationale and implementation details
    And the proposal calls the "updateSlotFee" function on the marketplace contract
    Then the proposal is assigned a unique proposal ID
    And the proposal status is set to "Pending"
    And the voting period starts immediately
    And Alice's voting power is recorded at proposal creation time

  Scenario: Submit vote for a proposal
    Given an active proposal "PROP-001" with status "Active"
    And a token holder "Bob" with 25000 CLAW tokens staked
    When Bob submits a vote "For" on proposal "PROP-001"
    Then Bob's vote is recorded with his current voting power
    And the "for" vote count increases by 25000
    And Bob cannot vote again on the same proposal
    And a "VoteCast" event is emitted with voter, proposal ID, support, and votes

  Scenario: Submit vote against a proposal
    Given an active proposal "PROP-002" with status "Active"
    And a token holder "Carol" with 15000 CLAW tokens staked
    When Carol submits a vote "Against" on proposal "PROP-002"
    Then Carol's vote is recorded with her current voting power
    And the "against" vote count increases by 15000
    And Carol receives voting receipt NFT as proof of participation

  Scenario: Submit abstain vote
    Given an active proposal "PROP-003" with status "Active"
    And a token holder "Dave" with 30000 CLAW tokens staked
    When Dave submits a vote "Abstain" on proposal "PROP-003"
    Then Dave's vote is recorded with his current voting power
    And the "abstain" vote count increases by 30000
    And Dave's voting power counts toward quorum requirement

  Scenario: Quorum requirement validation
    Given the total CLAW token supply is 10000000 tokens
    And an active proposal "PROP-004" with status "Active"
    And the current "for" votes total 250000 tokens
    And the current "against" votes total 100000 tokens
    And the current "abstain" votes total 50000 tokens
    When the voting period ends
    Then the total votes cast are 400000 tokens
    And the quorum of 4% with 400000 tokens is achieved
    And the proposal can proceed to execution if "for" votes exceed "against"

  Scenario: Proposal fails due to insufficient quorum
    Given the total CLAW token supply is 10000000 tokens
    And an active proposal "PROP-005" with status "Active"
    And the current "for" votes total 200000 tokens
    And the current "against" votes total 50000 tokens
    When the voting period ends
    Then the total votes cast are 250000 tokens
    And the quorum of 4% with 400000 tokens is NOT achieved
    And the proposal status changes to "Defeated"
    And the proposal cannot be executed

  Scenario: Execute successful proposal
    Given a proposal "PROP-006" with status "Succeeded"
    And the "for" votes exceed "against" votes
    And the quorum requirement was met
    And the voting period has ended
    And the timelock period of 2 days has passed
    When the execute function is called by any address
    Then the proposal status changes to "Executed"
    And the encoded calls are executed on target contracts
    And the "ProposalExecuted" event is emitted
    And the proposal actions cannot be executed again

  Scenario: Stake governance tokens for voting power
    Given a token holder "Eve" with 50000 CLAW tokens in wallet
    When Eve stakes 40000 CLAW tokens in the governance contract
    Then Eve's staked balance increases by 40000 CLAW
    And Eve's voting power is recorded as 40000 CLAW
    And the tokens are transferred to the staking contract
    And Eve receives staking receipt with timestamp
    And Eve cannot transfer staked tokens until unstaked

  Scenario: Unstake governance tokens
    Given a token holder "Frank" with 30000 CLAW tokens staked
    And Frank has no active votes on pending proposals
    When Frank unstakes 20000 CLAW tokens
    Then Frank's staked balance decreases by 20000 CLAW
    And Frank's voting power is reduced to 10000 CLAW
    And the tokens are transferred back to Frank's wallet
    And a cooldown period of 3 days is enforced for full unstaking

  Scenario: Delegate voting power to another address
    Given a token holder "Grace" with 60000 CLAW tokens staked
    And a delegatee "Henry" with no staked tokens
    When Grace delegates her voting power to Henry
    Then Henry's voting power increases by 60000 CLAW
    And Grace's voting power becomes 0 CLAW
    And the delegation is recorded on-chain
    And Grace retains ownership of her staked tokens
    And Henry can vote on behalf of Grace

  Scenario: Remove delegation and reclaim voting power
    Given a token holder "Ivy" who delegated 40000 CLAW to "Jack"
    And Jack currently has 40000 CLAW voting power from Ivy
    When Ivy removes the delegation from Jack
    Then Ivy's voting power is restored to 40000 CLAW
    And Jack's voting power decreases by 40000 CLAW
    And the delegation record is removed
    And Ivy can now vote directly with her full voting power

  Scenario: Emergency governance proposal execution
    Given a security vulnerability is detected in the protocol
    And the emergency multisig has submitted an emergency proposal "EMRG-001"
    And the emergency proposal has a shortened voting period of 24 hours
    When 60% of staked tokens vote "For" within the emergency period
    And the emergency timelock of 6 hours passes
    Then the emergency proposal can be executed immediately
    And the normal quorum requirement is waived for emergency proposals
    And the protocol upgrade is applied to fix the vulnerability

  Scenario: Parameter change proposal for governance settings
    Given a proposal "PROP-007" to change the voting period from 7 days to 5 days
    And the proposal includes the new parameter value and target contract
    When the proposal passes with sufficient "For" votes
    And the proposal is executed
    Then the governance contract's voting period is updated to 5 days
    And future proposals use the new 5-day voting period
    And the parameter change event is emitted with old and new values

  Scenario: Cancel proposal by proposer
    Given a proposal "PROP-008" created by "Kevin" with status "Active"
    And the voting period is still ongoing
    When Kevin cancels the proposal "PROP-008"
    Then the proposal status changes to "Canceled"
    And no further votes can be cast on the proposal
    And the proposal cannot be executed
    And staked tokens used for proposal creation are returned to Kevin

  Scenario: Prevent double voting
    Given an active proposal "PROP-009" with status "Active"
    And a token holder "Laura" with 20000 CLAW tokens staked
    When Laura votes "For" on proposal "PROP-009"
    And Laura attempts to vote "Against" on the same proposal
    Then the second vote transaction is rejected
    And an error message "Already voted on this proposal" is returned
    And Laura's original "For" vote remains unchanged

  Scenario: View proposal details and voting status
    Given a proposal "PROP-010" with multiple votes cast
    When any user queries the proposal details
    Then the response includes the proposal title and description
    And the current "for", "against", and "abstain" vote counts
    And the proposal status and timestamps
    And the quorum progress percentage
    And the list of voters who have cast votes (optional privacy mode)
    And the proposal execution payload and target contracts
