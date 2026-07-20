# Immutable admin and operational logs

Nyra's MVP Admin Panel will expose three read-only log views: learner Activity Logs derived from learning records, immutable Admin Logs written for every administrator mutation, and sanitized Error Logs captured at admin API and service boundaries. Admin audit entries record the actor, action, entity, timestamp, request metadata, and safe before/after changes; Basic Auth actions use a `BASIC_AUTH_ADMIN` system actor because individual attribution is unavailable, and no log may contain passwords, tokens, submitted answers, or sensitive request payloads.
