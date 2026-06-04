-- Migration 002: Seed all 104 FIFA World Cup 2026 fixtures
-- Confirmed groups and schedule from FIFA (worldcuppass.com / NBC Sports)
-- 48 teams, 12 groups of 4. Group Stage: 72 matches, Knockout: 32 matches
-- All datetimes in UTC. EDT (UTC-4) is local time for US/Canada venues.
-- Display in Riyadh (UTC+3) via Intl.DateTimeFormat.

-- ============================================================
-- GROUP STAGE — Matchday 1 (Matches 1-24, June 11-17)
-- ============================================================

-- Thu Jun 11
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(1, 'Group Stage', 'A', 'Mexico', 'South Africa', '2026-06-11T19:00:00Z', 'Estadio Azteca', 'Mexico City'),
(2, 'Group Stage', 'A', 'South Korea', 'Czechia', '2026-06-12T02:00:00Z', 'Estadio Akron', 'Guadalajara');

-- Fri Jun 12
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(3, 'Group Stage', 'B', 'Canada', 'Bosnia and Herzegovina', '2026-06-12T19:00:00Z', 'BMO Field', 'Toronto'),
(4, 'Group Stage', 'D', 'USA', 'Paraguay', '2026-06-13T01:00:00Z', 'SoFi Stadium', 'Los Angeles');

-- Sat Jun 13
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(5, 'Group Stage', 'D', 'Australia', 'Türkiye', '2026-06-13T04:00:00Z', 'BC Place', 'Vancouver'),
(6, 'Group Stage', 'B', 'Qatar', 'Switzerland', '2026-06-13T19:00:00Z', 'Levi''s Stadium', 'San Francisco Bay Area'),
(7, 'Group Stage', 'C', 'Brazil', 'Morocco', '2026-06-13T22:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(8, 'Group Stage', 'C', 'Haiti', 'Scotland', '2026-06-14T01:00:00Z', 'Gillette Stadium', 'Boston');

-- Sun Jun 14
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(9, 'Group Stage', 'E', 'Germany', 'Curaçao', '2026-06-14T17:00:00Z', 'NRG Stadium', 'Houston'),
(10, 'Group Stage', 'F', 'Netherlands', 'Japan', '2026-06-14T20:00:00Z', 'AT&T Stadium', 'Dallas'),
(11, 'Group Stage', 'E', 'Ivory Coast', 'Ecuador', '2026-06-14T23:00:00Z', 'Lincoln Financial Field', 'Philadelphia'),
(12, 'Group Stage', 'F', 'Sweden', 'Tunisia', '2026-06-15T02:00:00Z', 'Estadio BBVA', 'Monterrey');

-- Mon Jun 15
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(13, 'Group Stage', 'H', 'Spain', 'Cape Verde', '2026-06-15T16:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(14, 'Group Stage', 'G', 'Belgium', 'Egypt', '2026-06-15T19:00:00Z', 'Lumen Field', 'Seattle'),
(15, 'Group Stage', 'H', 'Saudi Arabia', 'Uruguay', '2026-06-15T22:00:00Z', 'Hard Rock Stadium', 'Miami'),
(16, 'Group Stage', 'G', 'Iran', 'New Zealand', '2026-06-16T01:00:00Z', 'SoFi Stadium', 'Los Angeles');

-- Tue Jun 16
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(17, 'Group Stage', 'I', 'France', 'Senegal', '2026-06-16T19:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(18, 'Group Stage', 'I', 'Iraq', 'Norway', '2026-06-16T22:00:00Z', 'Gillette Stadium', 'Boston'),
(19, 'Group Stage', 'J', 'Argentina', 'Algeria', '2026-06-17T01:00:00Z', 'Arrowhead Stadium', 'Kansas City');

-- Wed Jun 17
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(20, 'Group Stage', 'J', 'Austria', 'Jordan', '2026-06-17T04:00:00Z', 'Levi''s Stadium', 'San Francisco Bay Area'),
(21, 'Group Stage', 'K', 'Portugal', 'DR Congo', '2026-06-17T17:00:00Z', 'NRG Stadium', 'Houston'),
(22, 'Group Stage', 'L', 'England', 'Croatia', '2026-06-17T20:00:00Z', 'AT&T Stadium', 'Dallas'),
(23, 'Group Stage', 'L', 'Ghana', 'Panama', '2026-06-17T23:00:00Z', 'BMO Field', 'Toronto'),
(24, 'Group Stage', 'K', 'Uzbekistan', 'Colombia', '2026-06-18T02:00:00Z', 'Estadio Azteca', 'Mexico City');

-- ============================================================
-- GROUP STAGE — Matchday 2 (Matches 25-48, June 18-23)
-- ============================================================

-- Thu Jun 18
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(25, 'Group Stage', 'A', 'Czechia', 'South Africa', '2026-06-18T16:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(26, 'Group Stage', 'B', 'Switzerland', 'Bosnia and Herzegovina', '2026-06-18T19:00:00Z', 'SoFi Stadium', 'Los Angeles'),
(27, 'Group Stage', 'B', 'Canada', 'Qatar', '2026-06-18T22:00:00Z', 'BC Place', 'Vancouver'),
(28, 'Group Stage', 'A', 'Mexico', 'South Korea', '2026-06-19T01:00:00Z', 'Estadio Akron', 'Guadalajara');

-- Fri Jun 19
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(29, 'Group Stage', 'D', 'Türkiye', 'Paraguay', '2026-06-19T04:00:00Z', 'Levi''s Stadium', 'San Francisco Bay Area'),
(30, 'Group Stage', 'D', 'USA', 'Australia', '2026-06-19T19:00:00Z', 'Lumen Field', 'Seattle'),
(31, 'Group Stage', 'C', 'Scotland', 'Morocco', '2026-06-19T22:00:00Z', 'Gillette Stadium', 'Boston'),
(32, 'Group Stage', 'C', 'Brazil', 'Haiti', '2026-06-20T00:30:00Z', 'Lincoln Financial Field', 'Philadelphia');

-- Sat Jun 20
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(33, 'Group Stage', 'F', 'Netherlands', 'Sweden', '2026-06-20T17:00:00Z', 'NRG Stadium', 'Houston'),
(34, 'Group Stage', 'E', 'Germany', 'Ivory Coast', '2026-06-20T20:00:00Z', 'BMO Field', 'Toronto'),
(35, 'Group Stage', 'E', 'Ecuador', 'Curaçao', '2026-06-21T00:00:00Z', 'Arrowhead Stadium', 'Kansas City'),
(36, 'Group Stage', 'F', 'Tunisia', 'Japan', '2026-06-21T04:00:00Z', 'Estadio BBVA', 'Monterrey');

-- Sun Jun 21
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(37, 'Group Stage', 'H', 'Spain', 'Saudi Arabia', '2026-06-21T16:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(38, 'Group Stage', 'G', 'Belgium', 'Iran', '2026-06-21T19:00:00Z', 'SoFi Stadium', 'Los Angeles'),
(39, 'Group Stage', 'H', 'Uruguay', 'Cape Verde', '2026-06-21T22:00:00Z', 'Hard Rock Stadium', 'Miami'),
(40, 'Group Stage', 'G', 'New Zealand', 'Egypt', '2026-06-22T01:00:00Z', 'BC Place', 'Vancouver');

-- Mon Jun 22
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(41, 'Group Stage', 'J', 'Argentina', 'Austria', '2026-06-22T17:00:00Z', 'AT&T Stadium', 'Dallas'),
(42, 'Group Stage', 'I', 'France', 'Iraq', '2026-06-22T21:00:00Z', 'Lincoln Financial Field', 'Philadelphia'),
(43, 'Group Stage', 'I', 'Norway', 'Senegal', '2026-06-23T00:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(44, 'Group Stage', 'J', 'Jordan', 'Algeria', '2026-06-23T03:00:00Z', 'Levi''s Stadium', 'San Francisco Bay Area');

-- Tue Jun 23
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(45, 'Group Stage', 'K', 'Portugal', 'Uzbekistan', '2026-06-23T17:00:00Z', 'NRG Stadium', 'Houston'),
(46, 'Group Stage', 'L', 'England', 'Ghana', '2026-06-23T20:00:00Z', 'Gillette Stadium', 'Boston'),
(47, 'Group Stage', 'L', 'Panama', 'Croatia', '2026-06-23T23:00:00Z', 'BMO Field', 'Toronto'),
(48, 'Group Stage', 'K', 'Colombia', 'DR Congo', '2026-06-24T02:00:00Z', 'Estadio Akron', 'Guadalajara');

-- ============================================================
-- GROUP STAGE — Matchday 3 (Matches 49-72, June 24-27)
-- ============================================================

-- Wed Jun 24
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(49, 'Group Stage', 'B', 'Switzerland', 'Canada', '2026-06-24T19:00:00Z', 'BC Place', 'Vancouver'),
(50, 'Group Stage', 'B', 'Bosnia and Herzegovina', 'Qatar', '2026-06-24T19:00:00Z', 'Lumen Field', 'Seattle'),
(51, 'Group Stage', 'C', 'Scotland', 'Brazil', '2026-06-24T22:00:00Z', 'Hard Rock Stadium', 'Miami'),
(52, 'Group Stage', 'C', 'Morocco', 'Haiti', '2026-06-24T22:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(53, 'Group Stage', 'A', 'Czechia', 'Mexico', '2026-06-25T01:00:00Z', 'Estadio Azteca', 'Mexico City'),
(54, 'Group Stage', 'A', 'South Africa', 'South Korea', '2026-06-25T01:00:00Z', 'Estadio BBVA', 'Monterrey');

-- Thu Jun 25
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(55, 'Group Stage', 'E', 'Curaçao', 'Ivory Coast', '2026-06-25T20:00:00Z', 'Lincoln Financial Field', 'Philadelphia'),
(56, 'Group Stage', 'E', 'Ecuador', 'Germany', '2026-06-25T20:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(57, 'Group Stage', 'F', 'Japan', 'Sweden', '2026-06-25T23:00:00Z', 'AT&T Stadium', 'Dallas'),
(58, 'Group Stage', 'F', 'Tunisia', 'Netherlands', '2026-06-25T23:00:00Z', 'Arrowhead Stadium', 'Kansas City'),
(59, 'Group Stage', 'D', 'Türkiye', 'USA', '2026-06-26T02:00:00Z', 'SoFi Stadium', 'Los Angeles'),
(60, 'Group Stage', 'D', 'Paraguay', 'Australia', '2026-06-26T02:00:00Z', 'Levi''s Stadium', 'San Francisco Bay Area');

-- Fri Jun 26
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(61, 'Group Stage', 'I', 'Norway', 'France', '2026-06-26T19:00:00Z', 'Gillette Stadium', 'Boston'),
(62, 'Group Stage', 'I', 'Senegal', 'Iraq', '2026-06-26T19:00:00Z', 'BMO Field', 'Toronto'),
(63, 'Group Stage', 'H', 'Cape Verde', 'Saudi Arabia', '2026-06-27T00:00:00Z', 'NRG Stadium', 'Houston'),
(64, 'Group Stage', 'H', 'Uruguay', 'Spain', '2026-06-27T00:00:00Z', 'Estadio Akron', 'Guadalajara'),
(65, 'Group Stage', 'G', 'Egypt', 'Iran', '2026-06-27T03:00:00Z', 'Lumen Field', 'Seattle'),
(66, 'Group Stage', 'G', 'New Zealand', 'Belgium', '2026-06-27T03:00:00Z', 'BC Place', 'Vancouver');

-- Sat Jun 27
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(67, 'Group Stage', 'L', 'Panama', 'England', '2026-06-27T21:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(68, 'Group Stage', 'L', 'Croatia', 'Ghana', '2026-06-27T21:00:00Z', 'Lincoln Financial Field', 'Philadelphia'),
(69, 'Group Stage', 'K', 'Colombia', 'Portugal', '2026-06-27T23:30:00Z', 'Hard Rock Stadium', 'Miami'),
(70, 'Group Stage', 'K', 'DR Congo', 'Uzbekistan', '2026-06-27T23:30:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(71, 'Group Stage', 'J', 'Algeria', 'Austria', '2026-06-28T02:00:00Z', 'Arrowhead Stadium', 'Kansas City'),
(72, 'Group Stage', 'J', 'Jordan', 'Argentina', '2026-06-28T02:00:00Z', 'AT&T Stadium', 'Dallas');

-- ============================================================
-- KNOCKOUT STAGE — Round of 32 (Matches 73-88, June 28 - Jul 3)
-- ============================================================

INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(73, 'Round of 32', NULL, '2nd Group A', '2nd Group B', '2026-06-28T19:00:00Z', 'SoFi Stadium', 'Los Angeles'),
(74, 'Round of 32', NULL, '1st Group E', '3rd Best (A/B/C/D/F)', '2026-06-29T17:00:00Z', 'Gillette Stadium', 'Boston'),
(75, 'Round of 32', NULL, '1st Group F', '2nd Group C', '2026-06-30T01:00:00Z', 'Estadio BBVA', 'Monterrey'),
(76, 'Round of 32', NULL, '1st Group C', '2nd Group F', '2026-06-29T20:00:00Z', 'NRG Stadium', 'Houston'),
(77, 'Round of 32', NULL, '1st Group I', '3rd Best (C/D/F/G/H)', '2026-06-30T21:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(78, 'Round of 32', NULL, '2nd Group E', '2nd Group I', '2026-06-30T17:00:00Z', 'AT&T Stadium', 'Dallas'),
(79, 'Round of 32', NULL, '1st Group A', '3rd Best (C/E/F/H/I)', '2026-07-01T01:00:00Z', 'Estadio Azteca', 'Mexico City'),
(80, 'Round of 32', NULL, '1st Group L', '3rd Best (E/H/I/J/K)', '2026-07-01T16:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(81, 'Round of 32', NULL, '1st Group D', '3rd Best (B/E/F/I/J)', '2026-07-02T00:00:00Z', 'Levi''s Stadium', 'San Francisco Bay Area'),
(82, 'Round of 32', NULL, '1st Group G', '3rd Best (A/E/H/I/J)', '2026-07-01T20:00:00Z', 'Lumen Field', 'Seattle'),
(83, 'Round of 32', NULL, '2nd Group K', '2nd Group L', '2026-07-02T23:00:00Z', 'BMO Field', 'Toronto'),
(84, 'Round of 32', NULL, '1st Group H', '2nd Group J', '2026-07-02T19:00:00Z', 'SoFi Stadium', 'Los Angeles'),
(85, 'Round of 32', NULL, '1st Group B', '3rd Best (E/F/G/I/J)', '2026-07-03T03:00:00Z', 'BC Place', 'Vancouver'),
(86, 'Round of 32', NULL, '1st Group J', '2nd Group H', '2026-07-03T22:00:00Z', 'Hard Rock Stadium', 'Miami'),
(87, 'Round of 32', NULL, '1st Group K', '3rd Best (D/E/I/J/L)', '2026-07-04T01:30:00Z', 'Arrowhead Stadium', 'Kansas City'),
(88, 'Round of 32', NULL, '2nd Group D', '2nd Group G', '2026-07-03T18:00:00Z', 'AT&T Stadium', 'Dallas');

-- ============================================================
-- KNOCKOUT STAGE — Round of 16 (Matches 89-96, July 4-7)
-- ============================================================

INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(89, 'Round of 16', NULL, 'Winner 74', 'Winner 77', '2026-07-04T21:00:00Z', 'Lincoln Financial Field', 'Philadelphia'),
(90, 'Round of 16', NULL, 'Winner 73', 'Winner 75', '2026-07-04T17:00:00Z', 'NRG Stadium', 'Houston'),
(91, 'Round of 16', NULL, 'Winner 76', 'Winner 78', '2026-07-05T20:00:00Z', 'MetLife Stadium', 'New York/New Jersey'),
(92, 'Round of 16', NULL, 'Winner 79', 'Winner 80', '2026-07-06T00:00:00Z', 'Estadio Azteca', 'Mexico City'),
(93, 'Round of 16', NULL, 'Winner 83', 'Winner 84', '2026-07-06T19:00:00Z', 'AT&T Stadium', 'Dallas'),
(94, 'Round of 16', NULL, 'Winner 81', 'Winner 82', '2026-07-07T00:00:00Z', 'Lumen Field', 'Seattle'),
(95, 'Round of 16', NULL, 'Winner 86', 'Winner 88', '2026-07-07T16:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta'),
(96, 'Round of 16', NULL, 'Winner 85', 'Winner 87', '2026-07-07T20:00:00Z', 'BC Place', 'Vancouver');

-- ============================================================
-- KNOCKOUT STAGE — Quarter-Finals (Matches 97-100, July 9-11)
-- ============================================================

INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(97, 'Quarter-Final', NULL, 'Winner 89', 'Winner 90', '2026-07-09T20:00:00Z', 'Gillette Stadium', 'Boston'),
(98, 'Quarter-Final', NULL, 'Winner 93', 'Winner 94', '2026-07-10T19:00:00Z', 'SoFi Stadium', 'Los Angeles'),
(99, 'Quarter-Final', NULL, 'Winner 91', 'Winner 92', '2026-07-11T21:00:00Z', 'Hard Rock Stadium', 'Miami'),
(100, 'Quarter-Final', NULL, 'Winner 95', 'Winner 96', '2026-07-12T01:00:00Z', 'Arrowhead Stadium', 'Kansas City');

-- ============================================================
-- KNOCKOUT STAGE — Semi-Finals (Matches 101-102, July 14-15)
-- ============================================================

INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(101, 'Semi-Final', NULL, 'Winner 97', 'Winner 98', '2026-07-14T19:00:00Z', 'AT&T Stadium', 'Dallas'),
(102, 'Semi-Final', NULL, 'Winner 99', 'Winner 100', '2026-07-15T19:00:00Z', 'Mercedes-Benz Stadium', 'Atlanta');

-- ============================================================
-- KNOCKOUT STAGE — Third Place (Match 103, July 18)
-- ============================================================

INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(103, 'Third Place', NULL, 'Loser 101', 'Loser 102', '2026-07-18T21:00:00Z', 'Hard Rock Stadium', 'Miami');

-- ============================================================
-- KNOCKOUT STAGE — FINAL (Match 104, July 19)
-- ============================================================

INSERT INTO matches (match_number, stage, group_name, home_team, away_team, match_datetime, stadium, city) VALUES
(104, 'Final', NULL, 'Winner 101', 'Winner 102', '2026-07-19T19:00:00Z', 'MetLife Stadium', 'New York/New Jersey');
