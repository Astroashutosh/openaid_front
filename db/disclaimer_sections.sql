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
-- Table structure for table `disclaimer_sections`
--

CREATE TABLE `disclaimer_sections` (
  `id` int(11) NOT NULL,
  `section_key` varchar(255) NOT NULL DEFAULT 'description',
  `label` varchar(255) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `icon` varchar(60) NOT NULL DEFAULT 'FileText',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disclaimer_sections`
--

INSERT INTO `disclaimer_sections` (`id`, `section_key`, `label`, `title`, `content`, `icon`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'description', NULL, 'General Disclaimer', 'Information provided on this website is for general informational purposes only. It does not constitute financial, investment, tax, or legal advice.', 'FileText', 1, 0, '2026-10-19 08:53:36', '2026-10-19 10:06:24'),
(2, 'description', NULL, 'Donations and Financial Risk', 'Participation in P2P donation activities involves financial risks. Matching participants and receipt of donations may be uncertain. Never commit funds you cannot afford to lose.', 'Wallet', 2, 0, '2026-10-19 08:53:36', '2026-10-19 10:07:54'),
(3, 'description', NULL, 'No Guaranteed Income', 'We do not guarantee income, profits, commissions, or financial independence. Past results and examples do not guarantee future outcomes.', 'ChartNoAxesCombined', 5, 0, '2026-10-19 08:53:36', '2026-10-19 10:17:08'),
(4, 'description', NULL, 'Blockchain and Smart Contract Risks', 'Transactions may be irreversible after confirmation. Network fees, incorrect wallet addresses, vulnerabilities, and technical issues may affect transactions.', 'Layers3', 6, 0, '2026-10-19 08:53:36', '2026-10-19 10:18:41'),
(5, 'description', '', 'Manual and Automatic Recommitments', 'Where enabled, eligible users may choose manual or automatic recommitment according to the published program rules and applicable authorization requirements.hf', 'RefreshCw', 6, 1, '2026-10-19 08:53:36', '2026-10-19 11:52:34'),
(6, 'description', NULL, 'Recommitment Fees and Eligibility', 'A five-hour recommitment window and a 5% donation-wallet charge may apply to qualifying automatic recommitments. Subscription and at least three package credits may also be required under applicable rules.', 'Clock3', 6, 1, '2026-10-19 08:53:36', '2026-10-19 08:53:36'),
(7, 'description', NULL, 'Six-Times Recommitment Limit', 'Where implemented, the six-times limit applies separately to each qualifying donation, not to the entire account. Official rules define the calculation and qualifying transactions.', 'Layers3', 7, 1, '2026-10-19 08:53:36', '2026-10-19 08:53:36'),
(8, 'description', NULL, 'Withdrawal Policy', 'Withdrawal availability, processing times, fees, and eligibility are subject to the applicable policy, technical conditions, and law.', 'Wallet', 8, 1, '2026-10-19 08:53:36', '2026-10-19 08:53:36'),
(9, 'description', NULL, 'Testimonials and Withdrawal Proofs', 'Testimonials, videos, and withdrawal proofs represent individual experiences. They must not be interpreted as guarantees of similar outcomes for other users.', 'FileText', 9, 1, '2026-10-19 08:53:36', '2026-10-19 08:53:36'),
(10, 'description', NULL, 'Future Products and Platform Updates', 'Additional products and features may be introduced in the future. Planned features may require separate terms, eligibility criteria, and risk disclosures.', 'Globe', 10, 1, '2026-10-19 08:53:36', '2026-10-19 08:53:36'),
(11, 'description', NULL, 'Legal and Regulatory Notice', 'Services may not be permitted in every jurisdiction. Users should understand the laws applicable to their participation and relevant restrictions.', 'Scale', 11, 1, '2026-10-19 08:53:36', '2026-10-19 08:53:36'),
(15, 'notice', 'Important Risk Notice', 'Please make informed decisions', 'Do not participate solely on the basis of promotional statements, testimonials, or withdrawal screenshots. Donations and blockchain transactions involve risks, and financial outcomes are not guaranteed. Review applicable  conditions and fees before committing funds.', 'Wallet', 0, 1, '2026-10-19 11:07:19', '2026-10-19 11:53:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `disclaimer_sections`
--
ALTER TABLE `disclaimer_sections`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `disclaimer_sections`
--
ALTER TABLE `disclaimer_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
