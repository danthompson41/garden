# test_habits.csv

DELETE FROM habits;

\COPY habits(habit_id,habit_name,unit,target,status) FROM '/Users/danielthompson/projects/Garden/test_data/test_habits.csv' DELIMITER ',' CSV HEADER;

# test_habit_events.csv

DELETE FROM habit_events;

\COPY habit_events(time,habit_id,unit_volume) FROM '/Users/danielthompson/projects/Garden/test_data/test_habit_events.csv' DELIMITER ',' CSV HEADER;