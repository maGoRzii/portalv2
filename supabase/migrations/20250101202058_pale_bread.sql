-- Update the schedule_enabled feature flag to true
UPDATE feature_flags 
SET enabled = true 
WHERE name = 'schedule_enabled';