
-- phpMyAdmin SQL Dump
-- version 4.0.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 07, 2014 at 10:31 AM
-- Server version: 5.5.32-0ubuntu0.12.04.1
-- PHP Version: 5.3.10-1ubuntu3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `curiosity`
--

-- --------------------------------------------------------

--
-- Table structure for table `pictures`
--

DROP TABLE IF EXISTS `pictures`;
CREATE TABLE IF NOT EXISTS `pictures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `temp_name` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `sol` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `original_name` (`original_name`),
  UNIQUE KEY `temp_name` (`temp_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `pictures`
--

INSERT INTO `pictures` (`id`, `original_name`, `name`, `temp_name`, `date`, `sol`) VALUES
(1, 'a', 'a', 'a', '2014-01-01 00:00:00', 493);

