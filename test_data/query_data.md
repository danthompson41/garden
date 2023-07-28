# Get one day's info for all habits
SELECT * FROM habit_events srt
WHERE time > date_trunc('day', now());

# Get one week's info for all habits
SELECT * FROM habit_events srt
WHERE time > now() - INTERVAL '7 days';

# Alternative
SELECT * FROM habit_events srt
WHERE time > date_trunc('week', now());

# Get last month's data for all habits
SELECT * FROM habit_events srt
WHERE time > now() - INTERVAL '28 days';

# Get all data from last month for a specific habit
SELECT * FROM habit_events srt
WHERE time > now() - INTERVAL '28 days'
AND habit_id = 'b40a3c0f-5e17-4d25-bcee-23ba7eeb5a0a';

# Get sum of time spent last month for a specific habit
SELECT habit_id, SUM(unit_volume) FROM habit_events
WHERE time > now() - INTERVAL '28 days'
AND habit_id = 'b40a3c0f-5e17-4d25-bcee-23ba7eeb5a0a'
GROUP BY habit_id;

# Get sum of time spent last month for all habits
SELECT habit_id, SUM(unit_volume) FROM habit_events
WHERE time > now() - INTERVAL '28 days'
GROUP BY habit_id;

# Get names, and the total amount done this week, with a "is this done" flag
SELECT habits.habit_name, SUM(unit_volume), habits.target, SUM(unit_volume)/habits.target*100 as percent_complete, SUM(unit_volume)/habits.target*100 >= 100 as done
FROM habit_events
LEFT JOIN habits ON habit_events.habit_id=habits.habit_id
WHERE time > date_trunc('week', now())
GROUP BY habits.habit_name, habits.target;

# Get names, and the total amount done today, with a "is this done" flag
SELECT habits.habit_name, SUM(unit_volume), habits.target/7 as daily_target, SUM(unit_volume)/(habits.target/7)*100 as daily_percent_complete, SUM(unit_volume)/(habits.target/7)*100 >= 100 as done
FROM habit_events
LEFT JOIN habits ON habit_events.habit_id=habits.habit_id
WHERE time > date_trunc('week', now())
GROUP BY habits.habit_name, habits.target;