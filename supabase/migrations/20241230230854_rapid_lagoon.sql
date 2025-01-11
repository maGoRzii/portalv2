/*
  # Add location fields to lanzadera_records

  1. Changes
    - Add latitude and longitude columns
    - Add location_error column for cases where geolocation fails
*/

ALTER TABLE lanzadera_records
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS location_error text;