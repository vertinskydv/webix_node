-- --------------------------------------------------------
-- Хост:                         localhost
-- Версия сервера:               5.7.20-log - MySQL Community Server (GPL)
-- Операционная система:         Win64
-- HeidiSQL Версия:              9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Дамп данных таблицы wbx_db.equipment: ~3 rows (приблизительно)
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` (`id`, `name`, `type`, `serial_number`, `purchase_time`, `state`, `studio_id`, `img_url`) VALUES
	('2d52754jae0esjf', 'Yamaha 43', 'Accoustic Guitar', '2222222222', '2017-11-08 00:00', 'used', '2d524tojaau19od', '1511534157789-YF325DGUITAR.jpg'),
	('2d52754jae0hk6w', 'Jackson RP-5 111', 'Guitar 111', '111 ', '2017-11-05 00:00', 'not_used', '2d52754jae0frua', '1511534286941-Jackson.jpg'),
	('2d521l4jae5fujl', 'ADASD', 'asdasdasd', 'w23123123', '2017-11-14 00:00', 'used', '2d525wgjab5n5ln', '1511542605128-Data (4).xlsx');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;

-- Дамп данных таблицы wbx_db.positions: ~2 rows (приблизительно)
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` (`id`, `value`) VALUES
	('musician', 'Musician'),
	('produccer', 'Produccer'),
	('admin', 'Administator'),
	('sound_engineer', 'Sound Engineer');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;

-- Дамп данных таблицы wbx_db.staff: ~32 rows (приблизительно)
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` (`id`, `name`, `studio_id`, `rate`, `position`) VALUES
	('2d524tojaau20e6', 'Bob Simon Gnr', '2d524tojaau2yx6', 0.8, 'musician'),
	('2d525xkjaav6non', '007', '2d524tojaau19od', 0.6, 'musician'),
	('2d525xkjaav71n3', '006', '2d525wgjab5n5ln', 0.1, 'musician'),
	('2d521psjab1k4to', '008', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1k8x5', '009', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1ki6w', '011', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1kuk2', '012', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1n0jl', '013', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1n4pt', '014', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1n8dt', '015', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1nchd', '016', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1ngnt', '017', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1nkrm', '018', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1nsia', '019', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1o03s', '020', '2d524tojaau2yx6', 0.1, 'musician'),
	('2d521psjab1o3rs', '021', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1o7bl', '022', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1ob9t', '023', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1ofpt', '024', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1omeh', '025', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1or3s', '026', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1pcnk', '027', '2d524tojaau19od', 0.15, 'musician'),
	('2d521psjab1pgtc', '028', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1pki0', '029', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1posi', '030', '2d524tojaau19od', 0.1, 'musician'),
	('2d521psjab1psq9', '031', '2d524tojaau19od', 0.1, 'musician'),
	('2d525wgjab5rmse', '001', '2d524tojaau2yx6', 1, 'musician'),
	('2d525wgjab5rw3x', '002', '2d525wgjab5n5ln', 1, 'admin'),
	('2d525wgjab5s4rp', '003', '2d525wgjab5n5ln', 0.1, 'sound_engineer'),
	('2d525wgjab5se0v', '004', '2d525wgjab5n5ln', 1, 'sound_engineer'),
	('2d525wgjab5smva', '005', '2d525wgjab5n5ln', 1, 'sound_engineer'),
	('2d523fojacdtbep', 'Bob Dylan', '2d524tojaau19od', 0.5, 'musician');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;

-- Дамп данных таблицы wbx_db.studios: ~4 rows (приблизительно)
/*!40000 ALTER TABLE `studios` DISABLE KEYS */;
INSERT INTO `studios` (`id`, `name`, `address`, `staff_id`) VALUES
	('2d524tojaau19od', 'Abbey Road', 'Abbey Road str. 3, UK, London', '["2d525xkjaav5u2d","2d525xkjaav4ifz","2d521psjab1k4to","2d521psjab1k8x5","2d521psjab1ki6w","2d521psjab1kuk2","2d521psjab1n0jl","2d521psjab1n4pt","2d521psjab1n8dt","2d521psjab1nchd","2d521psjab1ngnt","2d521psjab1nkrm","2d521psjab1nsia","2d521psjab1o3rs","2d521psjab1o7bl","2d521psjab1ob9t","2d521psjab1ofpt","2d521psjab1omeh","2d521psjab1or3s","2d521psjab1pcnk","2d521psjab1pgtc","2d521psjab1pki0","2d521psjab1posi","2d521psjab1psq9","2d525xkjaav6non","2d523fojacdtbep"]'),
	('2d524tojaau2yx6', 'Monkey Pipe', 'Kalvariyskaya str. 3, Belarus, Minsk', '["2d524tojaau20e6","2d525xkjaav6a2n","2d525xkjaav6hvi","2d521psjab1o03s","2d525xkjaav6txy","2d525wgjab5rmse"]'),
	('2d525wgjab5n5ln', 'Boom Room', 'Oktsiabrskaya 3 Minsk Belarus', '["2d525xkjaav71n3","2d525wgjab5rw3x","2d525wgjab5s4rp","2d525wgjab5se0v","2d525wgjab5smva"]'),
	('2d52754jae0frua', 'Growling Far', 'Oktsiabrskaya 3, Minsk, Belarus', NULL);
/*!40000 ALTER TABLE `studios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
