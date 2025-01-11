/*
  # Add new feature flags

  1. New Feature Flags
    - holidays_enabled: For controlling the holidays form
    - lanzadera_enabled: For controlling the shuttle check-in/out
    - schedule_enabled: For controlling schedule changes (already disabled by default)

  2. Changes
    - Add new feature flags with default values
*/

-- Insert new feature flags
INSERT INTO feature_flags (name, enabled)
VALUES 
  ('holidays_enabled', true),
  ('lanzadera_enabled', true),
  ('schedule_enabled', false)
ON CONFLICT (name) DO NOTHING;