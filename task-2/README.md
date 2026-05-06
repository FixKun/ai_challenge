# gather — Community Events Hub

A platform for hosting and attending community events. Hosts publish events, attendees RSVP and get tickets, and checkers scan codes at the door.

---

## Main Flows

### 1. Publish an Event

1. Sign in and go to **Host dashboard** (`/dashboard`).
2. If you don't have a host page yet, click **Become a host** and fill in your organisation details.
3. Click **New event** and fill in the form:
   - Title, description, start/end date and time
   - Toggle **Online** or **In-person** — online shows a join URL, in-person shows a venue field and an optional website
   - Capacity, visibility (public or unlisted), optional cover image
4. Click **Save draft** to save without publishing, or **Publish** to make it live immediately.
5. Published public events appear on the **Explore** page. Unlisted events are only accessible via direct link.

---

### 2. RSVP

1. Find an event on **Explore** (`/explore`) or via a direct link.
2. Click **RSVP — Free** on the event page.
   - If the event is full you'll be placed on the waitlist automatically.
   - If a spot opens up (someone cancels), the first person on the waitlist is promoted.
3. To cancel, return to the event page and click **Cancel RSVP**.
   - Cancelling does not delete your record — you can re-RSVP later without errors.

---

### 3. Ticket

1. After RSVPing, go to **Tickets** (`/tickets`) in the navigation.
2. Each ticket shows the event details and a unique **8-character code** (e.g. `A3FX9C2B`).
3. Use **Add to calendar** to save the event to Google Calendar, Outlook, or download an `.ics` file.
4. Show the code to a checker at the event entrance.

---

### 4. Check-in

1. The host or a checker opens the check-in page — linked from the event row in the dashboard via the scan icon, or directly at `/checkin/<event-id>`.
2. Type or scan the attendee's ticket code into the input field and press Enter.
   - **Found & going** → status updates to `checked_in`, name is shown as confirmation.
   - **Already checked in** → warning shown, no duplicate recorded.
   - **Code not found** → error shown.
3. The last 5 check-ins are shown with an **Undo** option in case of a mistake.
4. Live counters (Going / Checked-in / Waitlist) update in real time.

---

## Team Management

Hosts can invite team members from the **Members** tab in the dashboard:

- **Host invite** — full dashboard access, can create and manage events.
- **Checker invite** — check-in page access only, no dashboard.

Copy the invite link and send it. The recipient opens the link, signs in, and is added to the team. Hosts cannot be downgraded to checker via a checker invite link.

From the Members tab, hosts can also **Promote** checkers to host, **Demote** hosts to checker (owner only), or **Remove** members.
