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
SELECT habits.habit_id, habits.habit_name, SUM(unit_volume), habits.target/7 as daily_target, habits.target as weekly_target, SUM(unit_volume)/(habits.target/7)*100 as daily_percent_complete, SUM(unit_volume)/(habits.target)*100 as weekly_percent_complete, SUM(unit_volume)/(habits.target/7)*100 >= 100 as daily_done, SUM(unit_volume)/(habits.target/7)*100 >= 100 as weekly_done
FROM habit_events
RIGHT JOIN habits ON habit_events.habit_id=habits.habit_id
WHERE time > date_trunc('week', now())
GROUP BY habits.habit_id, habits.habit_name, habits.target;

# Get daily and 
WITH x
     AS (SELECT habits.habit_id   AS habit_id,
                habits.habit_name,
                0                 AS unit_volume,
                habits.target / 7 AS daily_target,
                habits.target     AS weekly_target
         FROM   habits
         UNION
         SELECT habits.habit_id   AS habit_id,
                habits.habit_name,
                Sum(unit_volume)  AS unit_volume,
                habits.target / 7 AS daily_target,
                habits.target     AS weekly_target
         FROM   habit_events
                RIGHT JOIN habits
                        ON habit_events.habit_id = habits.habit_id
         WHERE  time > Date_trunc('week', Now())
         GROUP  BY habits.habit_id,
                   habits.habit_name,
                   habits.target)
SELECT habit_id,
       habit_name,
       daily_target,
       weekly_target,
       Sum(unit_volume) / daily_target * 100         AS daily_percent_complete,
       Sum(unit_volume) / weekly_target * 100        AS weekly_percent_complete,
       Sum(unit_volume) / weekly_target * 100 >= 100 AS daily_done,
       Sum(unit_volume) / daily_target * 100 >= 100  AS weekly_done
FROM   x
GROUP  BY habit_id,
          habit_name,
          daily_target,
          weekly_target; 

# Get daily and 
WITH x
     AS (SELECT habits.habit_id   AS habit_id,
                habits.habit_name,
                habits.unit,
                0                 AS daily_volume,
                0                 AS weekly_volume,
                habits.target / 7 AS daily_target,
                habits.target     AS weekly_target
         FROM   habits
         UNION
         SELECT habits.habit_id   AS habit_id,
                habits.habit_name,
                                habits.unit,

                0                 AS daily_volume,
                Sum(unit_volume)  AS weekly_volume,
                habits.target / 7 AS daily_target,
                habits.target     AS weekly_target
         FROM   habit_events
                RIGHT JOIN habits
                        ON habit_events.habit_id = habits.habit_id
         WHERE  time > Date_trunc('week', Now())
         GROUP  BY habits.habit_id,
                   habits.habit_name,
                   habits.target
         UNION
         SELECT habits.habit_id   AS habit_id,
                habits.habit_name,
                                habits.unit,

                Sum(unit_volume)  AS daily_volume,
                0                 AS weekly_volume,
                habits.target / 7 AS daily_target,
                habits.target     AS weekly_target
         FROM   habit_events
                RIGHT JOIN habits
                        ON habit_events.habit_id = habits.habit_id
         WHERE  time > Date_trunc('week', Now())
         GROUP  BY habits.habit_id,
                   habits.habit_name,
                   habits.target)
SELECT habit_id,
       habit_name,
       unit
       max(daily_volume),
       max(weekly_volume),
       daily_target,
       weekly_target,
       Sum(unit_volume) / daily_target * 100         AS daily_percent_complete,
       Sum(unit_volume) / weekly_target * 100        AS weekly_percent_complete,
       Sum(unit_volume) / weekly_target * 100 >= 100 AS daily_done,
       Sum(unit_volume) / daily_target * 100 >= 100  AS weekly_done
FROM   x
GROUP  BY habit_id,
          habit_name,
          daily_target,
          weekly_target; 
