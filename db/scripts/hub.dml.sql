DO $$ 
DECLARE 
  v_start_date DATE := CURRENT_DATE;
  v_end_date DATE := v_start_date + INTERVAL '70 days';
  d RECORD;
BEGIN 
  -- Insert event types
  INSERT INTO event_types (name) VALUES 
    ('Culto de Domingo'),
    ('Culto de Quinta'),
    ('Rhema'),
    ('Escola de Ministros'),
    ('Café com Palavra'),
    ('Palavra com Futebol'),
    ('Evento Especial');
  
  -- Insert events
  FOR d IN SELECT generate_series(v_start_date, v_end_date, INTERVAL '1 day') AS day
  LOOP
    IF extract(dow FROM d.day) = 0 THEN -- Sunday
      INSERT INTO events (event_type_id, datetime) VALUES 
      ((SELECT id FROM event_types WHERE name = 'Culto de Domingo'), d.day + INTERVAL '17:30:00' HOUR TO SECOND);
    ELSIF extract(dow FROM d.day) = 4 THEN -- Thursday
      INSERT INTO events (event_type_id, datetime) VALUES 
      ((SELECT id FROM event_types WHERE name = 'Culto de Quinta'), d.day + INTERVAL '19:30:00' HOUR TO SECOND);
    ELSIF extract(dow FROM d.day) = 1 THEN -- Monday
      INSERT INTO events (event_type_id, datetime) VALUES 
      ((SELECT id FROM event_types WHERE name = 'Rhema'), d.day + INTERVAL '19:00:00' HOUR TO SECOND),
      ((SELECT id FROM event_types WHERE name = 'Escola de Ministros'), d.day + INTERVAL '19:30:00' HOUR TO SECOND);
    ELSIF extract(dow FROM d.day) = 3 THEN -- Wednesday
      INSERT INTO events (event_type_id, datetime) VALUES 
      ((SELECT id FROM event_types WHERE name = 'Rhema'), d.day + INTERVAL '19:00:00' HOUR TO SECOND);
    ELSIF extract(dow FROM d.day) = 5 THEN -- Friday
      INSERT INTO events (event_type_id, datetime) VALUES 
      ((SELECT id FROM event_types WHERE name = 'Rhema'), d.day + INTERVAL '19:00:00' HOUR TO SECOND),
      ((SELECT id FROM event_types WHERE name = 'Café com Palavra'), d.day + INTERVAL '06:00:00' HOUR TO SECOND);
    ELSIF extract(dow FROM d.day) = 6 THEN -- Saturday
      INSERT INTO events (event_type_id, datetime) VALUES 
      ((SELECT id FROM event_types WHERE name = 'Palavra com Futebol'), d.day + INTERVAL '17:00:00' HOUR TO SECOND);
    END IF;
  END LOOP;
END $$;
