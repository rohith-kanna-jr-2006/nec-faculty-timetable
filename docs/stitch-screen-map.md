# Stitch Screen Mapping

## Screen 1: App Entry & Splash
- App Route: `/` (`app/index.js`)
- Screen Name: App Entry / Splash
- Stitch Source: Project Theme & Institutional Branding
- Stitch Screen ID: `2431280884270750586`
- Type: DERIVED
- React Native File: `app/index.js`
- Notes: Serves as the native app entrypoint with institutional badge, autonomous status, and quick direct routing to Login or Faculty Dashboard.

## Screen 2: Faculty Sign In
- App Route: `/(auth)/login` (`app/(auth)/login.js`)
- Screen Name: Faculty Login - Faculty Portal
- Stitch Source: Google Stitch Project Screen
- Stitch Screen ID: `85a93b6d753245c99ec024abcd9b8f4a`
- Type: DIRECT
- React Native File: `app/(auth)/login.js`
- Notes: 1:1 mobile translation of the Stitch login interface with institutional crest, staff ERP indicator, 2FA status, password visibility toggle, switch to AC view, and demo authentication flow.

## Screen 3: Faculty Dashboard
- App Route: `/(faculty)/dashboard` (`app/(faculty)/dashboard.js`)
- Screen Name: Faculty Dashboard - Faculty Portal
- Stitch Source: Google Stitch Project Screen
- Stitch Screen ID: `98e14e6f79994470b5570087ab068e64`
- Type: DIRECT
- React Native File: `app/(faculty)/dashboard.js`
- Notes: Direct mobile port of the complete Faculty Dashboard including Identity Card (`CSE-FAC-042`), Hero Next Class card ("Starts in 45m"), 7-period timeline breakdown, quick timetable strip, assigned course metrics (`22CSX42`), and workload gauge (`6/16 Periods`).

## Screen 4: My Timetable (Personal Faculty Schedule)
- App Route: `/(faculty)/timetable` (`app/(faculty)/timetable.js`)
- Screen Name: My Timetable - Ms. C. Navamani
- Stitch Source: Google Stitch Project Screen
- Stitch Screen ID: `8ee20fde33234b37ad58c40a7eaadbab`
- Type: DIRECT
- React Native File: `app/(faculty)/timetable.js`
- Notes: Direct implementation of personal timetable view with sync badge, Today vs Weekly view switchers, Upcoming Next Class focus box, timeline slot list, day filter chips (`All`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`), and free day empty states.

## Screen 5: Weekly Master Timetable (Class CSE-C Grid)
- App Route: `/(faculty)/weekly-timetable` (`app/(faculty)/weekly-timetable.js`)
- Screen Name: Weekly Timetable - CSE-C
- Stitch Source: Google Stitch Project Screen
- Stitch Screen ID: `e6b43399dae7404a8300e8bd71a92caf`
- Type: DIRECT
- React Native File: `app/(faculty)/weekly-timetable.js`
- Notes: Direct mobile reflow of the 35-period weekly timetable matrix into day-segmented schedule cards, continuous 4-period laboratory blocks (`22CSP09`, `22CSP10`), morning/lunch/evening break ribbons, and day filter chips.

## Screen 6: Faculty Workload & Timetable Validation
- App Route: `/(faculty)/workload` (`app/(faculty)/workload.js`)
- Screen Name: Faculty Timetable Validation - Faculty Portal
- Stitch Source: Google Stitch Project Screen
- Stitch Screen ID: `000cbbd8aeeb403ebe1dd0e5f3c53d8f`
- Type: DIRECT
- React Native File: `app/(faculty)/workload.js`
- Notes: Direct conversion of the 5-point Audit Integrity Protocol (Conflict check, Institutional release, Break integrity, Curriculum match, and Workload compliance) with progress ring, metadata grid, and collapsible session breakdown.

## Screen 7: Faculty Notifications & Alerts
- App Route: `/(faculty)/notifications` (`app/(faculty)/notifications.js`)
- Screen Name: Faculty Notifications - Faculty Portal
- Stitch Source: Google Stitch Project Screen
- Stitch Screen ID: `fea03d98bf864bba82b281436c309354`
- Type: DIRECT
- React Native File: `app/(faculty)/notifications.js`
- Notes: Direct implementation of the notification stream with unread counter badges, filter chips (`All`, `Unread`, `Timetable`, `Assignment`, `Academic`), dismiss actions, and interactive navigation links.

## Screen 8: Faculty Profile & Academic Settings
- App Route: `/(faculty)/profile` (`app/(faculty)/profile.js`)
- Screen Name: Faculty Profile - Staff Information Desk
- Stitch Source: Adapted from Stitch Faculty Identity tokens and institutional ERP metadata
- Stitch Screen ID: DERIVED from `98e14e6f79994470b5570087ab068e64` & `8ee20fde33234b37ad58c40a7eaadbab`
- Type: DERIVED
- React Native File: `app/(faculty)/profile.js`
- Notes: Comprehensive profile screen showing verified academic credentials, contact details, assigned teaching load summary, calendar sync settings, and sign-out action.
