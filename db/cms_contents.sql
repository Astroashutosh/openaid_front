-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2026 at 02:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helping_plan`
--

-- --------------------------------------------------------

--
-- Table structure for table `cms_contents`
--

CREATE TABLE `cms_contents` (
  `id` int(11) NOT NULL,
  `type` enum('testimonial','withdrawal_proof') DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `member` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `amount` double(18,2) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','pending','approved','rejected') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cms_contents`
--

INSERT INTO `cms_contents` (`id`, `type`, `title`, `member`, `description`, `video_url`, `thumbnail_url`, `amount`, `reference`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'testimonial', 'Test', 'Ashutosh', 'dfhnnfnfnfgvnvnhnhhgfjhgjfgjgf', 'https://youtu.be/YBB3GbluHjA?si=m_pe-6Xsd6Xml2x9', 'https://img.magnific.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740&q=80', NULL, NULL, NULL, 'draft', '2026-10-19 07:33:46', '2026-10-19 07:33:46'),
(2, 'withdrawal_proof', 'First', NULL, NULL, NULL, NULL, 6557657.00, 'sddgfdhfjfgjhgfjgjgjkjkghkg', '/uploads/cms/proofs/5cc153ae-ebe6-44ba-aa17-8689a4e83a21.png', 'pending', '2026-10-19 07:36:03', '2026-10-19 07:36:03'),
(3, 'testimonial', 'Openaid', 'Admin', 'SAgdsdfdhngjgghjh', 'https://youtu.be/LNfX-M_o4kk?si=TSM-8y2WWVAyf4l4', NULL, NULL, NULL, NULL, 'draft', '2026-10-19 08:32:08', '2026-10-19 08:32:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cms_contents`
--
ALTER TABLE `cms_contents`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cms_contents`
--
ALTER TABLE `cms_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
