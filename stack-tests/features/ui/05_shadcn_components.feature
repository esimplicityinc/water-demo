@ROAD-022 @ui @components @shadcn @pending
Feature: shadcn/ui Component Library Validation
  As a ClawMarket developer
  I want to validate shadcn/ui component behavior and accessibility
  So that the UI provides a consistent, accessible, and reliable user experience

  Background:
    Given the ClawMarket UI is available
    And the browser is in a clean state
    And I generate a unique test identifier "{testId}"
    And I navigate to the component showcase page


  # ============================================
  # Button Component Scenarios
  # ============================================

  @button @states @smoke @pending
  Scenario: Button displays correct default state
    Given I am on a page with shadcn button components
    When I locate a button with variant "default"
    Then the button should be visible
    And the button should have class "bg-primary"
    And the button should have attribute "role" equal to "button"
    And the button should be enabled

  @button @states @pending
  Scenario: Button displays correct secondary variant
    Given I am on a page with shadcn button components
    When I locate a button with variant "secondary"
    Then the button should be visible
    And the button should have class "bg-secondary"
    And the button text color should be "secondary-foreground"

  @button @states @pending
  Scenario: Button displays correct destructive variant
    Given I am on a page with shadcn button components
    When I locate a button with variant "destructive"
    Then the button should be visible
    And the button should have class "bg-destructive"
    And the button should have class "text-destructive-foreground"

  @button @states @pending
  Scenario: Button displays correct outline variant
    Given I am on a page with shadcn button components
    When I locate a button with variant "outline"
    Then the button should be visible
    And the button should have class "border"
    And the button should have class "bg-background"

  @button @states @pending
  Scenario: Button displays correct ghost variant
    Given I am on a page with shadcn button components
    When I locate a button with variant "ghost"
    Then the button should be visible
    And the button should have class "hover:bg-accent"
    And the button should have class "hover:text-accent-foreground"

  @button @sizes @pending
  Scenario: Button displays correct size variants
    Given I am on a page with shadcn button components
    When I locate a button with size "sm"
    Then the button should have class "h-8"
    And the button should have class "px-3"
    When I locate a button with size "lg"
    Then the button should have class "h-10"
    And the button should have class "px-8"
    When I locate a button with size "icon"
    Then the button should have class "h-9"
    And the button should have class "w-9"

  @button @interaction @pending
  Scenario: Button responds to click events
    Given I am on a page with shadcn button components
    And a button with text "Click Me" is present
    When I click the button with text "Click Me"
    Then the button click handler should be invoked
    And the button should display active state styling

  @button @disabled @pending
  Scenario: Button displays disabled state correctly
    Given I am on a page with shadcn button components
    When I locate a disabled button
    Then the button should have attribute "disabled"
    And the button should have class "disabled:opacity-50"
    And the button should have class "disabled:pointer-events-none"
    And the button should not respond to click events

  @button @loading @pending
  Scenario: Button displays loading state with spinner
    Given I am on a page with shadcn button components
    When I locate a button in loading state
    Then the button should contain a loading spinner element
    And the button should have class "cursor-wait"
    And the button text should be replaced with loading indicator

  @button @accessibility @pending
  Scenario: Button has proper accessibility attributes
    Given I am on a page with shadcn button components
    When I locate any button element
    Then the button should have attribute "role" equal to "button"
    And the button should be keyboard focusable
    And the button should respond to Enter key press
    And the button should respond to Space key press

  # ============================================
  # Form Input Component Scenarios
  # ============================================

  @input @text @pending
  Scenario: Text input accepts and displays user input
    Given I am on a page with shadcn input components
    When I locate a text input with placeholder "Enter text"
    And I type "Hello World" into the input
    Then the input value should be "Hello World"
    And the input should have class "flex"
    And the input should have class "h-9"

  @input @validation @pending
  Scenario: Input displays validation error state
    Given I am on a page with shadcn input components
    When I locate an input with invalid state
    Then the input should have class "border-destructive"
    And the input should have attribute "aria-invalid" equal to "true"
    And an error message should be visible below the input

  @input @disabled @pending
  Scenario: Input displays disabled state
    Given I am on a page with shadcn input components
    When I locate a disabled input
    Then the input should have attribute "disabled"
    And the input should have class "disabled:cursor-not-allowed"
    And the input should have class "disabled:opacity-50"

  @input @number @pending
  Scenario: Number input accepts numeric values only
    Given I am on a page with shadcn input components
    When I locate a number input
    And I type "123.45" into the input
    Then the input value should be "123.45"
    When I type "abc" into the input
    Then the input value should not contain "abc"

  @input @password @pending
  Scenario: Password input masks entered text
    Given I am on a page with shadcn input components
    When I locate a password input
    And I type "secret123" into the input
    Then the input should have attribute "type" equal to "password"
    And the input value should be "secret123"
    But the displayed characters should be masked

  @select @pending
  Scenario: Select dropdown displays options correctly
    Given I am on a page with shadcn select components
    When I click on a select trigger element
    Then a select content dropdown should appear
    And the dropdown should contain option items
    And the select viewport should be visible

  @select @interaction @pending
  Scenario: Select allows option selection
    Given I am on a page with shadcn select components
    And a select dropdown is open
    When I click on an option with text "Option 1"
    Then the select value should be "Option 1"
    And the select dropdown should close
    And the select trigger should display "Option 1"

  @select @disabled @pending
  Scenario: Select displays disabled state
    Given I am on a page with shadcn select components
    When I locate a disabled select
    Then the select trigger should have attribute "disabled"
    And the select trigger should have class "opacity-50"
    And clicking the select should not open the dropdown

  @checkbox @pending
  Scenario: Checkbox toggles checked state
    Given I am on a page with shadcn checkbox components
    When I locate an unchecked checkbox
    And I click the checkbox
    Then the checkbox should be checked
    And the checkbox should have attribute "data-state" equal to "checked"
    When I click the checkbox again
    Then the checkbox should be unchecked
    And the checkbox should have attribute "data-state" equal to "unchecked"

  @checkbox @indeterminate @pending
  Scenario: Checkbox displays indeterminate state
    Given I am on a page with shadcn checkbox components
    When I locate a checkbox in indeterminate state
    Then the checkbox should have attribute "data-state" equal to "indeterminate"
    And the checkbox should display an indeterminate indicator

  @checkbox @disabled @pending
  Scenario: Checkbox displays disabled state
    Given I am on a page with shadcn checkbox components
    When I locate a disabled checkbox
    Then the checkbox should have attribute "disabled"
    And the checkbox should have class "cursor-not-allowed"
    And the checkbox should have class "opacity-50"

  @textarea @pending
  Scenario: Textarea accepts multi-line input
    Given I am on a page with shadcn textarea components
    When I locate a textarea element
    And I type multi-line text:
      """
      Line 1
      Line 2
      Line 3
      """
    Then the textarea should contain 3 lines
    And the textarea should have class "min-h-[60px]"

  # ============================================
  # Modal/Dialog Component Scenarios
  # ============================================

  @dialog @pending
  Scenario: Dialog opens when trigger is clicked
    Given I am on a page with shadcn dialog components
    When I click on a dialog trigger button
    Then a dialog overlay should appear
    And a dialog content should be visible
    And the dialog should have class "data-[state=open]:animate-in"

  @dialog @pending
  Scenario: Dialog displays correct structure
    Given a dialog is open
    Then the dialog should contain a header element
    And the dialog should contain a title element
    And the dialog should contain a description element
    And the dialog should contain a footer element

  @dialog @interaction @pending
  Scenario: Dialog closes on overlay click
    Given a dialog is open
    When I click on the dialog overlay background
    Then the dialog should close
    And the dialog content should not be visible

  @dialog @interaction @pending
  Scenario: Dialog closes on close button click
    Given a dialog is open
    When I click on the dialog close button
    Then the dialog should close
    And the dialog overlay should not be visible

  @dialog @keyboard @pending
  Scenario: Dialog closes on Escape key press
    Given a dialog is open
    When I press the Escape key
    Then the dialog should close
    And focus should return to the trigger element

  @dialog @accessibility @pending
  Scenario: Dialog has proper accessibility attributes
    Given a dialog is open
    Then the dialog should have attribute "role" equal to "dialog"
    And the dialog should have attribute "aria-modal" equal to "true"
    And focus should be trapped within the dialog
    And the dialog title should have id referenced by aria-labelledby

  @dialog @scroll @pending
  Scenario: Dialog prevents background scrolling
    Given I am on a page with scrollable content
    When I open a dialog
    Then the body should have class "overflow-hidden"
    And the background content should not be scrollable
    When I close the dialog
    Then the body should not have class "overflow-hidden"

  # ============================================
  # Card Component Scenarios
  # ============================================

  @card @structure @pending
  Scenario: Card displays correct structure
    Given I am on a page with shadcn card components
    When I locate a card element
    Then the card should have class "rounded-lg"
    And the card should have class "border"
    And the card should have class "bg-card"
    And the card should have class "text-card-foreground"

  @card @structure @pending
  Scenario: Card contains all sub-components
    Given I am on a page with shadcn card components
    When I locate a complete card element
    Then the card should contain a header element
    And the card should contain a title element
    And the card should contain a description element
    And the card should contain a content element
    And the card should contain a footer element

  @card @styling @pending
  Scenario: Card sub-components have correct styling
    Given I am on a page with shadcn card components
    When I locate a card header
    Then the header should have class "flex"
    And the header should have class "flex-col"
    And the header should have class "space-y-1.5"
    When I locate a card title
    Then the title should have class "text-2xl"
    And the title should have class "font-semibold"
    When I locate a card content
    Then the content should have class "p-6"

  # ============================================
  # Navigation Component Scenarios
  # ============================================

  @navigation @tabs @pending
  Scenario: Tabs display correct structure
    Given I am on a page with shadcn tabs components
    When I locate a tabs component
    Then the tabs should have attribute "role" equal to "tablist"
    And the tabs should contain tab trigger elements
    And the tabs should contain tab content elements

  @navigation @tabs @interaction @pending
  Scenario: Tab switching updates active state
    Given I am on a page with shadcn tabs components
    When I click on a tab trigger with value "tab2"
    Then the tab trigger should have attribute "data-state" equal to "active"
    And the corresponding tab content should be visible
    And the previous tab content should be hidden

  @navigation @tabs @keyboard @pending
  Scenario: Tabs support keyboard navigation
    Given I am on a page with shadcn tabs components
    When I focus on the tabs component
    And I press the ArrowRight key
    Then focus should move to the next tab trigger
    When I press the Enter key
    Then the focused tab should become active

  @navigation @breadcrumb @pending
  Scenario: Breadcrumb displays navigation hierarchy
    Given I am on a page with shadcn breadcrumb components
    When I locate a breadcrumb element
    Then the breadcrumb should have attribute "aria-label" equal to "Breadcrumb"
    And the breadcrumb should contain list items
    And breadcrumb items should be separated by separators

  @navigation @breadcrumb @pending
  Scenario: Breadcrumb links are clickable
    Given I am on a page with shadcn breadcrumb components
    When I locate a breadcrumb link
    Then the link should have attribute "href"
    And clicking the link should navigate to the specified path

  @navigation @dropdown @pending
  Scenario: Dropdown menu opens on trigger click
    Given I am on a page with shadcn dropdown menu components
    When I click on a dropdown menu trigger
    Then a dropdown menu content should appear
    And the dropdown should contain menu items
    And the dropdown should have class "z-50"

  @navigation @dropdown @interaction @pending
  Scenario: Dropdown menu item selection
    Given a dropdown menu is open
    When I hover over a menu item
    Then the item should have class "bg-accent"
    And the item should have class "text-accent-foreground"
    When I click on a menu item
    Then the dropdown should close
    And the item action should be triggered

  @navigation @dropdown @keyboard @pending
  Scenario: Dropdown menu supports keyboard navigation
    Given a dropdown menu is open
    When I press the ArrowDown key
    Then focus should move to the next menu item
    When I press the Enter key
    Then the focused item should be selected
    And the dropdown should close

  # ============================================
  # Toast/Notification System Scenarios
  # ============================================

  @toast @pending
  Scenario: Toast notification displays correctly
    Given I am on a page with shadcn toast components
    When a toast notification is triggered
    Then a toast element should appear
    And the toast should have class "bg-background"
    And the toast should have class "text-foreground"
    And the toast should have class "rounded-md"

  @toast @variants @pending
  Scenario: Toast displays different variants
    Given I am on a page with shadcn toast components
    When a toast with variant "default" is triggered
    Then the toast should have default styling
    When a toast with variant "destructive" is triggered
    Then the toast should have class "border-destructive"
    And the toast should have class "text-destructive"

  @toast @interaction @pending
  Scenario: Toast auto-dismisses after timeout
    Given I am on a page with shadcn toast components
    When a toast notification is triggered with duration 5000
    Then the toast should be visible
    And after 5000 milliseconds
    Then the toast should be dismissed
    And the toast element should not be in the DOM

  @toast @interaction @pending
  Scenario: Toast closes on manual dismiss
    Given a toast notification is visible
    When I click on the toast close button
    Then the toast should be dismissed immediately
    And the toast should have class "data-[state=closed]:animate-out"

  @toast @accessibility @pending
  Scenario: Toast has proper accessibility attributes
    Given a toast notification is visible
    Then the toast should have attribute "role" equal to "alert"
    And the toast should have attribute "aria-live" equal to "assertive"
    And the toast should have attribute "aria-atomic" equal to "true"

  @toast @positioning @pending
  Scenario: Toast displays in correct position
    Given I am on a page with shadcn toast components
    When a toast is triggered with position "top-right"
    Then the toast viewport should be positioned at top-right
    When a toast is triggered with position "bottom-center"
    Then the toast viewport should be positioned at bottom-center

  # ============================================
  # Table/Data Grid Component Scenarios
  # ============================================

  @table @structure @pending
  Scenario: Table displays correct structure
    Given I am on a page with shadcn table components
    When I locate a table element
    Then the table should have class "w-full"
    And the table should have class "caption-bottom"
    And the table should contain a header section
    And the table should contain a body section

  @table @structure @pending
  Scenario: Table header has correct styling
    Given I am on a page with shadcn table components
    When I locate a table header
    Then the header should have class "border-b"
    And the header should have class "bg-muted/50"
    And the header cells should have class "h-10"
    And the header cells should have class "px-2"

  @table @structure @pending
  Scenario: Table rows have correct styling
    Given I am on a page with shadcn table components
    When I locate table body rows
    Then each row should have class "border-b"
    And each row should have class "transition-colors"
    And each row should have class "hover:bg-muted/50"

  @table @accessibility @pending
  Scenario: Table has proper accessibility attributes
    Given I am on a page with shadcn table components
    When I locate a table element
    Then the table should have attribute "role" equal to "table"
    And table headers should have attribute "role" equal to "columnheader"
    And table cells should have attribute "role" equal to "cell"

  @table @sorting @pending
  Scenario: Table supports column sorting
    Given I am on a page with shadcn table components
    When I click on a sortable column header
    Then the column should be sorted in ascending order
    And a sort indicator should be visible
    When I click on the same column header again
    Then the column should be sorted in descending order

  @table @selection @pending
  Scenario: Table supports row selection
    Given I am on a page with shadcn table components
    When I click on a table row
    Then the row should have class "bg-muted"
    And the row should have attribute "data-selected" equal to "true"
    When I click on another row
    Then the previous row should be deselected
    And the new row should be selected

  # ============================================
  # Loading States and Skeleton Scenarios
  # ============================================

  @skeleton @pending
  Scenario: Skeleton displays loading placeholder
    Given I am on a page with shadcn skeleton components
    When I locate a skeleton element
    Then the skeleton should have class "animate-pulse"
    And the skeleton should have class "bg-muted"
    And the skeleton should have class "rounded-md"

  @skeleton @variants @pending
  Scenario: Skeleton displays different shapes
    Given I am on a page with shadcn skeleton components
    When I locate a skeleton with circular shape
    Then the skeleton should have class "rounded-full"
    When I locate a skeleton with rectangular shape
    Then the skeleton should have class "rounded-md"

  @loading @spinner @pending
  Scenario: Loading spinner displays correctly
    Given I am on a page with loading indicators
    When I locate a loading spinner element
    Then the spinner should be animating
    And the spinner should have class "animate-spin"

  @loading @progress @pending
  Scenario: Progress bar displays correctly
    Given I am on a page with shadcn progress components
    When I locate a progress element
    Then the progress should have attribute "role" equal to "progressbar"
    And the progress should have attribute "aria-valuemin" equal to "0"
    And the progress should have attribute "aria-valuemax" equal to "100"

  @loading @progress @pending
  Scenario: Progress bar updates value
    Given I am on a page with shadcn progress components
    When the progress value is set to 50
    Then the progress indicator should fill 50% of the bar
    And the progress should have attribute "aria-valuenow" equal to "50"
    When the progress value is set to 75
    Then the progress indicator should fill 75% of the bar

  # ============================================
  # Accessibility Attribute Scenarios
  # ============================================

  @accessibility @aria @pending
  Scenario: Components have proper ARIA labels
    Given I am on a page with shadcn components
    When I check interactive elements
    Then buttons without visible text should have aria-label
    And icons should have aria-hidden or aria-label
    And form inputs should have associated labels

  @accessibility @focus @pending
  Scenario: Components have visible focus indicators
    Given I am on a page with shadcn components
    When I tab through interactive elements
    Then each focused element should have visible focus ring
    And the focus ring should have class "ring-2"
    And the focus ring should have class "ring-ring"

  @accessibility @contrast @pending
  Scenario: Components meet color contrast requirements
    Given I am on a page with shadcn components
    When I check text elements
    Then normal text should have contrast ratio of at least 4.5:1
    And large text should have contrast ratio of at least 3:1
    And interactive elements should have contrast ratio of at least 3:1

  @accessibility @keyboard @pending
  Scenario: All interactive components are keyboard accessible
    Given I am on a page with shadcn components
    When I navigate using only the Tab key
    Then all interactive elements should receive focus
    And all interactive elements should respond to Enter or Space
    And focus order should follow visual layout

  @accessibility @screen-reader @pending
  Scenario: Components work with screen readers
    Given I am on a page with shadcn components
    When I check component announcements
    Then dynamic content changes should be announced
    And error messages should have role="alert"
    And status updates should use aria-live regions

  @accessibility @reduced-motion @pending
  Scenario: Components respect reduced motion preference
    Given I am on a page with shadcn components
    And the user has enabled reduced motion
    When I interact with animated components
    Then animations should be disabled or reduced
    And the components should have class "motion-reduce:transition-none"
